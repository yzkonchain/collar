import { iconUsdt, iconUsdc } from '@/assets/svg/token'

const makeToken = (symbol, addr, icon, decimals) => {
  return { symbol, addr, icon: icon || null, decimals: decimals || 18 }
}

const tokenList = {
  '0xe405bD3C4876D1Ea0af92BaCF5831c9FCbDD78aE': makeToken('COLLAR', '0xe405bD3C4876D1Ea0af92BaCF5831c9FCbDD78aE'),
  '0x08f5F253fb2080660e9a4E3882Ef4458daCd52b0': makeToken(
    'USDT',
    '0x08f5F253fb2080660e9a4E3882Ef4458daCd52b0',
    iconUsdt,
  ),
  '0x67C9a0830d922C80A96408EEdF606c528836880C': makeToken(
    'USDC',
    '0x67C9a0830d922C80A96408EEdF606c528836880C',
    iconUsdc,
  ),
  '0x506FeA08646b7ED5084c7a9a302FF5a95B9E980c': makeToken('CLPT', '0x506FeA08646b7ED5084c7a9a302FF5a95B9E980c'),
  '0x9D8FEb661AFc92b83c45fC21836C114164beB285': makeToken(
    'CALL',
    '0x9D8FEb661AFc92b83c45fC21836C114164beB285',
    iconUsdc,
  ),
  '0x25a722fbd8c4080937CAD2A4DFa2eeeA29539231': makeToken(
    'COLL',
    '0x25a722fbd8c4080937CAD2A4DFa2eeeA29539231',
    iconUsdc,
  ),
  '0x3894e050adae3ef3D10d7e1c79AE8F7A07866a90': makeToken('CLPT', '0x3894e050adae3ef3D10d7e1c79AE8F7A07866a90'),
  '0x404Ced902eE6d630db51969433ea7DD2EE3524B8': makeToken(
    'CALL',
    '0x404Ced902eE6d630db51969433ea7DD2EE3524B8',
    iconUsdc,
  ),
  '0x61E04744eD53E1Ae61A9325A5Eba31AEA24eca4D': makeToken(
    'COLL',
    '0x61E04744eD53E1Ae61A9325A5Eba31AEA24eca4D',
    iconUsdc,
  ),
}

const tokens = (() => {
  const list = {}
  Object.keys(tokenList).map((val) => (list[tokenList[val].symbol] = tokenList[val]))
  return list
})()

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

const poolConfig = {
  network: 'ropsten',
  chainid: 3,
  infuraid: '9180c5a422ac44f9b21ad7927b6b662c',
}

export default pools
export { poolList, bondList, tokenList, poolConfig }
