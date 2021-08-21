import { ethers } from 'ethers'
import { abi as collar, pools, poolList, poolConfig, signerNoAccount } from '@/config'
import { useSnackbar } from 'notistack'
import { Price } from '@/hooks'

const ZERO = ethers.constants.Zero
const abiToken = [
  'function transfer(address, uint256) external',
  'function approve(address, uint256) external',
  'function balanceOf(address) external view returns (uint256)',
  'function allowance(address, address) external view returns (uint256)',
]
const abiPool = [
  'function earned(address) external view returns (uint256)',
  'function sx() external view returns (uint256)',
  'function sy() external view returns (uint256)',
  'function sk() external view returns (uint256)',
  'function swap_fee() public pure returns (uint256)',
]

const controller = (address, signer, abi) => {
  return new ethers.Contract(address, abi || collar, signer)
}
const format = (num, n) => {
  const res = parseFloat(ethers.utils.formatEther(num))
  return n ? res.toFixed(n) : res
}
const unformat = (num) => ethers.utils.parseEther(String(num))
const formatMap = (data) => data.map((v) => format(v))
const with_loss = (x) => x.mul(995).div(1000)

const calc_apy_basic = ([sx, sy, sk], [bond, want], swap_sqp) => {
  const one = ethers.utils.parseEther('1')
  const mul = ethers.BigNumber.from(1e9)
  return sx
    .add(bond || ZERO)
    .add(sk)
    .mul(one)
    .div(sy.add(want || ZERO).add(sk.mul(swap_sqp).div(mul)))
    .sub(one)
}

const calc_apy = ({ swap: { sx, sy, sk } }, [bond, want], { swap_sqp, expiry_time }) =>
  (format(calc_apy_basic([sx, sy, sk], [bond, want], swap_sqp)) * 3155692600000) / (expiry_time * 1000 - new Date())

const calc_slip = ({ swap: { sx, sy, sk } }, [bond, want], { swap_sqp, expiry_time }) =>
  (format(
    calc_apy_basic([sx, sy, sk], [bond, want], swap_sqp).sub(calc_apy_basic([sx, sy, sk], [null, null], swap_sqp)),
  ) *
    3155692600000) /
  (expiry_time * 1000 - new Date())

const fetch_state = async (pool, signer) => {
  const init = { balance: {}, allowance: {}, earned: {}, swap: {} }
  const me = await signer.getAddress()
  const collar = controller(poolConfig.collar, signer, abiToken)
  const bond = controller(pool.bond.addr, signer, abiToken)
  const want = controller(pool.want.addr, signer, abiToken)
  const call = controller(pool.call.addr, signer, abiToken)
  const coll = controller(pool.coll.addr, signer, abiToken)
  const clpt = controller(pool.addr, signer, abiToken)
  const poolCt = controller(pool.addr, signer, abiPool)
  ;[
    init.balance.bond,
    init.balance.want,
    init.balance.call,
    init.balance.coll,
    init.balance.clpt,
    init.balance.collar,
    init.allowance.bond,
    init.allowance.want,
    init.earned.collar,
    init.swap.sx,
    init.swap.sy,
    init.swap.sk,
    init.swap.fee,
  ] = await Promise.all([
    bond.balanceOf(me),
    want.balanceOf(me),
    call.balanceOf(me),
    coll.balanceOf(me),
    clpt.balanceOf(me),
    collar.balanceOf(me),
    bond.allowance(me, pool.addr),
    want.allowance(me, pool.addr),
    poolCt.earned(me),
    poolCt.sx(),
    poolCt.sy(),
    poolCt.sk(),
    poolCt.swap_fee(),
  ])
  init.apy = calc_apy(init, [null, null], pool)
  return init
}

const mypage_data = async (signer) => {
  const me = await signer.getAddress()
  const res = []
  for (let { r1, r2 } of pools) {
    for (let pool of [r1, r2]) {
      if (pool) {
        const ct = {
          pool: controller(pool.addr, signer),
          bond: controller(pool.bond.addr, signer, abiToken),
          want: controller(pool.want.addr, signer, abiToken),
          call: controller(pool.call.addr, signer, abiToken),
          coll: controller(pool.coll.addr, signer, abiToken),
        }
        let [coll_total, want_total, clpt_total, bond_total, earned, clpt, call, coll] = await Promise.all([
          ct.pool.sx(),
          ct.pool.sy(),
          ct.pool.sk(),
          ct.bond.balanceOf(pool.addr),
          ct.pool.earned(me),
          ct.pool.balanceOf(me),
          ct.call.balanceOf(me),
          ct.coll.balanceOf(me),
        ]).then(formatMap)
        let [clpt_coll, clpt_want] = await ct.pool.get_dxdy(unformat(clpt)).then(formatMap)
        res.push({
          pool: pool,
          coll_total,
          want_total,
          bond_total,
          clpt,
          call,
          coll,
          earned,
          receivables: (clpt_coll + coll) * Price[pool.coll.addr] + clpt_want * Price[pool.want.addr],
          shareOfPoll: (clpt / clpt_total) * 100,
          coll_apy: '0.00',
          call_apy: '0.00',
          clpt_apy: '0.00',
          clpt_apr: '0.00',
        })
      }
    }
  }
  return res
}

const mypage_data_noaccount = async () => {
  const res = []
  for (let { r1, r2 } of pools) {
    for (let pool of [r1, r2]) {
      if (pool) {
        const ct = {
          pool: controller(pool.addr, signerNoAccount),
          bond: controller(pool.bond.addr, signerNoAccount, abiToken),
        }
        const [coll_total, want_total, bond_total] = await Promise.all([
          ct.pool.sx(),
          ct.pool.sy(),
          ct.bond.balanceOf(pool.addr),
        ]).then(formatMap)
        res.push({ pool, coll_total, want_total, bond_total })
      }
    }
  }
  return res
}

const callbackInfo = (method, status) => {
  const failed = {
    type: 'failed',
    title: 'Fail.',
    message: 'Your transaction failed.',
  }
  switch (method) {
    case 'approve':
      switch (status) {
        case 1:
          return {
            type: 'success',
            title: 'Approved!',
            message: 'You have successfully approved your asset.',
          }
        default:
          return failed
      }
    case 'borrow':
      switch (status) {
        case 1:
          return {
            type: 'success',
            title: 'Deposited and Borrowed.',
            message: 'You have successfully borrowed asset.',
          }
        default:
          return failed
      }
    case 'repay':
      switch (status) {
        case 1:
          return {
            type: 'success',
            title: 'Repaid.',
            message: 'You have successfully repaid your loan.',
          }
        default:
          return failed
      }
    case 'deposit':
      switch (status) {
        case 1:
          return {
            type: 'success',
            title: 'Deposited.',
            message: 'You have successfully deposited your asset.',
          }
        default:
          return failed
      }
    case 'withdraw':
      switch (status) {
        case 1:
          return {
            type: 'success',
            title: 'Withdrawn.',
            message: 'You have successfully withdraw your liquidity.',
          }
        default:
          return failed
      }
    case 'claim':
      switch (status) {
        case 1:
          return {
            type: 'success',
            title: 'Claimed.',
            message: 'You have successfully claimed your reward.',
          }
        default:
          return failed
      }
    case 'lend':
      switch (status) {
        case 1:
          return {
            type: 'success',
            title: 'Lent.',
            message: 'You have successfully lent your assset.',
          }
        default:
          return failed
      }
    case 'redeem':
      switch (status) {
        case 1:
          return {
            type: 'success',
            title: 'Redeemed.',
            message: 'You have successfully redeem your loan.',
          }
        default:
          return failed
      }
    case 'mint':
      switch (status) {
        case 1:
          return {
            type: 'success',
            title: 'mint.',
            message: 'You have successfully mint.',
          }
        default:
          return failed
      }
    case 'cancel':
      return {
        type: 'failed',
        title: 'Fail.',
        message: 'User denied transaction signature.',
      }
    case 'noaccount':
      return {
        type: 'failed',
        title: 'Fail.',
        message: 'No Account!',
      }
    default:
      return failed
  }
}
export default function contract() {
  const { enqueueSnackbar } = useSnackbar()
  const callback = (type) => {
    switch (type) {
      case true:
        return (method) => (resp) => resp.wait().then(({ status }) => enqueueSnackbar(callbackInfo(method, status)))
      case false:
        return (err) => {
          switch (err.code) {
            case 4001:
              enqueueSnackbar(callbackInfo('cancel'))
              break
            default:
              console.log(err)
              break
          }
        }
      default:
        return console.log
    }
  }
  return (signer, command) => {
    if (signer)
      return {
        calc_apy,
        calc_slip,
        ct: (address, abi) => controller(address, signer, abi),
        fetch_state: async (pool) => fetch_state(pool, signer),
        mypage_data: async () => mypage_data(signer),
        approve: async (coin, { addr }) => {
          await controller(coin, signer, ['function approve(address, uint256) external'])
            .approve(addr, ethers.constants.MaxUint256)
            .then(callback(true)('approve'))
            .catch(callback(false))
        },
        borrow: async (bond, want, { addr }) => {
          await controller(addr, signer)
            .borrow_want(bond, with_loss(want))
            .then(callback(true)('borrow'))
            .catch(callback(false))
        },
        repay: async (want, coll, { addr }) => {
          const ct = controller(addr, signer)
          let resp
          switch (true) {
            case want.eq(ZERO):
              resp = ct.burn_dual(coll)
              break
            case coll.eq(ZERO):
              resp = ct.burn_call(want)
              break
            default:
              resp = ct.repay_both(want, coll)
              break
          }
          await resp.then(callback(true)('repay')).catch(callback(false))
        },
        deposit: async (want, coll, clpt, { addr }) => {
          await controller(addr, signer)
            .mint(coll, want, with_loss(clpt))
            .then(callback(true)('deposit'))
            .catch(callback(false))
        },
        withdraw: async (clpt, { addr }) => {
          await controller(addr, signer).withdraw_both(clpt).then(callback(true)('withdraw')).catch(callback(false))
        },
        claim: async ({ addr }) => {
          await controller(addr, signer).claim_reward().then(callback(true)('claim')).catch(callback(false))
          return true
        },
        burn_and_claim: async (clpt, { addr }) => {
          await controller(addr, signer).burn_and_claim(clpt).then(callback(true)('withdraw')).catch(callback(false))
        },
        lend: async (want, coll, { addr }) => {
          await controller(addr, signer)
            .swap_want_to_min_coll(with_loss(coll), want)
            .then(callback(true)('lend'))
            .catch(callback(false))
        },
        redeem: async (want, coll, { addr }) => {
          await controller(addr, signer)
            .swap_coll_to_min_want(coll, with_loss(want))
            .then(callback(true)('redeem'))
            .catch(callback(false))
        },
        mint: async (n, { addr }) => {
          await controller(addr, signer).mint_dual(n).then(callback(true)('mint')).catch(callback(false))
        },
        redeemAll: async (pool) => {
          const me = await signer.getAddress()
          const ct = controller(pool.addr, signer)
          const call = await controller(pool.call.addr, signer).balanceOf(me)
          const coll = await controller(pool.coll.addr, signer).balanceOf(me)
          if (parseFloat(call) > parseFloat(coll)) {
            enqueueSnackbar({
              type: 'failed',
              title: 'Fail.',
              message: 'COLL must larger than CALL!',
            })
            return
          }
          const want = await ct.get_dy(call)
          await ct.swap_coll_to_min_want(call, with_loss(want)).then(callback(true)('redeem')).catch(callback(false))
          return true
        },
        repayAll: async (pool) => {
          const me = await signer.getAddress()
          const call = await controller(pool.call.addr, signer).balanceOf(me)
          const coll = await controller(pool.coll.addr, signer).balanceOf(me)
          const want = await controller(pool.want.addr, signer).balanceOf(me)
          if (parseFloat(call) > parseFloat(want)) {
            enqueueSnackbar({
              type: 'failed',
              title: 'Fail.',
              message: `${pool.want.symbol} must larger than CALL!`,
            })
            return
          }
          if (parseFloat(call) > parseFloat(coll)) {
            enqueueSnackbar({
              type: 'failed',
              title: 'Fail.',
              message: 'COLL must larger than CALL!',
            })
            return
          }
          await controller(pool.addr, signer).burn_dual(call).then(callback(true)('repay')).catch(callback(false))
          return true
        },
        withdrawAll: async ({ addr }) => {
          const me = await signer.getAddress()
          const ct = controller(addr, signer)
          const clpt = await ct.balanceOf(me)
          await ct.withdraw_both(clpt).then(callback(true)('withdraw')).catch(callback(false))
          return true
        },
        settle: async (pool) => {
          enqueueSnackbar({
            type: 'failed',
            title: 'Fail.',
            message: 'Not support yet!',
          })
          return false
        },
        error: () => {
          enqueueSnackbar({
            type: 'failed',
            title: 'Fail.',
            message: 'No Account!',
          })
        },
      }
    else {
      if (command)
        return {
          mypage_data_noaccount,
        }
      else enqueueSnackbar(callbackInfo('noaccount'))
    }
  }
}
