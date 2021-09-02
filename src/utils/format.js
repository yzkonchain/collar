import { ethers } from 'ethers'

const format = (num, n) => ethers.utils.formatUnits(num, n || 18)
const parse = (num, n) => ethers.utils.parseUnits(num || '0', n || 18)

const formatUnits = (v, fixed = 3) => {
  let res
  switch (true) {
    case v < parseFloat('1e3'):
      res = parseFloat(v).toFixed(fixed)
      break
    case v < parseFloat('1e6'):
      res = parseInt(v / 1000).toFixed(fixed) + ' K'
      break
    case v < parseFloat('1e9'):
      res = parseInt(v / 1000000).toFixed(fixed) + ' M'
      break
    case v < parseFloat('1e12'):
      res = parseInt(v / 1000000).toFixed(fixed) + ' G'
      break
    case v < parseFloat('1e15'):
      res = parseInt(v / 1000000).toFixed(fixed) + ' T'
      break
    default:
      res = v
      break
  }
  return res
}

export { format, parse, formatUnits }
