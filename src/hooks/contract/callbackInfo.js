const failed = {
  type: 'failed',
  title: 'Fail.',
  message: 'Your transaction failed.',
}
const callbackInfo = (method, status) => {
  switch (method) {
    case 'balance':
      switch (status) {
        case 'insufficient':
          return {
            type: 'failed',
            title: 'Fail.',
            message: 'Maximum range exceeded.',
          }
        default:
          return failed
      }
    case 'approve':
      switch (status) {
        case 1:
          return {
            type: 'success',
            title: 'Approved!',
            message: 'You have successfully approved your asset.',
          }
        default:
          return failed
      }
    case 'borrow':
      switch (status) {
        case 1:
          return {
            type: 'success',
            title: 'Deposited and Borrowed.',
            message: 'You have successfully borrowed asset.',
          }
        default:
          return failed
      }
    case 'repay':
      switch (status) {
        case 1:
          return {
            type: 'success',
            title: 'Repaid.',
            message: 'You have successfully repaid your loan.',
          }
        default:
          return failed
      }
    case 'deposit':
      switch (status) {
        case 1:
          return {
            type: 'success',
            title: 'Deposited.',
            message: 'You have successfully deposited your asset.',
          }
        default:
          return failed
      }
    case 'withdraw':
      switch (status) {
        case 1:
          return {
            type: 'success',
            title: 'Withdrawn.',
            message: 'You have successfully withdrawn your liquidity.',
          }
        default:
          return failed
      }
    case 'claim':
      switch (status) {
        case 1:
          return {
            type: 'success',
            title: 'Claimed.',
            message: 'You have successfully claimed your reward.',
          }
        default:
          return failed
      }
    case 'lend':
      switch (status) {
        case 1:
          return {
            type: 'success',
            title: 'Lent.',
            message: 'You have successfully lent your assset.',
          }
        default:
          return failed
      }
    case 'redeem':
      switch (status) {
        case 1:
          return {
            type: 'success',
            title: 'Redeemed.',
            message: 'You have successfully redeemed your loan.',
          }
        default:
          return failed
      }
    case 'mint':
      switch (status) {
        case 1:
          return {
            type: 'success',
            title: 'mint.',
            message: 'You have successfully mint.',
          }
        default:
          return failed
      }
    case 'faucet':
      switch (status) {
        case 1:
          return {
            type: 'success',
            title: 'Faucet.',
            message: 'You have successfully get test token.',
          }
        case 'empty':
          return {
            type: 'failed',
            title: 'Fail.',
            message: 'The amount of ETH is necessary.',
          }
        case 'insufficient':
          return {
            type: 'failed',
            title: 'Fail.',
            message: `You dont't have enough ETH to exchange.`,
          }
        default:
          return failed
      }
    case 'cancel':
      return {
        type: 'failed',
        title: 'Fail.',
        message: 'User denied transaction signature.',
      }
    case 'support':
      return {
        type: 'failed',
        title: 'Fail.',
        message: `Not supported yet!`,
      }
    case 'noaccount':
      return {
        type: 'failed',
        title: 'Fail.',
        message: 'No Account!',
      }
    case 'network':
      switch (true) {
        case status instanceof Object:
          return {
            type: 'failed',
            title: 'Fail.',
            message: `This network is not supported. chainId: ${status.chainId}`,
          }
        default:
          return {
            type: 'failed',
            title: 'Fail.',
            message: 'Connect error, please refresh the page!',
          }
      }
    default:
      return failed
  }
}

export default callbackInfo
