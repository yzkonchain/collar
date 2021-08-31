import { ethers } from 'ethers'
import { useContext, useReducer, useMemo, useEffect } from 'react'
import { makeStyles } from '@material-ui/core'
import { MyButton } from '@/components/Modules'
import { tokenList } from '@/config'

import AmountInput from './AmountInput'
import AmountShow from './AmountShow'
import ContractLink from './ContractLink'

const ZERO = ethers.constants.Zero
const INIT = {
  input: {
    bond: ZERO,
  },
  output: {
    want: ZERO,
  },
  tip: { fee: '0.0000', min: '0.000', slip: '0.00' },
  I: { bond: '' },
  old: { bond: '' },
}

const useStyles = makeStyles({
  root: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'stretch',
  },
  main: {
    flex: 6,
    display: 'flex',
    flexDirection: 'column',
  },
  icon_arrow: {
    fontFamily: 'Material Icons',
    fontSize: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  button: {
    marginTop: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    '&>button': {
      flex: 1,
      '&:nth-child(1)': {
        marginRight: '10px',
      },
    },
  },
  input: {
    width: '100%',
    border: 'black 2px solid',
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  show: {
    flex: 9,
    display: 'flex',
    flexDirection: 'column',
    '&>div': {
      flex: 1,
      border: 'black 2px solid',
    },
  },
})

export default function Swap() {
  const classes = useStyles()
  const [state, setState] = useReducer((o, n) => ({ ...o, ...n }), INIT)

  return (
    <div className={classes.root}>
      <div className={classes.main}>
        <div className={classes.input}>
          <AmountInput
            title="bond"
            State={{
              state,
              setState,
              token: tokenList['0x08f5F253fb2080660e9a4E3882Ef4458daCd52b0'],
              max: ZERO,
              if_max: false,
            }}
          />
        </div>
        <div className={classes.button}>
          <MyButton name="Approve" onClick={() => {}} disabled={false} />
          <MyButton name="Deposit" onClick={() => {}} disabled={false} />
        </div>
      </div>
      <span className={classes.icon_arrow}>navigate_next</span>
      <div className={classes.show}>
        <div>
          <AmountShow title="want" state={{ state, token: tokenList['0x08f5F253fb2080660e9a4E3882Ef4458daCd52b0'] }} />
          <ContractLink token="COLL" link="XXXXXXXX" />
          <ContractLink token="CALL" link="XXXXXXXX" />
        </div>
      </div>
    </div>
  )
}
