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
  browser: 'https://ropsten.etherscan.io',
  gasAdjustment: 150,
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
      r0: [
        {
          addr: '0x506FeA08646b7ED5084c7a9a302FF5a95B9E980c',
          coll: '0x25a722fbd8c4080937CAD2A4DFa2eeeA29539231',
          call: '0x9D8FEb661AFc92b83c45fC21836C114164beB285',
          expiry_time: 1633017600,
        },
      ],
      r1: {
        addr: '0x110D4F81bFAB6e6FBd2A3db34f62814c5ec29F51',
        coll: '0x38C4A0d539F8e9AFA5EFBD46aAA6b31013480c00',
        call: '0xEA84958BAC11f7665e339599595c425A81E894d6',
        expiry_time: 1640966400,
      },
      r2: {
        addr: '0xBD2186005eAF2B62878F9bfAF17eac39e78265eE',
        coll: '0xd2e21Ab23cd3ebDDe29e7454BB04e2210ECEa4DF',
        call: '0x51BDD8439F1fb70455c5d23FD6D7a4AB1a76Ab32',
        expiry_time: 1648742400,
      },
    },
    tokenList,
  ),
  // USDC => USDT
  Pool(
    {
      bond: '0x67C9a0830d922C80A96408EEdF606c528836880C',
      want: '0x08f5F253fb2080660e9a4E3882Ef4458daCd52b0',
      r0: [
        {
          addr: '0x3894e050adae3ef3D10d7e1c79AE8F7A07866a90',
          coll: '0x61E04744eD53E1Ae61A9325A5Eba31AEA24eca4D',
          call: '0x404Ced902eE6d630db51969433ea7DD2EE3524B8',
          expiry_time: 1633017600,
        },
      ],
      r1: {
        addr: '0xa2AD78044CF0BB2E8017Bab5759ecc2433a3F16f',
        coll: '0x2b9816bF69085809604891Bf12Af0ee9cE05a241',
        call: '0x5ed8870aCEF79195Fd672B29C1B96260b1d294D7',
        expiry_time: 1640966400,
      },
      r2: {
        addr: '0x90066f9974f2316A37cbA44de5a0Ec1B1a81B149',
        coll: '0xC581Ce017E5AaDf6e548CB47AFDec3c1017E6b7E',
        call: '0x467c5Cf4D3075BFcbd3d09A6541923893D86a3AA',
        expiry_time: 1648742400,
      },
    },
    tokenList,
  ),
]

export { tokenList, pools, poolConfig }
