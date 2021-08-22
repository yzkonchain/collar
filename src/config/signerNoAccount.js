import Web3 from 'web3'
import { ethers } from 'ethers'

const httpProvider = new Web3.providers.HttpProvider('https://ropsten.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161', {
  timeout: 10000,
})
const signer = new ethers.providers.Web3Provider(httpProvider)
export default signer
