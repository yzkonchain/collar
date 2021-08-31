import { ethers } from 'ethers'

// const ROPSTEN = 'https://ropsten.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'
const ROPSTEN = 'https://eth-ropsten.alchemyapi.io/v2/yv9AMwDtWom9CxzvGRZCMkK9CFJCR4zL'
const KOVAN = 'https://kovan.infura.io'

const signer = new ethers.providers.JsonRpcProvider(ROPSTEN, 'ropsten')

export default signer
