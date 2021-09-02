import { ethers } from 'ethers'
import { useContext, useReducer, useMemo, useEffect } from 'react'
import { makeStyles } from '@material-ui/core'
import { MyButton } from '@/components/Modules'
import { context, proContext } from '@/config'
import { parse, format } from '@/utils/format'
import AmountInput from './AmountInput'
import AmountShow from './AmountShow'
import ContractLink from './ContractLink'

const ZERO = ethers.constants.Zero
const INIT = {
  input: {
    bond: ZERO,
  },
  output: {
    coll: ZERO,
    call: ZERO,
  },
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

export default function Mint({ data }) {
  const classes = useStyles()
  const {
    state: { controller },
  } = useContext(context)
  const { handleClick } = useContext(proContext)
  const [state, setState] = useReducer((o, n) => ({ ...o, ...n }), INIT)
  const { pool } = data

  useEffect(() => {
    const bond = parse(state.I.bond, pool.bond.decimals)
    if (!bond.eq(state.input.bond)) {
      setState({ input: { bond }, output: { coll: bond, call: bond } })
    }
  }, [state.I])

  return (
    <div className={classes.root}>
      <div className={classes.main}>
        <div className={classes.input}>
          <AmountInput
            title="bond"
            State={{
              state,
              setState,
              token: pool.bond,
              max: data.bond_balance,
              if_max: data.bond_allowance.gt('100000000000000000000000000000000'),
            }}
          />
        </div>
        <div className={classes.button}>
          <MyButton
            name="Approve"
            onClick={() => handleClick('approve', pool.bond, pool)}
            disabled={!pool.ct.signer || data.bond_allowance.gt('100000000000000000000000000000000')}
          />
          <MyButton
            name="Mint"
            onClick={() => handleClick('mint', state.input.bond, pool)}
            disabled={ZERO.eq(state.output.coll) || parse(state.I.bond, pool.bond.decimals).gt(data.bond_balance)}
          />
        </div>
      </div>
      <span className={classes.icon_arrow}>navigate_next</span>
      <div className={classes.show}>
        <div style={{ marginBottom: '20px' }}>
          <AmountShow title="coll" state={{ state, token: pool.coll }} />
          <ContractLink token={pool.coll.symbol} contract={pool.coll.addr} />
        </div>
        <div>
          <AmountShow title="call" state={{ state, token: pool.call }} />
          <ContractLink token={pool.call.symbol} contract={pool.call.addr} />
        </div>
      </div>
    </div>
  )
}
