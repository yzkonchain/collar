import { ethers } from 'ethers'
import { abi as collar, pools, poolList } from '@/config'
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
const formatEther = (num, n) => parseFloat(ethers.utils.formatEther(num)).toFixed(n || 3)
const with_loss = (x) => x.mul(995).div(1000)

const fetch_state = async (pool, signer) => {
  const init = {
    balance: {
      bond: ZERO,
      want: ZERO,
      call: ZERO,
      coll: ZERO,
      clpt: ZERO,
      collar: ZERO,
    },
    allowance: {
      bond: ZERO,
      want: ZERO,
    },
    earned: {
      collar: ZERO,
    },
    swap: {
      sx: ZERO,
      sy: ZERO,
      sk: ZERO,
    },
  }
  const p = poolList[pool]
  const me = await signer.getAddress()
  const bond = controller(p['bond'].addr, signer, abiToken)
  const want = controller(p['want'].addr, signer, abiToken)
  const call = controller(p['call'].addr, signer, abiToken)
  const coll = controller(p['coll'].addr, signer, abiToken)
  const clpt = controller(pool, signer, abiToken)
  const collar = controller(p['collar'].addr, signer, abiToken)
  const poolCt = controller(pool, signer, abiPool)
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
    bond.allowance(me, pool),
    want.allowance(me, pool),
    poolCt.earned(me),
    poolCt.sx(),
    poolCt.sy(),
    poolCt.sk(),
    poolCt.swap_fee(),
  ])
  init.apy =
    (parseFloat(
      ethers.utils.formatEther(
        init.swap.sx
          .add(init.swap.sk)
          .mul(ethers.utils.parseEther('1'))
          .div(init.swap.sy.add(init.swap.sk.mul(p.swap_sqp).div(ethers.BigNumber.from(1e9))))
          .sub(ethers.utils.parseEther('1')),
      ),
    ) *
      3155692600000) /
    (p.expiry_time * 1000 - new Date())
  return init
}

const mypage_data = async (signer) => {
  const me = await signer.getAddress()
  const res = []
  for (let item of pools) {
    const data = {}
    const ct = {
      pool: controller(item.pool, signer),
      bond: controller(poolList[item.pool].bond.addr, signer, abiToken),
      want: controller(poolList[item.pool].want.addr, signer, abiToken),
      call: controller(poolList[item.pool].call.addr, signer, abiToken),
      coll: controller(poolList[item.pool].coll.addr, signer, abiToken),
    }
    ;[data.sx, data.sy, data.sk, data.bond, data.earned, data.clpt, data.call, data.coll] = await Promise.all([
      ct.pool.sx(),
      ct.pool.sy(),
      ct.pool.sk(),
      ct.bond.balanceOf(item.pool),
      ct.pool.earned(me),
      ct.pool.balanceOf(me),
      ct.call.balanceOf(me),
      ct.coll.balanceOf(me),
    ])
    ;[data.clpt_coll, data.clpt_want] = await ct.pool.get_dxdy(data.clpt)
    res.push({
      pool: item.pool,
      coll_total: formatEther(data.sx),
      want_total: formatEther(data.sy),
      bond_total: formatEther(data.bond),
      clpt: formatEther(data.clpt),
      call: formatEther(data.call),
      coll: formatEther(data.coll),
      earned: formatEther(data.earned),
      receivables:
        formatEther(data.clpt_coll.add(data.coll)) * Price[poolList[item.pool].coll.addr] +
        formatEther(data.clpt_want) * Price[poolList[item.pool].want.addr],
      shareOfPoll: ((formatEther(data.clpt) / formatEther(data.sk)) * 100).toFixed(2),
      apr: '0.00',
      apy: '0.00',
    })
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
  return {
    fetch_state,
    mypage_data,
    ct: (address, signer) => controller(address, signer),
    approve: async (coin, pool, signer) => {
      await controller(coin, signer, ['function approve(address, uint256) external'])
        .approve(pool, ethers.constants.MaxUint256)
        .then(callback(true)('approve'))
        .catch(callback(false))
    },
    borrow: async (bond, want, pool, signer) => {
      await controller(pool, signer)
        .borrow_want(bond, with_loss(want))
        .then(callback(true)('borrow'))
        .catch(callback(false))
    },
    repay: async (want, coll, pool, signer) => {
      let resp
      switch (true) {
        case want.eq(ZERO):
          resp = controller(pool, signer).burn_dual(coll)
          break
        case coll.eq(ZERO):
          resp = controller(pool, signer).burn_call(want)
          break
        default:
          resp = controller(pool, signer).repay_both(want, coll)
          break
      }
      await resp.then(callback(true)('repay')).catch(callback(false))
    },
    deposit: async (want, coll, clpt, pool, signer) => {
      await controller(pool, signer)
        .mint(coll, want, with_loss(clpt))
        .then(callback(true)('deposit'))
        .catch(callback(false))
    },
    withdraw: async (clpt, pool, signer) => {
      await controller(pool, signer).withdraw_both(clpt).then(callback(true)('withdraw')).catch(callback(false))
    },
    claim: async (pool, signer) => {
      await controller(pool, signer).claim_reward().then(callback(true)('claim')).catch(callback(false))
    },
    burn_and_claim: async (clpt, pool, signer) => {
      await controller(pool, signer).burn_and_claim(clpt).then(callback(true)('withdraw')).catch(callback(false))
    },
    lend: async (want, coll, pool, signer) => {
      await controller(pool, signer)
        .swap_want_to_min_coll(with_loss(coll), want)
        .then(callback(true)('lend'))
        .catch(callback(false))
    },
    redeem: async (want, coll, pool, signer) => {
      await controller(pool, signer)
        .swap_coll_to_min_want(coll, with_loss(want))
        .then(callback(true)('redeem'))
        .catch(callback(false))
    },
    mint: async (n, pool, signer) => {
      await controller(pool, signer).mint_dual(n).then(callback(true)('mint')).catch(callback(false))
    },
  }
}
