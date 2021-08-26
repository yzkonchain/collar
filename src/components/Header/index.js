import { ethers } from 'ethers'
import { useContext, useEffect, useState } from 'react'
import { makeStyles, Icon, Box, AppBar, Toolbar, IconButton, Typography } from '@material-ui/core'
import Web3Modal from 'web3modal'
import WalletConnectProvider from '@walletconnect/web3-provider'
import { context, poolConfig, tokenList, poolList, signerNoAccount, abi } from '@/config'

import ConnectWallet from './ConnectWallet'
import AccountDialog from './AccountDialog'

const useStyles = makeStyles(() => ({
  root: {
    zIndex: '9999',
  },
  appbar: {
    backgroundColor: '#4975FF',
  },
  toolbar: {
    minHeight: '56px',
  },
  '@global': {
    '.web3modal-modal-lightbox': {
      zIndex: '9999',
    },
  },
}))

const web3Modal = new Web3Modal({
  network: poolConfig.network,
  cacheProvider: true,
  providerOptions: {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        infuraId: poolConfig.infuraid,
      },
    },
  },
})

const setTokenCT = (signer) => {
  const _signer = signer || signerNoAccount
  ;[tokenList, poolList].forEach((list) =>
    Object.keys(list).forEach((addr) => (list[addr].ct = new ethers.Contract(addr, abi, _signer))),
  )
}

export default function Header() {
  const classes = useStyles()
  const {
    state: { menu_open, controller },
    setState,
  } = useContext(context)
  const [dialog, setDialog] = useState(false)

  const setSigner = (signer) => {
    setState({ signer })
    setTokenCT(signer)
  }

  const connect_wallet = async () => {
    const web3provider = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(web3provider)
    const signer = provider.getSigner()
    const network = await provider.getNetwork()

    if (network.chainId !== poolConfig.chainid) {
      controller.notify('network', { chainId: network.chainId })
      setSigner(null)
      return
    }

    setSigner(signer)

    if (!web3provider.on) return

    web3provider.on('disconnect', () => {
      web3Modal.clearCachedProvider()
      setSigner(null)
      setDialog(false)
    })

    web3provider.on('accountsChanged', async (accounts) => {
      if (accounts.length === 0) {
        web3Modal.clearCachedProvider()
        setSigner(null)
        setDialog(false)
        return
      }
      await connect_wallet()
    })

    web3provider.on('chainChanged', async (chainId) => {
      if (parseInt(chainId) !== poolConfig.chainid) {
        controller.notify('network', { chainId })
        setSigner(null)
      } else await connect_wallet()
    })
  }

  useEffect(() => web3Modal.cachedProvider && connect_wallet(), [])

  return (
    <div>
      <Box className={classes.root} overflow="hidden">
        <AppBar position="static" className={classes.appbar}>
          <Toolbar className={classes.toolbar}>
            <Box maxWidth="10vw" display={menu_open ? 'none' : 'block'}>
              <IconButton color="inherit" onClick={() => setState({ menu_open: true })}>
                <Icon>menu_icon</Icon>
              </IconButton>
            </Box>
            <Box flexGrow={1} textOverflow="ellipsis">
              <Typography variant="h6" noWrap style={{ fontFamily: 'Gill Sans' }}>
                Collar
              </Typography>
            </Box>
            <ConnectWallet click_connect={connect_wallet} click_address={() => setDialog(true)} />
          </Toolbar>
        </AppBar>
      </Box>

      <AccountDialog
        disconnect={() => {
          web3Modal.clearCachedProvider()
          setSigner(null)
          setDialog(false)
        }}
        open={dialog}
        onClose={() => setDialog(false)}
      />
    </div>
  )
}
