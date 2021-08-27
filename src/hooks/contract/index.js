import { ethers } from 'ethers'
import { pools, tokenList, poolConfig } from '@/config'
import { useSnackbar } from 'notistack'
import { Price } from '@/hooks'

const ZERO = ethers.constants.Zero
const collar_ct = tokenList[poolConfig.collar].ct
const pricePool_ct = tokenList[poolConfig.pricePool].ct

const with_loss = (x) => x.mul(995).div(1000)
const toNonExponential = (num) => {
  var m = num.toExponential().match(/\d(?:\.(\d*))?e([+-]\d+)/)
  return num.toFixed(Math.max(0, (m[1] || '').length - m[2]))
}
const format = (num, n, fixed) => {
  const res = parseFloat(ethers.utils.formatUnits(num, n || 18))
  return fixed ? res.toFixed(fixed) : res
}
const unformat = (num, n) => ethers.utils.parseUnits(String(num) || '', n || 18)
const formatMap = (data, n) => (n ? data.map((v, k) => format(v, n[k] || 18)) : data.map((v) => format(v)))

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
const calc_collar_price = async () => {
  return await pricePool_ct
    .slot0()
    .then((data) => data[0])
    .then((sqrtPrice) => sqrtPrice ** 2 / 2 ** 192)
    .then((res) => 1 / res)
}

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
  const exchange = async (pool, method, args, cb) => {
    const ct = pool.ct
    if (!ct.signer) return false
    const gasLimit = await ct.estimateGas[method](...args).then((e) => e.mul(poolConfig.gasAdjustment).div(100))
    return await ct.populateTransaction[method](...args)
      .then((tx) => ({ ...tx, gasLimit }))
      .then((tx) => ct.signer.sendTransaction(tx))
      .then(callback(true)(cb))
      .catch(callback(false))
  }
  return {
    calc_apy,
    calc_slip,
    notify,
    fetch_state: async (pool) => {
      const init = { balance: {}, allowance: {}, earned: {}, swap: {} }
      const me = pool.ct.signer ? pool.ct.signer.getAddress() : null
      const collar_price = await calc_collar_price()
      ;[
        init.balance.collar,
        init.balance.bond,
        init.balance.want,
        init.balance.call,
        init.balance.coll,
        init.balance.clpt,
        init.allowance.bond,
        init.allowance.want,
        init.earned.collar,
        init.swap.sx,
        init.swap.sy,
        init.swap.sk,
        init.swap.fee,
        init.reward_rate,
      ] = await Promise.all([
        me ? collar_ct.balanceOf(me) : ZERO,
        me ? pool.bond.ct.balanceOf(me) : ZERO,
        me ? pool.want.ct.balanceOf(me) : ZERO,
        me ? pool.call.ct.balanceOf(me) : ZERO,
        me ? pool.coll.ct.balanceOf(me) : ZERO,
        me ? pool.ct.balanceOf(me) : ZERO,
        me ? pool.bond.ct.allowance(me, pool.addr) : ZERO,
        me ? pool.want.ct.allowance(me, pool.addr) : ZERO,
        me ? pool.ct.earned(me) : ZERO,
        pool.ct.sx(),
        pool.ct.sy(),
        pool.ct.sk(),
        pool.ct.swap_fee(),
        pool.ct.reward_rate(),
      ])
      init.clpt_price = format(init.swap.sx.add(init.swap.sy)) / format(init.swap.sk)
      init.farm_apy = (format(init.reward_rate) / format(init.swap.sk)) * (collar_price / init.clpt_price) * 3153600000
      init.apy = calc_apy(init, [null, null], pool)
      Price[poolConfig.collar] = init.collar_price
      return init
    },
    mypage_data: async () => {
      const res = []
      const collar_price = await calc_collar_price()
      for (let { r1, r2 } of pools) {
        for (let pool of [r1, r2]) {
          if (pool) {
            const me = pool.ct.signer ? pool.ct.signer.getAddress() : null
            let [
              bond_total,
              want_total,
              coll_total,
              clpt_total,
              reward_rate,
              earned,
              clpt,
              coll,
              call,
              coll_total_supply,
              call_total_supply,
            ] = await Promise.all([
              pool.bond.ct.balanceOf(pool.addr),
              pool.ct.sy(),
              pool.ct.sx(),
              pool.ct.sk(),
              pool.ct.reward_rate(),
              me ? pool.ct.earned(me) : ZERO,
              me ? pool.ct.balanceOf(me) : ZERO,
              me ? pool.coll.ct.balanceOf(me) : ZERO,
              me ? pool.call.ct.balanceOf(me) : ZERO,
              pool.coll.ct.totalSupply(),
              pool.call.ct.totalSupply(),
            ])
              .then((data) => formatMap(data, [pool.bond.decimals, pool.want.decimals]))
              .catch(() => [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
            let [clpt_coll, clpt_want] =
              clpt === 0
                ? [0, 0]
                : await pool.ct
                    .get_dxdy(unformat(clpt))
                    .then((data) => formatMap(data, [null, pool.want.decimals]))
                    .catch(() => [0, 0])
            let clpt_price = (coll_total + want_total) / clpt_total
            res.push({
              pool,
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
              clpt_apr: 0,
              clpt_apy: (reward_rate / clpt_total) * (collar_price / clpt_price) * 3153600000,
            })
          }
        }
      }
      Price[poolConfig.collar] = collar_price
      return res
    },
    approve: async (token, pool) => {
      const method = 'approve'
      const args = [pool.addr, ethers.constants.MaxUint256]
      const gasLimit = await token.ct.estimateGas[method](...args).then((e) => e.mul(poolConfig.gasAdjustment).div(100))
      return await token.ct.populateTransaction[method](...args)
        .then((tx) => ({ ...tx, gasLimit }))
        .then((tx) => pool.ct.signer.sendTransaction(tx))
        .then(callback(true)('approve'))
        .catch(callback(false))
    },
    borrow: async (bond, want, pool) => {
      const method = 'borrow_want'
      const args = [bond, with_loss(want)]
      const cb = 'borrow'
      return await exchange(pool, method, args, cb)
    },
    repay: async (want, coll, pool) => {
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
      return await exchange(pool, method, args, 'repay')
    },
    deposit: async (want, coll, clpt, pool) => {
      return await pool.ct.mint(coll, want, with_loss(clpt)).then(callback(true)('deposit')).catch(callback(false))
    },
    withdraw: async (clpt, pool) => {
      const method = 'withdraw_both'
      const args = [clpt]
      const cb = 'withdraw'
      return await exchange(pool, method, args, cb)
    },
    claim: async (pool) => {
      const method = 'claim_reward'
      const args = []
      const cb = 'claim'
      return await exchange(pool, method, args, cb)
    },
    burn_and_claim: async (clpt, pool) => {
      const method = 'burn_and_claim'
      const args = [clpt]
      const cb = 'withdraw'
      return await exchange(pool, method, args, cb)
    },
    lend: async (want, coll, pool) => {
      const method = 'swap_want_to_min_coll'
      const args = [with_loss(coll), want]
      const cb = 'lend'
      return await exchange(pool, method, args, cb)
    },
    redeem: async (want, coll, pool) => {
      const method = 'swap_coll_to_min_want'
      const args = [coll, with_loss(want)]
      const cb = 'redeem'
      return await exchange(pool, method, args, cb)
    },
    mint: async (n, pool) => {
      const method = 'mint_dual'
      const args = [n]
      const cb = 'mint'
      return await exchange(pool, method, args, cb)
    },
    mypage_check: async (type, pool) => {
      const me = await pool.ct.signer.getAddress()
      const [coll, call, want] = await Promise.all([
        pool.coll.ct.balanceOf(me),
        pool.call.ct.balanceOf(me),
        pool.want.ct.balanceOf(me),
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
          return { coll, call, want: await pool.ct.get_dy(coll) }
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
              return { call, want: call, coll: ZERO, bond: call }
            case call.lte(want.add(coll)):
              return { call, want, coll: call.sub(want), bond: call }
            default:
              return { call: want.add(coll), want, coll, bond: want.add(coll) }
          }
        case 'withdrawAll':
          clpt = await pool.ct.balanceOf(me)
          if (clpt.eq(ZERO)) {
            enqueueSnackbar({
              type: 'failed',
              title: 'Fail.',
              message: `You have no CLPT.`,
            })
            return false
          }
          return { clpt, pair: await pool.ct.get_dxdy(clpt).catch(() => [ZERO, ZERO]) }
        case 'settle':
          notify('support', false)
          return false
        case 'claim':
          earned = await pool.ct.earned(me)
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
        return await exchange(pool, method, args, cb)
      } else return false
    },
    repayAll: async function (pool) {
      const checked = await this.mypage_check('repayAll', pool)
      if (checked) {
        const method = 'burn_dual'
        const args = [checked.call]
        const cb = 'repay'
        return await exchange(pool, method, args, cb)
      } else return false
    },
    withdrawAll: async function (pool) {
      const checked = await this.mypage_check('withdrawAll', pool)
      if (checked) {
        const method = 'withdraw_both'
        const args = [checked.clpt]
        const cb = 'withdraw'
        return await exchange(pool, method, args, cb)
      } else return false
    },
    settle: async function (pool) {
      const checked = await this.mypage_check('settle', pool)
      if (checked) return true
      else return false
    },
    faucet: async (to, value, signer) => {
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
  }
}
