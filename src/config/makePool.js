import { ethers } from 'ethers'
import { abi } from '@/config/abi'
import signerNoAccount from '@/config/signerNoAccount'
import { COLLAR, COLL, CALL } from '@/assets/svg/token'

const Token = (symbol, addr, icon, decimals) => {
  const token = { symbol, addr, decimals: 18, ct: new ethers.Contract(addr, abi, signerNoAccount) }
  switch (symbol) {
    case 'COLLAR':
    case 'CLPT':
      token.icon = COLLAR
      break
    case 'COLL':
      token.icon = COLL
      break
    case 'CALL':
      token.icon = CALL
      break
    default:
      token.icon = icon || COLLAR
      token.decimals = decimals || 18
      break
  }
  return { [addr]: token }
}

const Pool = ({ bond, want, r1, r2 }, list) => {
  const r = [r1, r2].map((pool) => {
    if (pool) {
      const { addr, coll, call, swap_sqp, expiry_time, symbol } = pool
      list[addr] = Token('CLPT', addr)[addr]
      list[coll] = Token('COLL', coll)[coll]
      list[call] = Token('CALL', call)[call]
      return {
        addr,
        expiry_time,
        bond: list[bond],
        want: list[want],
        coll: list[coll],
        call: list[call],
        swap_sqp: swap_sqp || 992187500,
        symbol: symbol || 'CLPT',
        icon: COLLAR,
        ct: new ethers.Contract(addr, abi, signerNoAccount),
      }
    } else return null
  })
  return { r1: r[0], r2: r[1] }
}

export { Token, Pool }
