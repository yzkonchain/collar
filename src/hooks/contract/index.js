import { ethers } from 'ethers'
import { pools, tokenList, poolConfig, signerNoAccount, abiCoder, STYLE } from '@/config'
import { useSnackbar } from 'notistack'
import { Price } from '@/hooks'
import { echartsData } from './dataInit'
import callbackInfo from './callbackInfo'
import _ from 'lodash'

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
const decode = (method, data) => ethers.utils.defaultAbiCoder.decode(abiCoder[method], data)
const toHex = (num) => `0x${num.toString(16)}`

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
const calc_apy_format = ([sx, sy, sk], { swap_sqp, expiry_time }, time) => {
  const basic = sk == 0 ? 0 : (sx + sk) / (sy + (sk * swap_sqp) / 1000000000) - 1
  return (basic * 3155692600000) / (expiry_time * 1000 - (time || new Date()))
}

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
const queryBlock = (ct, method, args = [], blockNumber = 'latest', decimal = 18) =>
  ct.populateTransaction[method](...args)
    .then((tx) => signerNoAccount.send('eth_call', [tx, { blockNumber }]))
    .then((data) => decode(method, data))
    .then((data) => data.map((v) => format(v, decimal)))
    .then((data) => (data.length === 1 ? data[0] : data))
    .catch(() => (abiCoder[method].length === 1 ? 0 : Array(abiCoder[method].length).fill(0)))

const queryBlockBasic = (ct, method, args = []) =>
  ct[method](...args).catch(() => (abiCoder[method].length === 1 ? ZERO : Array(abiCoder[method].length).fill(ZERO)))

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
      .then((tx) => ct.signer.sendTransaction({ ...tx, gasLimit }))
      .then(callback(true)(cb))
      .catch(callback(false))
  }
  return {
    calc_apy,
    calc_slip,
    notify,
    async fetch_state(pool) {
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
      init.farm_apr = (format(init.reward_rate) / format(init.swap.sk)) * (collar_price / init.clpt_price) * 31536000
      init.farm_apy = (init.farm_apr / 365 + 1) ** 365 - 1
      init.apy = calc_apy(init, [null, null], pool)
      Price[poolConfig.collar] = init.collar_price
      return init
    },
    async mypage_data() {
      const res = []
      const collar_price = await calc_collar_price()
      for (let { r1, r2, r0 } of pools) {
        for (let pool of [r1, r2, ...r0]) {
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
              .catch(() => Array(11).fill(0))
            let [clpt_coll, clpt_want] =
              clpt === 0
                ? [0, 0]
                : await pool.ct
                    .get_dxdy(unformat(clpt))
                    .then((data) => formatMap(data, [null, pool.want.decimals]))
                    .catch(() => [0, 0])
            let clpt_price = (coll_total + want_total) / clpt_total
            let clpt_apr = (reward_rate / clpt_total) * (collar_price / clpt_price) * 31536000
            let clpt_apy = (clpt_apr / 365 + 1) ** 365 - 1
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
              clpt_apr,
              clpt_apy,
            })
          }
        }
      }
      Price[poolConfig.collar] = collar_price
      return res
    },
    async pro_echarts(period, type) {
      const blockNumber = await signerNoAccount.getBlockNumber()
      const now = new Date()
      let promise = [],
        poolList = []
      const TimeSet = {
        '12h': [11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
        '7d': [6 * 24, 5 * 24, 4 * 24, 3 * 24, 2 * 24, 1 * 24, 0],
        get '24h'() {
          return this['12h'].map((v) => v * 2)
        },
        get '1m'() {
          return this['7d'].map((v) => v * 5)
        },
      }
      const timeset = TimeSet[period]
      const timeSetOld = timeset.map((val) => new Date(now - val * 3600000))
      const len = timeset.length
      for (let { r1, r2, r0 } of pools) {
        for (let pool of [r1, r2, ...r0]) {
          if (pool) {
            for (let time of timeset) {
              let queryBlockNumber = toHex(blockNumber - time * 225)
              promise.push(
                queryBlock(pool.ct, 'sx', [], queryBlockNumber),
                queryBlock(pool.ct, 'sy', [], queryBlockNumber, pool.want.decimals),
                queryBlock(pool.ct, 'sk', [], queryBlockNumber),
                queryBlock(pool.ct, 'reward_rate', [], queryBlockNumber),
                queryBlock(pool.bond.ct, 'balanceOf', [pool.addr], queryBlockNumber, pool.bond.decimals),
              )
            }
            poolList.push(pool)
          }
        }
      }
      const res = await Promise.all(promise)
      const collar_price = await calc_collar_price()
      const queryBatch = 5
      const DATA = {
        totalLockedValue: Array(len).fill(0),
        totalLiquidity: Array(len).fill(0),
        totalCollateral: {},
        historicalInterestRate: {},
      }
      poolList.forEach((pool, index) => {
        const _res = res.slice(index * len * queryBatch, (index + 1) * len * queryBatch)
        const _poolName = `${pool.bond.symbol}-${pool.want.symbol}`
        const poolName = DATA['historicalInterestRate'][`${_poolName}-1`] ? `${_poolName}-2` : `${_poolName}-1`
        DATA['historicalInterestRate'][poolName] = []
        if (!DATA['totalCollateral'][pool.bond.symbol]) {
          DATA['totalCollateral'][pool.bond.symbol] = Array(len).fill(0)
        }
        for (let i = 0; i < len; i++) {
          const [sx, sy, sk, reward_rate, bond_total] = _res.slice(i * queryBatch, (i + 1) * queryBatch)
          const liquidity = sx * Price[pool.coll.addr] + sy * Price[pool.want.addr]
          const collateral = bond_total * Price[pool.bond.addr]
          DATA['totalLockedValue'][i] += liquidity + collateral
          DATA['totalLiquidity'][i] += liquidity
          DATA['totalCollateral'][pool.bond.symbol][i] += collateral
          // DATA['historicalInterestRate'][poolName].push(((reward_rate * collar_price) / (sx + sy)) * 3153600000)
          DATA['historicalInterestRate'][poolName].push(calc_apy_format([sx, sy, sk], pool, timeSetOld[i]))
        }
      })
      const _result = _.cloneDeep(echartsData)
      // _result.xAxis.data = timeSetOld.map((t) => t.toLocaleString())
      _result.xAxis.data = timeSetOld
      _result.xAxis.axisLabel.interval = len - 2
      const singleLine = (type) => {
        const result = _.cloneDeep(_result)
        result.series[0] = {
          data: DATA[type],
          type: 'line',
          showSymbol: false,
          lineStyle: { color: '#59FFAD' },
        }
        return result
      }
      const multiLine = (type) => {
        const result = _.cloneDeep(_result)
        result.series = Object.entries(DATA[type]).map(([name, data], index) => ({
          name,
          data,
          type: 'line',
          showSymbol: false,
        }))
        // if (type == 'historicalInterestRate') {
        //   result.yAxis.axisLabel.formatter = (v) => [v.toFixed(1) + '%']
        // }
        return result
      }
      const echartsRes = (type) => {
        switch (type) {
          case 'totalLockedValue':
          case 'totalLiquidity':
            return { [type]: singleLine(type) }
          case 'totalCollateral':
          case 'historicalInterestRate':
            return { [type]: multiLine(type) }
          default:
            return {
              ...echartsRes('totalLockedValue'),
              ...echartsRes('totalLiquidity'),
              ...echartsRes('totalCollateral'),
              ...echartsRes('historicalInterestRate'),
            }
        }
      }
      return echartsRes(type)
    },
    async pro_data() {
      const res = []
      const collar_price = await calc_collar_price()
      for (let { r1, r2, r0 } of pools) {
        for (let pool of [r1, r2, ...r0]) {
          if (pool) {
            const me = pool.ct.signer ? pool.ct.signer.getAddress() : null
            let [
              bond_total,
              want_total,
              coll_total,
              clpt_total,
              reward_rate,
              clpt,
              coll,
              call,
              bond_balance,
              want_balance,
              bond_allowance,
              want_allowance,
            ] = await Promise.all([
              queryBlockBasic(pool.bond.ct, 'balanceOf', [pool.addr]),
              queryBlockBasic(pool.ct, 'sy'),
              queryBlockBasic(pool.ct, 'sx'),
              queryBlockBasic(pool.ct, 'sk'),
              queryBlockBasic(pool.ct, 'reward_rate'),
              queryBlockBasic(pool.ct, 'balanceOf'),
              queryBlockBasic(pool.coll.ct, 'balanceOf', [me]),
              queryBlockBasic(pool.call.ct, 'balanceOf', [me]),
              queryBlockBasic(pool.bond.ct, 'balanceOf', [me]),
              queryBlockBasic(pool.want.ct, 'balanceOf', [me]),
              queryBlockBasic(pool.bond.ct, 'allowance', [me, pool.addr]),
              queryBlockBasic(pool.want.ct, 'allowance', [me, pool.addr]),
            ])
            res.push({
              pool,
              bond_total,
              want_total,
              coll_total,
              clpt_total,
              reward_rate,
              clpt,
              coll,
              call,
              bond_balance,
              want_balance,
              bond_allowance,
              want_allowance,
              clpt_price: format(coll_total.add(want_total)) / format(clpt_total),
              apy: calc_apy({ swap: { sx: coll_total, sy: want_total, sk: clpt_total } }, [null, null], pool),
              farm_apy:
                ((format(reward_rate) * collar_price) / (format(coll_total) + format(want_total, pool.want.decimals))) *
                3153600000,
            })
          }
        }
      }
      return res
    },
    async mypage_check(type, pool) {
      const me = await pool.ct.signer.getAddress()
      const [coll, call, want, rate] = await Promise.all([
        pool.coll.ct.balanceOf(me),
        pool.call.ct.balanceOf(me),
        pool.want.ct.balanceOf(me),
        pool.ct.rate(),
      ]).catch(() => [ZERO, ZERO, ZERO, ZERO])
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
              message: 'COLL balance must exceed CALL balance!',
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
          if (rate.gte(ethers.utils.parseEther('1'))) {
            enqueueSnackbar({
              type: 'failed',
              title: 'Fail.',
              message: `The expire function has not been executed.`,
            })
            return false
          }
          return {
            coll,
            bond: coll.sub(coll.mul(rate).div(ethers.utils.parseEther('1'))),
            want: coll.mul(rate).div(ethers.utils.parseEther('1')),
          }
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
    async approve(token, pool) {
      const method = 'approve'
      const args = [pool.addr, ethers.constants.MaxUint256]
      const gasLimit = await token.ct.estimateGas[method](...args).then((e) => e.mul(poolConfig.gasAdjustment).div(100))
      return await token.ct.populateTransaction[method](...args)
        .then((tx) => ({ ...tx, gasLimit }))
        .then((tx) => pool.ct.signer.sendTransaction(tx))
        .then(callback(true)('approve'))
        .catch(callback(false))
    },
    async borrow(bond, want, pool) {
      const method = 'borrow_want'
      const args = [bond, with_loss(want)]
      const cb = 'borrow'
      return await exchange(pool, method, args, cb)
    },
    async repay(want, coll, pool) {
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
    async deposit(want, coll, clpt, pool) {
      return await exchange(pool, 'mint', [coll, want, with_loss(clpt)], 'deposit')
    },
    async withdraw(clpt, pool) {
      const method = 'withdraw_both'
      const args = [clpt]
      const cb = 'withdraw'
      return await exchange(pool, method, args, cb)
    },
    async claim(pool) {
      const method = 'claim_reward'
      const args = []
      const cb = 'claim'
      return await exchange(pool, method, args, cb)
    },
    async burn_and_claim(clpt, pool) {
      const method = 'burn_and_claim'
      const args = [clpt]
      const cb = 'withdraw'
      return await exchange(pool, method, args, cb)
    },
    async lend(want, coll, pool) {
      const method = 'swap_want_to_min_coll'
      const args = [with_loss(coll), want]
      const cb = 'lend'
      return await exchange(pool, method, args, cb)
    },
    async redeem(want, coll, pool) {
      const method = 'swap_coll_to_min_want'
      const args = [coll, with_loss(want)]
      const cb = 'redeem'
      return await exchange(pool, method, args, cb)
    },
    async mint(n, pool) {
      const method = 'mint_dual'
      const args = [n]
      const cb = 'mint'
      return await exchange(pool, method, args, cb)
    },
    async redeemAll(pool) {
      const checked = await this.mypage_check('redeemAll', pool)
      if (checked) {
        const { coll, want } = checked
        const method = 'swap_coll_to_min_want'
        const args = [coll, with_loss(want)]
        const cb = 'redeem'
        return await exchange(pool, method, args, cb)
      } else return false
    },
    async repayAll(pool) {
      const checked = await this.mypage_check('repayAll', pool)
      if (checked) {
        const method = 'burn_dual'
        const args = [checked.call]
        const cb = 'repay'
        return await exchange(pool, method, args, cb)
      } else return false
    },
    async withdrawAll(pool) {
      const checked = await this.mypage_check('withdrawAll', pool)
      if (checked) {
        const method = 'withdraw_both'
        const args = [checked.clpt]
        const cb = 'withdraw'
        return await exchange(pool, method, args, cb)
      } else return false
    },
    async settle(pool) {
      const checked = await this.mypage_check('settle', pool)
      if (checked) {
        const method = 'burn_coll'
        const args = [checked.coll]
        const cb = 'settle'
        return await exchange(pool, method, args, cb)
      } else return false
    },
    async faucet(to, value, signer) {
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
