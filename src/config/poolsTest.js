import { USDT, USDC } from '@/assets/svg/token'
import { ethers } from 'ethers'
import { Token, Pool } from './makePool'

var tokenList = {},
  pools = []

const poolConfig = {
  network: 'ropsten',
  chainid: 3,
  infuraid: '9180c5a422ac44f9b21ad7927b6b662c',
  factory: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
  pricePool: '0x5BBBE4Da8b5AF36482F75747Ee38ddFDf3F6e4D9',
  collar: '0xe405bD3C4876D1Ea0af92BaCF5831c9FCbDD78aE',
  stablecoin: '0x08f5F253fb2080660e9a4E3882Ef4458daCd52b0',
  gasAdjustment: 120,
}

// new ethers.Contract(poolConfig.factory, abi, signerNoAccount)
//   .getPool(poolConfig.collar, poolConfig.stablecoin, 3000)
//   .then((pricePool) => new ethers.Contract(pricePool, abi, signerNoAccount).slot0())

tokenList = {
  ...Token('COLLAR', poolConfig.collar),
  ...Token('SWAP', poolConfig.pricePool),
  ...Token('USDT', '0x08f5F253fb2080660e9a4E3882Ef4458daCd52b0', USDT),
  ...Token('USDC', '0x67C9a0830d922C80A96408EEdF606c528836880C', USDC),
}

pools = [
  // USDT => USDC
  Pool(
    {
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
    },
    tokenList,
  ),
  // USDC => USDT
  Pool(
    {
      bond: '0x67C9a0830d922C80A96408EEdF606c528836880C',
      want: '0x08f5F253fb2080660e9a4E3882Ef4458daCd52b0',
      r1: {
        addr: '0x3894e050adae3ef3D10d7e1c79AE8F7A07866a90',
        coll: '0x61E04744eD53E1Ae61A9325A5Eba31AEA24eca4D',
        call: '0x404Ced902eE6d630db51969433ea7DD2EE3524B8',
        expiry_time: 1633017600,
      },
    },
    tokenList,
  ),
]

export { tokenList, pools, poolConfig }
