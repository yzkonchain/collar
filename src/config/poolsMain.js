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
  '0x67C9a0830d922C80A96408EEdF606c528836880C': Token('USDC', '0x67C9a0830d922C80A96408EEdF606c528836880C', USDC),
  '0xF3d7FdB3395CeAba7856A273178f009389C6582d': Token('yzkUSC', '0xF3d7FdB3395CeAba7856A273178f009389C6582d', USDT, 16),
  //
  '0xf7187fD2FE5E1d01f4C0e9dC91ccF96a2a93A931': Token('CLPT', '0xf7187fD2FE5E1d01f4C0e9dC91ccF96a2a93A931'),
  '0xF9176bFDe0fDF7D8B9B57e668Fbd8E2cee3072E5': Token('COLL', '0xF9176bFDe0fDF7D8B9B57e668Fbd8E2cee3072E5'),
  '0x255E37fD5747F7fFF87B6BBb72F3A803F3556aB5': Token('CALL', '0x255E37fD5747F7fFF87B6BBb72F3A803F3556aB5'),
}

pools = [
  Pool({
    bond: '0xF3d7FdB3395CeAba7856A273178f009389C6582d',
    want: '0x67C9a0830d922C80A96408EEdF606c528836880C',
    r1: {
      addr: '0xf7187fD2FE5E1d01f4C0e9dC91ccF96a2a93A931',
      coll: '0xF9176bFDe0fDF7D8B9B57e668Fbd8E2cee3072E5',
      call: '0x255E37fD5747F7fFF87B6BBb72F3A803F3556aB5',
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
