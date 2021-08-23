import { COLLAR, USDT, USDC, COLL, CALL } from '@/assets/svg/token'

var tokenList = {},
  pools = []

const poolConfig = {
  network: 'ropsten',
  chainid: 3,
  infuraid: '9180c5a422ac44f9b21ad7927b6b662c',
  collar: '0xe405bD3C4876D1Ea0af92BaCF5831c9FCbDD78aE',
}

tokenList = {
  [poolConfig.collar]: Token('COLLAR', poolConfig.collar),
  '0x08f5F253fb2080660e9a4E3882Ef4458daCd52b0': Token('USDT', '0x08f5F253fb2080660e9a4E3882Ef4458daCd52b0', USDT),
  '0x67C9a0830d922C80A96408EEdF606c528836880C': Token('USDC', '0x67C9a0830d922C80A96408EEdF606c528836880C', USDC),
  // USDT => USDC r1
  '0x506FeA08646b7ED5084c7a9a302FF5a95B9E980c': Token('CLPT', '0x506FeA08646b7ED5084c7a9a302FF5a95B9E980c'),
  '0x25a722fbd8c4080937CAD2A4DFa2eeeA29539231': Token('COLL', '0x25a722fbd8c4080937CAD2A4DFa2eeeA29539231'),
  '0x9D8FEb661AFc92b83c45fC21836C114164beB285': Token('CALL', '0x9D8FEb661AFc92b83c45fC21836C114164beB285'),
  // USDT => USDC r2
  '0x110D4F81bFAB6e6FBd2A3db34f62814c5ec29F51': Token('CLPT', '0x110D4F81bFAB6e6FBd2A3db34f62814c5ec29F51'),
  '0x38C4A0d539F8e9AFA5EFBD46aAA6b31013480c00': Token('COLL', '0x38C4A0d539F8e9AFA5EFBD46aAA6b31013480c00'),
  '0xEA84958BAC11f7665e339599595c425A81E894d6': Token('CALL', '0xEA84958BAC11f7665e339599595c425A81E894d6'),
  // USDC => USDT r1
  '0x3894e050adae3ef3D10d7e1c79AE8F7A07866a90': Token('CLPT', '0x3894e050adae3ef3D10d7e1c79AE8F7A07866a90'),
  '0x61E04744eD53E1Ae61A9325A5Eba31AEA24eca4D': Token('COLL', '0x61E04744eD53E1Ae61A9325A5Eba31AEA24eca4D'),
  '0x404Ced902eE6d630db51969433ea7DD2EE3524B8': Token('CALL', '0x404Ced902eE6d630db51969433ea7DD2EE3524B8'),
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
      addr: '0x110D4F81bFAB6e6FBd2A3db34f62814c5ec29F51',
      coll: '0x38C4A0d539F8e9AFA5EFBD46aAA6b31013480c00',
      call: '0xEA84958BAC11f7665e339599595c425A81E894d6',
      expiry_time: 1640966400,
    },
  }),
  // USDC => USDT
  Pool({
    bond: '0x67C9a0830d922C80A96408EEdF606c528836880C',
    want: '0x08f5F253fb2080660e9a4E3882Ef4458daCd52b0',
    r1: {
      addr: '0x3894e050adae3ef3D10d7e1c79AE8F7A07866a90',
      coll: '0x61E04744eD53E1Ae61A9325A5Eba31AEA24eca4D',
      call: '0x404Ced902eE6d630db51969433ea7DD2EE3524B8',
      expiry_time: 1633017600,
    },
  }),
]

function Token(symbol, addr, icon, decimals) {
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

function Pool({ bond, want, r1, r2 }) {
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

export { tokenList, pools, poolConfig }
