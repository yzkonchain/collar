import { ethers } from 'ethers'
import { abi as collar, pools, poolList, poolConfig, signerNoAccount, mypageDetailInit } from '@/config'
import { useSnackbar } from 'notistack'
import { Price } from '@/hooks'

const ZERO = ethers.constants.Zero
const abiToken = [
  'function transfer(address, uint256) external',
  'function approve(address, uint256) external',
  'function balanceOf(address) external view returns (uint256)',
  'function allowance(address, address) external view returns (uint256)',
  'function totalSupply() public view returns (uint256)',
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
const format = (num, n, fixed) => {
  const res = parseFloat(ethers.utils.formatUnits(num, n || 18))
  return fixed ? res.toFixed(fixed) : res
}
const unformat = (num, n) => ethers.utils.parseUnits(String(num) || '', n || 18)
const formatMap = (data, n) => (n ? data.map((v, k) => format(v, n[k] || 18)) : data.map((v) => format(v)))
const with_loss = (x) => x.mul(995).div(1000)
const toNonExponential = (num) => {
  var m = num.toExponential().match(/\d(?:\.(\d*))?e([+-]\d+)/)
  return num.toFixed(Math.max(0, (m[1] || '').length - m[2]))
}

const calc_apy_basic = ([sx, sy, sk], [bond, want], swap_sqp) => {
  const one = ethers.utils.parseEther('1')
  const mul = ethers.BigNumber.from(1e9)
  return sk.eq('0')
    ? sk
    : sx
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

const callbackInfo = (method, status) => {
  const failed = {
    type: 'failed',
    title: 'Fail.',
    message: 'Your transaction failed.',
  }
  switch (method) {
    case 'balance':
      switch (status) {
        case 'insufficient':
          return {
            type: 'failed',
            title: 'Fail.',
            message: 'Maximum range exceeded.',
          }
        default:
          return failed
      }
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
    case 'faucet':
      switch (status) {
        case 1:
          return {
            type: 'success',
            title: 'Faucet.',
            message: 'You have successfully get test token.',
          }
        case 'empty':
          return {
            type: 'failed',
            title: 'Fail.',
            message: 'The amount of ETH is necessary.',
          }
        case 'insufficient':
          return {
            type: 'failed',
            title: 'Fail.',
            message: `You dont't have enough ETH to exchange.`,
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
    case 'support':
      return {
        type: 'failed',
        title: 'Fail.',
        message: 'Not support yet!',
      }
    case 'noaccount':
      return {
        type: 'failed',
        title: 'Fail.',
        message: 'No Account!',
      }
    case 'network':
      switch (true) {
        case status instanceof Object:
          return {
            type: 'failed',
            title: 'Fail.',
            message: `not support this network, chainId: ${status.chainId}`,
          }
        default:
          return {
            type: 'failed',
            title: 'Fail.',
            message: 'Connect error, please refresh the page!',
          }
      }
    default:
      return failed
  }
}
export default function contract() {
  const { enqueueSnackbar } = useSnackbar()
  const notify = (method, status) => enqueueSnackbar(callbackInfo(method, status))
  const callback = (type) => {
    switch (type) {
      case true:
        return (method) => (resp) =>
          resp.wait().then(({ status }) => {
            notify(method, status)
            return status == 1
          })
      case false:
        return (err) => {
          switch (err.code) {
            case 4001:
              notify('cancel')
              break
            default:
              break
          }
          return false
        }
      default:
        return console.log
    }
  }
  const exchange = async (addr, method, args, signer, cb) => {
    const ct = controller(addr, signer)
    const gasLimit = await ct.estimateGas[method](...args).then((e) => e.mul(poolConfig.gasAdjustment).div(100))
    return await ct.populateTransaction[method](...args)
      .then((tx) => ({ ...tx, gasLimit }))
      .then((tx) => signer.sendTransaction(tx))
      .then(callback(true)(cb))
      .catch(callback(false))
  }
  return (signer) => {
    if (signer) {
      return {
        calc_apy,
        calc_slip,
        notify,
        ct: (address, abi) => controller(address, signer, abi),
        fetch_state: async (pool) => {
          const me = await signer.getAddress()
          const init = { balance: {}, allowance: {}, earned: {}, swap: {} }
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
        },
        mypage_data: async () => {
          const me = await signer.getAddress()
          const res = []
          for (let { r1, r2 } of pools) {
            for (let pool of [r1, r2]) {
              if (pool) {
                const ct = {
                  pool: controller(pool.addr, signer),
                  bond: controller(pool.bond.addr, signer, abiToken),
                  want: controller(pool.want.addr, signer, abiToken),
                  coll: controller(pool.coll.addr, signer, abiToken),
                  call: controller(pool.call.addr, signer, abiToken),
                }
                let [
                  coll_total,
                  want_total,
                  clpt_total,
                  bond_total,
                  earned,
                  clpt,
                  coll,
                  call,
                  coll_total_supply,
                  call_total_supply,
                ] = await Promise.all([
                  ct.pool.sx(),
                  ct.pool.sy(),
                  ct.pool.sk(),
                  ct.bond.balanceOf(pool.addr),
                  ct.pool.earned(me),
                  ct.pool.balanceOf(me),
                  ct.coll.balanceOf(me),
                  ct.call.balanceOf(me),
                  ct.coll.totalSupply(),
                  ct.call.totalSupply(),
                ])
                  .then((data) => formatMap(data, [null, pool.want.decimals, null, pool.bond.decimals]))
                  .catch(() => [0, 0, 0, 0, 0, 0, 0, 0])
                let [clpt_coll, clpt_want] =
                  clpt === 0
                    ? [0, 0]
                    : await ct.pool
                        .get_dxdy(unformat(clpt))
                        .then((data) => formatMap(data, [null, pool.want.decimals]))
                        .catch(() => [0, 0])
                res.push({
                  pool: pool,
                  coll_total,
                  want_total,
                  bond_total,
                  clpt,
                  coll,
                  call,
                  coll_total_supply,
                  call_total_supply,
                  earned,
                  receivables: (clpt_coll + coll) * Price[pool.coll.addr] + clpt_want * Price[pool.want.addr],
                  shareOfPoll: clpt_total ? (clpt / clpt_total) * 100 : 0,
                  coll_apy: 0,
                  call_apy: 0,
                  clpt_apy: 0,
                  clpt_apr: 0,
                })
              }
            }
          }
          return res
        },
        get_dx: async (coin, { addr }) => {
          return await controller(addr, signer)
            .get_dx(coin)
            .catch(() => {
              notify('balance', 'insufficient')
              return false
            })
        },
        get_dy: async (coin, { addr }) => {
          return await controller(addr, signer)
            .get_dy(coin)
            .catch(() => {
              notify('balance', 'insufficient')
              return false
            })
        },
        get_dk: async (coll, want, { addr }) => {
          return await controller(addr, signer)
            .get_dk(coll, want)
            .catch(() => {
              notify('balance', 'insufficient')
              return false
            })
        },
        approve: async (coin, { addr }) => {
          const ct = controller(coin, signer, ['function approve(address, uint256) external'])
          const method = 'approve'
          const args = [addr, ethers.constants.MaxUint256]
          const gasLimit = await ct.estimateGas[method](...args).then((e) => e.mul(poolConfig.gasAdjustment).div(100))
          return await ct.populateTransaction[method](...args)
            .then((tx) => ({ ...tx, gasLimit }))
            .then((tx) => signer.sendTransaction(tx))
            .then(callback(true)('approve'))
            .catch(callback(false))
        },
        borrow: async (bond, want, { addr }) => {
          const method = 'borrow_want'
          const args = [bond, with_loss(want)]
          const cb = 'borrow'
          return await exchange(addr, method, args, signer, cb)
        },
        repay: async (want, coll, { addr }) => {
          const ct = controller(addr, signer)
          let method = '',
            args = []
          switch (true) {
            case want.eq(ZERO):
              method = 'burn_dual'
              args = [coll]
              break
            case coll.eq(ZERO):
              method = 'burn_call'
              args = [want]
              break
            default:
              method = 'repay_both'
              args = [want, coll]
              break
          }
          return await exchange(addr, method, args, signer, 'repay')
        },
        deposit: async (want, coll, clpt, { addr }) => {
          return await controller(addr, signer)
            .mint(coll, want, with_loss(clpt))
            .then(callback(true)('deposit'))
            .catch(callback(false))
        },
        withdraw: async (clpt, { addr }) => {
          const method = 'withdraw_both'
          const args = [clpt]
          const cb = 'withdraw'
          return await exchange(addr, method, args, signer, cb)
        },
        claim: async ({ addr }) => {
          const method = 'claim_reward'
          const args = []
          const cb = 'claim'
          return await exchange(addr, method, args, signer, cb)
        },
        burn_and_claim: async (clpt, { addr }) => {
          const method = 'burn_and_claim'
          const args = [clpt]
          const cb = 'withdraw'
          return await exchange(addr, method, args, signer, cb)
        },
        lend: async (want, coll, { addr }) => {
          const method = 'swap_want_to_min_coll'
          const args = [with_loss(coll), want]
          const cb = 'lend'
          return await exchange(addr, method, args, signer, cb)
        },
        redeem: async (want, coll, { addr }) => {
          const method = 'swap_coll_to_min_want'
          const args = [coll, with_loss(want)]
          const cb = 'redeem'
          return await exchange(addr, method, args, signer, cb)
        },
        mint: async (n, { addr }) => {
          const method = 'mint_dual'
          const args = [n]
          const cb = 'mint'
          return await exchange(addr, method, args, signer, cb)
        },
        mypage_check: async (type, pool) => {
          const me = await signer.getAddress()
          const ct = controller(pool.addr, signer)
          const [coll, call, want] = await Promise.all([
            controller(pool.coll.addr, signer).balanceOf(me),
            controller(pool.call.addr, signer).balanceOf(me),
            controller(pool.want.addr, signer).balanceOf(me),
          ]).catch(() => [ZERO, ZERO, ZERO])
          let clpt, earned
          switch (type) {
            case 'redeemAll':
              if (coll.eq(ZERO)) {
                enqueueSnackbar({
                  type: 'failed',
                  title: 'Fail.',
                  message: 'You have no COLL.',
                })
                return false
              }
              if (call.gt(coll)) {
                enqueueSnackbar({
                  type: 'failed',
                  title: 'Fail.',
                  message: 'COLL must larger than CALL!',
                })
                return false
              }
              return { ct, coll, call, want: await ct.get_dy(coll) }
            case 'repayAll':
              switch (true) {
                case ZERO.eq(call):
                  enqueueSnackbar({
                    type: 'failed',
                    title: 'Fail.',
                    message: `You have no CALL.`,
                  })
                  return false
                case ZERO.eq(want.add(coll)):
                  enqueueSnackbar({
                    type: 'failed',
                    title: 'Fail.',
                    message: `You have no ${pool.want.symbol} and COLL.`,
                  })
                  return false
                case call.lte(want):
                  return { ct, call, want: call, coll: ZERO, bond: call }
                case call.lte(want.add(coll)):
                  return { ct, call, want, coll: call.sub(want), bond: call }
                default:
                  return { ct, call: want.add(coll), want, coll, bond: want.add(coll) }
              }
            case 'withdrawAll':
              clpt = await ct.balanceOf(me)
              if (clpt.eq(ZERO)) {
                enqueueSnackbar({
                  type: 'failed',
                  title: 'Fail.',
                  message: `You have no CLPT.`,
                })
                return false
              }
              return { ct, clpt, pair: await ct.get_dxdy(clpt).catch(() => [ZERO, ZERO]) }
            case 'settle':
              notify('support', false)
              return false
            case 'claim':
              earned = await ct.earned(me)
              if (earned.eq(ZERO)) {
                enqueueSnackbar({
                  type: 'failed',
                  title: 'Fail.',
                  message: `No COLLAR to get.`,
                })
                return false
              }
              return { earned }
            default:
              return false
          }
        },
        redeemAll: async function (pool) {
          const checked = await this.mypage_check('redeemAll', pool)
          if (checked) {
            const { coll, want } = checked
            const method = 'swap_coll_to_min_want'
            const args = [coll, with_loss(want)]
            const cb = 'redeem'
            return await exchange(pool.addr, method, args, signer, cb)
          } else return false
        },
        repayAll: async function (pool) {
          const checked = await this.mypage_check('repayAll', pool)
          if (checked) {
            const method = 'burn_dual'
            const args = [checked.call]
            const cb = 'repay'
            return await exchange(pool.addr, method, args, signer, cb)
          } else return false
        },
        withdrawAll: async function (pool) {
          const checked = await this.mypage_check('withdrawAll', pool)
          if (checked) {
            const method = 'withdraw_both'
            const args = [checked.clpt]
            const cb = 'withdraw'
            return await exchange(pool.addr, method, args, signer, cb)
          } else return false
        },
        settle: async function (pool) {
          const checked = await this.mypage_check('settle', pool)
          if (checked) return true
          else return false
        },
        faucet: async (to, value) => {
          const gasLimit = (await signer.estimateGas()).mul(poolConfig.gasAdjustment).div(100)
          await signer
            .getBalance()
            .then((balance) => {
              if (balance.gt(value)) {
                return signer.sendTransaction({ to, value, gasLimit })
              } else {
                notify('faucet', 'insufficient')
                throw new Error('insufficient')
              }
            })
            .then(callback(true)('faucet'))
            .catch(callback(false))
        },
        error: () => {
          enqueueSnackbar({
            type: 'failed',
            title: 'Fail.',
            message: 'No Account!',
          })
        },
      }
    } else
      return {
        notify,
        mypage_data_noaccount: async () => {
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
                ])
                  .then((data) => formatMap(data, [null, pool.want.decimals, pool.bond.decimals]))
                  .catch(() => [0, 0, 0])
                res.push({
                  ...mypageDetailInit,
                  pool,
                  coll_total,
                  want_total,
                  bond_total,
                })
              }
            }
          }
          return res
        },
      }
  }
}
