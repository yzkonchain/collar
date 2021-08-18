import { useContext } from 'react'
import { context } from '@/config'
import { makeStyles } from '@material-ui/core/styles'
import { Box, AppBar, Toolbar, IconButton, Typography } from '@material-ui/core'
import ConnectWallet from './ConnectWallet'
import AccountDialog from './AccountDialog'
import MenuIcon from '@material-ui/icons/Menu'
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
}))
export default function Header() {
  const classes = useStyles()
  const {
    state: { menu_open, dialog_open, signer },
    setState,
    web3Modal,
    connect_wallet,
  } = useContext(context)

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
