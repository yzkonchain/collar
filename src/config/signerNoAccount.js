import Web3 from 'web3'
import { ethers } from 'ethers'

const ROPSTEN = 'https://ropsten.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'
const KOVAN = 'https://kovan.infura.io'
const TIMEOUT = { timeout: 10000 }

const httpProvider = new Web3.providers.HttpProvider(ROPSTEN, TIMEOUT)
const signer = new ethers.providers.Web3Provider(httpProvider)

export default signer
