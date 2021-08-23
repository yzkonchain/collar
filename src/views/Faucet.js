import { ethers } from 'ethers'
import { contract } from '@/hooks'
import { context } from '@/config'
import { useState, useContext, useRef } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { TextField, Button } from '@material-ui/core'
import { ButtonGroup, Paper, Popper, MenuItem, MenuList, ClickAwayListener } from '@material-ui/core'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'

const useStyles = makeStyles({
  root: {
    height: 'calc(90vh - 100px)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    margin: '10px',
    fontFamily: 'Gillsans',
    '&>div': {
      margin: '10px',
    },
  },
  input: {
    backgroundColor: 'white',
    marginTop: '30px !important',
    width: '600px',
    '@media screen and (max-width:960px)': {
      width: '80vw',
    },
  },
})

const addr = {
  usdt: '0x08f5F253fb2080660e9a4E3882Ef4458daCd52b0',
  usdc: '0x67C9a0830d922C80A96408EEdF606c528836880C',
}

const options = ['Create a merge commit', 'Squash and merge', 'Rebase and merge']

export default function Faucet() {
  const classes = useStyles()
  const { state } = useContext(context)
  const CT = contract()
  const [amount, setAmount] = useState('')
  const sendMe = async (token) => {
    if (state.signer) {
      const ct = CT(state.signer)
      const value = ethers.utils.parseEther(String(amount || 0))
      if (value.eq('0')) ct.notify('faucet', 'empty')
      else if (await ct.faucet(addr[token], value)) setAmount('')
    } else CT()
  }

  const anchorRef = useRef(null)
  const [open, setOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(1)
  const handleClick = () => console.log(selectedIndex)

  return (
    <div className={classes.root}>
      <div style={{ fontSize: '40px' }}>Collar Faucet</div>
      <div style={{ fontSize: '20px', maxWidth: 'calc(80vw)' }}>
        Claim your test token for Collar open alpha product
      </div>
      <TextField
        className={classes.input}
        label={amount === '' ? 'The amount of ETH needed.' : `You will get ${(133337 * amount || 0) + 13.37} testcoin`}
        type="number"
        variant="filled"
        value={amount}
        onChange={({ target: { value: v } }) => setAmount(v)}
      />
      <div style={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
        <Button
          variant="contained"
          color="primary"
          disableElevation
          style={{ width: '200px', maxWidth: '40%', margin: '10px' }}
          onClick={() => sendMe('usdt')}
        >
          Send me USDT
        </Button>
        <Button
          variant="contained"
          color="primary"
          disableElevation
          style={{ width: '200px', maxWidth: '40%', margin: '10px' }}
          onClick={() => sendMe('usdc')}
        >
          Send me USDC
        </Button>
      </div>

      <ButtonGroup variant="contained" color="primary" ref={anchorRef}>
        <Button onClick={handleClick}>{options[selectedIndex]}</Button>
        <Button onClick={() => setOpen((v) => !v)}>
          <ArrowDropDownIcon />
        </Button>
      </ButtonGroup>
      <Popper open={open} anchorEl={anchorRef.current} transition disablePortal>
        <Paper>
          <ClickAwayListener onClickAway={() => setOpen(false)}>
            <MenuList>
              {options.map((option, index) => (
                <MenuItem
                  key={option}
                  selected={index === selectedIndex}
                  onClick={() => {
                    setSelectedIndex(index)
                    setOpen(false)
                  }}
                >
                  {option}
                </MenuItem>
              ))}
            </MenuList>
          </ClickAwayListener>
        </Paper>
      </Popper>
    </div>
  )
}
