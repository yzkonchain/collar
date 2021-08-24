import { USDT, USDC } from '@/assets/svg/token'
import { Token, Pool } from './makePool'

var tokenList = {},
  pools = []

const poolConfig = {
  network: 'ropsten',
  chainid: 3,
  infuraid: '9180c5a422ac44f9b21ad7927b6b662c',
  collar: '0xe405bD3C4876D1Ea0af92BaCF5831c9FCbDD78aE',
  gasAdjustment: 120,
}

tokenList = {
  ...Token('COLLAR', poolConfig.collar),
  ...Token('USDC', '0x67C9a0830d922C80A96408EEdF606c528836880C', USDC),
  ...Token('yzkUSC', '0xF3d7FdB3395CeAba7856A273178f009389C6582d', USDT, 16),
}

pools = [
  Pool(
    {
      bond: '0xF3d7FdB3395CeAba7856A273178f009389C6582d',
      want: '0x67C9a0830d922C80A96408EEdF606c528836880C',
      r1: {
        addr: '0xf7187fD2FE5E1d01f4C0e9dC91ccF96a2a93A931',
        coll: '0xF9176bFDe0fDF7D8B9B57e668Fbd8E2cee3072E5',
        call: '0x255E37fD5747F7fFF87B6BBb72F3A803F3556aB5',
        expiry_time: 1633017600,
      },
    },
    tokenList,
  ),
]

export { tokenList, pools, poolConfig }
