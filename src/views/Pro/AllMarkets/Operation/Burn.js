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
    coll: ZERO,
    call: ZERO,
    want: ZERO,
  },
  output: {
    bond: ZERO,
  },
  I: { coll: '', call: '', want: '' },
  old: { coll: '', call: '', want: '' },
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

export default function Burn({ data }) {
  const classes = useStyles()
  const {
    state: { controller },
  } = useContext(context)
  const { handleClick } = useContext(proContext)
  const [state, setState] = useReducer((o, n) => ({ ...o, ...n }), INIT)
  const { pool } = data

  // useEffect(() => {
  //   const coll = parse(state.I.coll)
  //   const call = parse(state.I.call)
  //   if (!bond.eq(state.input.bond)) {
  //     setState({ input: { bond }, output: { coll: bond, call: bond } })
  //   }
  // }, [state.I])

  return (
    <div className={classes.root}>
      <div className={classes.main}>
        <div className={classes.input}>
          <AmountInput
            title="call"
            State={{
              state,
              setState,
              token: pool.call,
              max: data.call,
              if_max: data.call.gt('0'),
            }}
          />
          <AmountInput
            title="coll"
            State={{
              state,
              setState,
              token: pool.coll,
              max: data.coll,
              if_max: data.coll.gt('0'),
            }}
          />
        </div>
        <div className={classes.button}>
          <MyButton
            name="Approve"
            onClick={() => handleClick('approve', pool.want, pool)}
            disabled={true}
            // disabled={!pool.ct.signer || data.want_allowance.gt('100000000000000000000000000000000')}
          />
          <MyButton
            name="Burn"
            onClick={() => handleClick('approve', pool.want, pool)}
            disabled={true}
            // disabled={
            //   ZERO.eq(state.output.bond)
            //   // parse(state.I.bond, pool.bond.decimals).gt(data.bond_balance) ||
            //   // !parse(state.I.bond, pool.bond.decimals).eq(state.input.bond)
            // }
          />
        </div>
      </div>
      <span className={classes.icon_arrow}>navigate_next</span>
      <div className={classes.show}>
        <div>
          <AmountShow title="bond" state={{ state, token: pool.bond }} />
          <ContractLink token={pool.coll.symbol} contract={pool.coll.addr} />
          <ContractLink token={pool.call.symbol} contract={pool.call.addr} />
        </div>
      </div>
    </div>
  )
}
