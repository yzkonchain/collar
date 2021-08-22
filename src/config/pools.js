import { COLLAR, USDT, USDC, COLL, CALL } from '@/assets/svg/token'

var tokenList = {},
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
    call: 0,
    coll: 0,
    earned: 0,
    receivables: 0,
    shareOfPoll: 0,
    coll_apy: 0,
    call_apy: 0,
    clpt_apy: 0,
    clpt_apr: 0,
  }

const poolConfig = {
  network: 'ropsten',
  chainid: 3,
  infuraid: '9180c5a422ac44f9b21ad7927b6b662c',
  collar: '0xe405bD3C4876D1Ea0af92BaCF5831c9FCbDD78aE',
}

const Token = (symbol, addr, icon, decimals) => {
  switch (symbol) {
    case 'COLLAR':
    case 'CLPT':
      return { symbol, addr, icon: COLLAR, decimals: 18 }
    case 'COLL':
      return { symbol, addr, icon: COLL, decimals: 18 }
    case 'CALL':
      return { symbol, addr, icon: CALL, decimals: 18 }
    default:
      return { symbol, addr, icon: icon || COLLAR, decimals: decimals || 18 }
  }
}

const Pool = ({ bond, want, r1, r2 }) => {
  const r = [r1, r2].map((pool) => {
    if (pool) {
      const { addr, coll, call, swap_sqp, expiry_time, symbol } = pool
      return {
        addr,
        expiry_time,
        bond: tokenList[bond],
        want: tokenList[want],
        coll: tokenList[coll],
        call: tokenList[call],
        swap_sqp: swap_sqp || 992187500,
        symbol: symbol || 'CLPT',
      }
    } else return null
  })
  return { r1: r[0], r2: r[1] }
}

tokenList = {
  [poolConfig.collar]: Token('COLLAR', poolConfig.collar),
  '0x08f5F253fb2080660e9a4E3882Ef4458daCd52b0': Token('USDT', '0x08f5F253fb2080660e9a4E3882Ef4458daCd52b0', USDT),
  '0x67C9a0830d922C80A96408EEdF606c528836880C': Token('USDC', '0x67C9a0830d922C80A96408EEdF606c528836880C', USDC),
  '0x506FeA08646b7ED5084c7a9a302FF5a95B9E980c': Token('CLPT', '0x506FeA08646b7ED5084c7a9a302FF5a95B9E980c'),
  '0x9D8FEb661AFc92b83c45fC21836C114164beB285': Token('CALL', '0x9D8FEb661AFc92b83c45fC21836C114164beB285'),
  '0x25a722fbd8c4080937CAD2A4DFa2eeeA29539231': Token('COLL', '0x25a722fbd8c4080937CAD2A4DFa2eeeA29539231'),
  '0x3894e050adae3ef3D10d7e1c79AE8F7A07866a90': Token('CLPT', '0x3894e050adae3ef3D10d7e1c79AE8F7A07866a90'),
  '0x404Ced902eE6d630db51969433ea7DD2EE3524B8': Token('CALL', '0x404Ced902eE6d630db51969433ea7DD2EE3524B8'),
  '0x61E04744eD53E1Ae61A9325A5Eba31AEA24eca4D': Token('COLL', '0x61E04744eD53E1Ae61A9325A5Eba31AEA24eca4D'),
}

pools = [
  // USDT => USDC
  Pool({
    bond: '0x08f5F253fb2080660e9a4E3882Ef4458daCd52b0',
    want: '0x67C9a0830d922C80A96408EEdF606c528836880C',
    r1: {
      addr: '0x506FeA08646b7ED5084c7a9a302FF5a95B9E980c',
      coll: '0x25a722fbd8c4080937CAD2A4DFa2eeeA29539231',
      call: '0x9D8FEb661AFc92b83c45fC21836C114164beB285',
      expiry_time: 1633017600,
    },
    r2: {
      addr: '0x506FeA08646b7ED5084c7a9a302FF5a95B9E980c',
      coll: '0x25a722fbd8c4080937CAD2A4DFa2eeeA29539231',
      call: '0x9D8FEb661AFc92b83c45fC21836C114164beB285',
      expiry_time: 1634017600,
    },
  }),
  // USDC => USDT
  Pool({
    bond: '0x67C9a0830d922C80A96408EEdF606c528836880C',
    want: '0x08f5F253fb2080660e9a4E3882Ef4458daCd52b0',
    r1: {
      addr: '0x3894e050adae3ef3D10d7e1c79AE8F7A07866a90',
      call: '0x404Ced902eE6d630db51969433ea7DD2EE3524B8',
      coll: '0x61E04744eD53E1Ae61A9325A5Eba31AEA24eca4D',
      expiry_time: 1633017600,
    },
  }),
]

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

export default pools
export { poolConfig, pools, tokenList, poolList, bondList, wantList, poolSelect, mypageDetail }
