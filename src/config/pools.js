import { COLLAR, USDT, USDC, COLL, CALL } from '@/assets/svg/token'

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
      return { symbol, addr, icon, decimals: decimals || 18 }
  }
}

const poolConfig = {
  network: 'ropsten',
  chainid: 3,
  infuraid: '9180c5a422ac44f9b21ad7927b6b662c',
}

const tokenList = {
  '0xe405bD3C4876D1Ea0af92BaCF5831c9FCbDD78aE': Token('COLLAR', '0xe405bD3C4876D1Ea0af92BaCF5831c9FCbDD78aE'),
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
Object.keys(tokenList).map((val) => (tokens[tokenList[val].symbol] = tokenList[val]))

const pools = [
  {
    pool: '0x506FeA08646b7ED5084c7a9a302FF5a95B9E980c',
    collar: tokens['COLLAR'],
    bond: tokens['USDT'],
    want: tokens['USDC'],
    call: tokenList['0x9D8FEb661AFc92b83c45fC21836C114164beB285'],
    coll: tokenList['0x25a722fbd8c4080937CAD2A4DFa2eeeA29539231'],
    swap_sqp: 992187500,
    expiry_time: 1633017600,
  },
  {
    pool: '0x3894e050adae3ef3D10d7e1c79AE8F7A07866a90',
    collar: tokens['COLLAR'],
    bond: tokens['USDC'],
    want: tokens['USDT'],
    call: tokenList['0x404Ced902eE6d630db51969433ea7DD2EE3524B8'],
    coll: tokenList['0x61E04744eD53E1Ae61A9325A5Eba31AEA24eca4D'],
    swap_sqp: 992187500,
    expiry_time: 1633017600,
  },
]

const poolList = {}
const bondSet = new Set()

pools.map((val, key) => {
  poolList[val.pool] = val
  bondSet.add(val.bond)
})

const bondList = Array.from(bondSet)

export default pools
export { poolList, bondList, tokenList, poolConfig }
