import { ethers } from 'ethers'
import Web3Modal from 'web3modal'
import WalletConnectProvider from '@walletconnect/web3-provider'
import { useContext, useEffect, useState } from 'react'
import { makeStyles, Icon, Box, AppBar, Toolbar, IconButton, Typography } from '@material-ui/core'
import { context, poolConfig } from '@/config'

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

export default function Header() {
  const classes = useStyles()
  const {
    state: { menu_open, CT },
    setState,
  } = useContext(context)
  const _CT = CT()
  const [dialog, setDialog] = useState(false)

  const connect_wallet = async () => {
    const web3provider = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(web3provider)
    const signer = provider.getSigner()
    const network = await provider.getNetwork()
    if (network.chainId !== poolConfig.chainid) {
      _CT.notify('network', { chainId: network.chainId })
      setState({ signer: null, controller: _CT })
      return
    }

    setState({ signer, controller: CT(signer) })
    if (!web3provider.on) return

    web3provider.on('disconnect', () => {
      web3Modal.clearCachedProvider()
      setState({ signer: null, controller: _CT })
      setDialog(false)
    })

    web3provider.on('accountsChanged', async (accounts) => {
      if (accounts.length === 0) {
        web3Modal.clearCachedProvider()
        setState({ signer: null, controller: _CT })
        setDialog(false)
        return
      }
      await connect_wallet()
    })

    web3provider.on('chainChanged', async (chainId) => {
      if (chainId !== poolConfig.chainid) {
        _CT.notify('network', { chainId: network.chainId })
        setState({ signer: null, controller: _CT })
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
              <IconButton color="inherit" onClick={() => setState({ menu_open: true })} edge="start">
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
          setState({ signer: null, controller: _CT })
          setDialog(false)
        }}
        open={dialog}
        onClose={() => setDialog(false)}
      />
    </div>
  )
}
