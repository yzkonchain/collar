import { ethers } from 'ethers'
import Web3Modal from 'web3modal'
import WalletConnectProvider from '@walletconnect/web3-provider'
import { context, poolConfig } from '@/config'

import { useSnackbar } from 'notistack'

import { useContext, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Box, AppBar, Toolbar, IconButton, Typography } from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'

import ConnectWallet from './ConnectWallet'
import AccountDialog from './AccountDialog'

const useStyles = makeStyles((theme) => ({
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
      zIndex: '5',
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

export default function Header() {
  const classes = useStyles()
  const {
    state: { menu_open, dialog_open, signer },
    setState,
  } = useContext(context)
  const { enqueueSnackbar } = useSnackbar()

  const connect_wallet = async () => {
    const web3provider = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(web3provider)
    const signer = provider.getSigner()
    const network = await provider.getNetwork()
    if (network.chainId !== poolConfig.chainid) {
      enqueueSnackbar({
        type: 'failed',
        title: 'Fail.',
        message: `not support this network, chainId: ${network.chainId}`,
      })
      setState({ signer: null })
      return
    }
    setState({
      signer: signer,
    })
    if (!web3provider.on) {
      return
    }
    web3provider.on('disconnect', () => {
      web3Modal.clearCachedProvider()
      setState({ signer: null, dialog_open: false })
    })
    web3provider.on('accountsChanged', async (accounts) => {
      if (accounts.length === 0) {
        web3Modal.clearCachedProvider()
        setState({ signer: null, dialog_open: false })
        return
      }
      await connect_wallet()
    })
    web3provider.on('chainChanged', async (chainId) => {
      if (chainId !== poolConfig.chainid) {
        enqueueSnackbar({
          type: 'failed',
          title: 'Fail.',
          message: `not support this network, chainId: ${network.chainId}`,
        })
        setState({ signer: null })
      } else {
        await connect_wallet()
      }
    })
  }
  useEffect(() => {
    if (web3Modal.cachedProvider) {
      connect_wallet()
      return
    }
  }, [])
  return (
    <div>
      <Box className={classes.root} overflow="hidden">
        <AppBar position="static" className={classes.appbar}>
          <Toolbar className={classes.toolbar}>
            <Box maxWidth="10vw" display={menu_open ? 'none' : 'block'}>
              <IconButton
                color="inherit"
                onClick={() => {
                  setState({ menu_open: true })
                }}
                edge="start"
              >
                <MenuIcon />
              </IconButton>
            </Box>
            <Box flexGrow={1} textOverflow="ellipsis">
              <Typography variant="h6" noWrap style={{ fontFamily: 'Gill Sans' }}>
                Collar
              </Typography>
            </Box>
            <ConnectWallet
              signer={signer}
              click_connect={connect_wallet}
              click_address={() => {
                setState({ dialog_open: true })
              }}
            />
          </Toolbar>
        </AppBar>
      </Box>

      <AccountDialog
        signer={signer}
        disconnect={() => {
          web3Modal.clearCachedProvider()
          setState({ signer: null, dialog_open: false })
        }}
        open={dialog_open}
        onClose={() => {
          setState({ dialog_open: false })
        }}
      />
    </div>
  )
}
