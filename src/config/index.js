import { tokenList as tokenList_main, pools as pools_main, poolConfig as poolConfig_main } from './poolsMain'
import { tokenList as tokenList_test, pools as pools_test, poolConfig as poolConfig_test } from './poolsTest'

var poolConfig = {},
  tokenList = {},
  pools = [],
  poolList = {},
  poolSelect = {},
  wantList = {},
  bondList = [],
  bondSet = new Set(),
  mypageDetail = [],
  mypageDetailInit = {
    coll_total: 0,
    want_total: 0,
    bond_total: 0,
    clpt: 0,
    coll: 0,
    call: 0,
    coll_total_supply: 0,
    call_total_supply: 0,
    earned: 0,
    receivables: 0,
    shareOfPoll: 0,
    coll_apy: 0,
    call_apy: 0,
    clpt_apy: 0,
    clpt_apr: 0,
  }

switch (window.location.host) {
  case 'app.collar.org':
  case '127.0.0.1':
    tokenList = tokenList_main
    pools = pools_main
    poolConfig = poolConfig_main
    break
  default:
    tokenList = tokenList_test
    pools = pools_test
    poolConfig = poolConfig_test
    break
}

pools.forEach(({ r1, r2 }) =>
  [r1, r2].forEach((pool, key) => {
    if (pool) {
      poolSelect[`${pool.bond.addr}-${pool.want.addr}-${key}`] = poolList[pool.addr] = pool
      bondSet.add(pool.bond)
      mypageDetail.push({ pool, ...mypageDetailInit })
    }
  }),
)
bondList = Array.from(bondSet)
Object.keys(poolSelect).forEach((val) => {
  const item = val.split('-')
  const want = tokenList[item[1]]
  wantList[item[0]] ? wantList[item[0]].add(want) : (wantList[item[0]] = new Set([want]))
})
Object.keys(wantList).forEach((val) => {
  wantList[val] = Array.from(wantList[val])
})

export { default as textInfo } from './textInfo'
export { default as signerNoAccount } from './signerNoAccount'
export { STYLE } from './style'
export { abi, abiCoder } from './abi'
export { context, liteContext, mypageContext, proContext } from './store'
export { poolConfig, pools, tokenList, poolList, bondList, wantList, poolSelect, mypageDetailInit, mypageDetail }
