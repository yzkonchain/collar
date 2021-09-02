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
    coll: ZERO,
    want: ZERO,
  },
  output: {
    coll: ZERO,
    want: ZERO,
  },
  I: { coll: '', want: '' },
  old: { coll: '', want: '' },
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

export default function Swap({ data }) {
  const classes = useStyles()
  const [state, setState] = useReducer((o, n) => ({ ...o, ...n }), INIT)
  const { pool } = data

  return (
    <div className={classes.root}>
      <div className={classes.main}>
        <div className={classes.input}>
          <AmountInput
            title="coll"
            State={{
              state,
              setState,
              token: pool.coll,
              max: ZERO,
              if_max: false,
            }}
          />
        </div>
        <div className={classes.button}>
          <MyButton name="Approve" onClick={() => {}} disabled={true} />
          <MyButton name="Swap" onClick={() => {}} disabled={true} />
        </div>
      </div>
      <span className={classes.icon_arrow}>navigate_next</span>
      <div className={classes.show}>
        <div>
          <AmountShow title="want" state={{ state, token: pool.want }} />
          <ContractLink token={pool.coll.symbol} contract={pool.coll.addr} />
          <ContractLink token={pool.call.symbol} contract={pool.call.addr} />
        </div>
      </div>
    </div>
  )
}
