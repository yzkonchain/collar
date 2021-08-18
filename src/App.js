import { ethers } from 'ethers'
import { useReducer, useEffect, createContext } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { context } from '@/config'

import Web3Modal from 'web3modal'
import WalletConnectProvider from '@walletconnect/web3-provider'

import { MyNotifyProvider } from '@/components/Modules'

import { poolConfig } from '@/config'

import Header from './components/Header'
import Navigator from './components/Navigator'

const useStyles = makeStyles((theme) => ({
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

export default function App() {
  const classes = useStyles()
  const [state, setState] = useReducer((s, ns) => ({ ...s, ...ns }), {
    menu_open: false,
    dialog_open: false,
    signer: null,
  })

  const connect_wallet = async () => {
    const web3provider = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(web3provider)
    const signer = provider.getSigner()
    const network = await provider.getNetwork()
    if (network.chainId !== poolConfig.chainid) {
      alert('not support this network, chainId: ' + network.chainId)
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
        alert('not support this network, chainId: ' + chainId)
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
    <context.Provider value={{ state, setState, connect_wallet, web3Modal }}>
      <MyNotifyProvider>
        <Header />
        <Navigator />
      </MyNotifyProvider>
    </context.Provider>
  )
}
