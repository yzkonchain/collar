import { useContext, useState } from 'react'
import { Button, LinearProgress, Box } from '@material-ui/core'
import { context } from '@/config'

export default function ConnectWallet({ click_address, click_connect }) {
  const {
    state: { signer },
  } = useContext(context)
  const [address, setAddress] = useState(null)

  ;(async () => {
    if (signer) {
      const _address = await signer.getAddress()
      if (_address !== address) setAddress(_address)
    } else if (address !== null) setAddress(null)
  })()

  return address ? (
    <Button
      variant="outlined"
      color="inherit"
      onClick={click_address}
      style={{ borderRadius: '0', fontFamily: 'Avenir' }}
    >
      <Box textOverflow="ellipsis" fontFamily="Avenir" fontWeight="fontWeightBold" overflow="hidden" maxWidth="25vw">
        {/* {address} */}
        {`${address.slice(0, 10)}...`}
      </Box>
    </Button>
  ) : signer ? (
    <Box width="25vw">
      <LinearProgress color="secondary" />
    </Box>
  ) : (
    <Button
      variant="outlined"
      color="inherit"
      onClick={click_connect}
      style={{ borderRadius: '0', fontFamily: 'Avenir' }}
    >
      Connect Wallet
    </Button>
  )
}
