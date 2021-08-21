import { COLLAR, USDT, USDC, COLL, CALL } from '@/assets/svg/token'
import { RoundedCorner } from '@material-ui/icons'

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

const poolConfig = {
  network: 'ropsten',
  chainid: 3,
  infuraid: '9180c5a422ac44f9b21ad7927b6b662c',
  collar: '0xe405bD3C4876D1Ea0af92BaCF5831c9FCbDD78aE',
}

const tokenList = {
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
const tokens = {}
Object.keys(tokenList).forEach((val) => (tokens[tokenList[val].symbol] = tokenList[val]))

const pools = [
  {
    bond: tokens['USDT'],
    want: tokens['USDC'],
    r1: {
      pool: '0x506FeA08646b7ED5084c7a9a302FF5a95B9E980c',
      call: tokenList['0x9D8FEb661AFc92b83c45fC21836C114164beB285'],
      coll: tokenList['0x25a722fbd8c4080937CAD2A4DFa2eeeA29539231'],
      swap_sqp: 992187500,
      expiry_time: 1633017600,
    },
    // r2: {
    //   pool: '0x506FeA08646b7ED5084c7a9a302FF5a95B9E980c',
    //   call: tokenList['0x9D8FEb661AFc92b83c45fC21836C114164beB285'],
    //   coll: tokenList['0x25a722fbd8c4080937CAD2A4DFa2eeeA29539231'],
    //   swap_sqp: 992187500,
    //   expiry_time: 1634017600,
    // },
  },
  {
    bond: tokens['USDC'],
    want: tokens['USDT'],
    r1: {
      pool: '0x3894e050adae3ef3D10d7e1c79AE8F7A07866a90',
      call: tokenList['0x404Ced902eE6d630db51969433ea7DD2EE3524B8'],
      coll: tokenList['0x61E04744eD53E1Ae61A9325A5Eba31AEA24eca4D'],
      swap_sqp: 992187500,
      expiry_time: 1633017600,
    },
  },
]

const poolList = {}
const poolSelect = {}
const wantList = {}
const bondSet = new Set()

pools.forEach(({ bond, want, r1, r2 }) => {
  ;[r1, r2].forEach(
    (r, key) => r && (poolSelect[`${bond.addr}-${want.addr}-${key}`] = poolList[r.pool] = { ...r, bond, want }),
  )
  bondSet.add(bond)
})

const bondList = Array.from(bondSet)

Object.keys(poolSelect).forEach((val) => {
  const item = val.split('-')
  const want = tokenList[item[1]]
  wantList[item[0]] ? wantList[item[0]].add(want) : (wantList[item[0]] = new Set([want]))
})
Object.keys(wantList).forEach((val) => {
  wantList[val] = Array.from(wantList[val])
})

export default pools
export { poolConfig, tokens, tokenList, poolList, bondList, wantList, poolSelect }
