import { ethers } from 'ethers'
import { useState, useContext, useRef } from 'react'
import {
  makeStyles,
  Icon,
  TextField,
  Button,
  ButtonGroup,
  Paper,
  Popper,
  MenuItem,
  MenuList,
  ClickAwayListener,
} from '@material-ui/core'
import { context, tokenList, STYLE } from '@/config'
import { Loading } from '@/components/Modules'

const useStyles = makeStyles({
  root: {
    height: 'calc(100vh - 76px)',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    padding: '10px',
    fontFamily: 'Gillsans',
  },
  title: {
    margin: '-100px 0 10px',
    [STYLE.PC]: {
      fontSize: '50px',
    },
    [STYLE.MOBILE]: {
      fontSize: '40px',
    },
  },
  describe: {
    display: 'flex',
    fontSize: '18px',
    margin: '5px',
    [STYLE.MOBILE]: {
      flexDirection: 'column',
      alignItems: 'center',
    },
  },
  input: {
    backgroundColor: 'white',
    margin: '30px 0',
    width: '600px',
    [STYLE.MOBILE]: {
      width: '80vw',
    },
  },
})

const tokens = Object.keys(tokenList)
  .filter((addr) => ['COLLAR', 'CLPT', 'CALL', 'COLL'].indexOf(tokenList[addr].symbol) === -1)
  .map((addr) => tokenList[addr])

export default function Faucet() {
  const classes = useStyles()
  const {
    state: { signer, controller },
  } = useContext(context)

  const [amount, setAmount] = useState('')
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState(tokens[0])
  const [loading, setLoading] = useState(false)
  const anchorRef = useRef(null)

  const sendMe = async () => {
    if (signer) {
      const value = ethers.utils.parseEther(String(amount || 0))
      setLoading(true)
      if (value.eq('0')) controller.notify('faucet', 'empty')
      else if (await controller.faucet(selected.addr, value)) setAmount('')
    } else controller.notify('noaccount')
    setLoading(false)
  }

  return (
    <div className={classes.root}>
      <div className={classes.title}>Collar Faucet</div>
      <div className={classes.describe}>
        <span>Claim your test token</span>
        <span>for Collar open alpha product</span>
      </div>
      <TextField
        className={classes.input}
        value={amount}
        label={
          amount === ''
            ? 'The amount of ETH needed.'
            : `You will get ${(133337 * amount || 0) + 13.37} ${selected.symbol}`
        }
        type="number"
        variant="filled"
        onChange={({ target: { value: v } }) => setAmount(v)}
      />

      <ButtonGroup variant="contained" color="primary" ref={anchorRef}>
        <Button onClick={sendMe} style={{ padding: '0 50px' }}>
          SEND ME {selected.symbol}
        </Button>
        <Button onClick={() => setOpen((v) => !v)}>
          <Icon>arrow_drop_down</Icon>
        </Button>
      </ButtonGroup>
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        style={{ margin: '10px 0', zIndex: '1' }}
        transition
        disablePortal
      >
        <Paper>
          <ClickAwayListener onClickAway={() => setOpen(false)}>
            <MenuList>
              {tokens.map((token) => (
                <MenuItem
                  key={token.addr}
                  selected={token === selected}
                  onClick={() => {
                    setSelected(token)
                    setOpen(false)
                  }}
                >
                  <img alt="" src={token.icon} style={{ width: '20px', marginLeft: '10px' }} />
                  <span style={{ fontFamily: 'Gillsans', margin: '0 20px' }}>{token.symbol}</span>
                </MenuItem>
              ))}
            </MenuList>
          </ClickAwayListener>
        </Paper>
      </Popper>
      <Loading open={loading} />
    </div>
  )
}
