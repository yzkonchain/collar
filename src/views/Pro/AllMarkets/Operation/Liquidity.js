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
    want: ZERO,
    coll: ZERO,
  },
  output: {
    clpt: ZERO,
  },
  I: { want: '', coll: '' },
  old: { want: '', coll: '' },
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

export default function Liquidity({ data }) {
  const classes = useStyles()
  const {
    state: { controller },
  } = useContext(context)
  const { handleClick } = useContext(proContext)
  const [state, setState] = useReducer((o, n) => ({ ...o, ...n }), INIT)
  const { pool } = data

  useEffect(() => {
    const want = parse(state.I.want, pool.want.decimals)
    const coll = parse(state.I.coll)
    if (!want.eq(state.input.want) || !coll.eq(state.input.coll)) {
      pool.ct
        .get_dk(coll, want)
        .then((clpt) => {
          setState({ input: { want, coll }, output: { clpt } })
        })
        .catch(() => {
          if (
            (state.I.want.length > state.old.want.length && state.I.want.length < format(state.input.want).length) ||
            (state.I.coll.length > state.old.coll.length && state.I.coll.length < format(state.input.coll).length)
          ) {
            controller.notify('balance', 'insufficient')
          }
        })
    }
  }, [state.I])

  return (
    <div className={classes.root}>
      <div className={classes.main}>
        <div className={classes.input}>
          <AmountInput
            title="want"
            State={{
              state,
              setState,
              token: pool.want,
              max: data.want_balance,
              if_max: data.want_allowance.gt('100000000000000000000000000000000'),
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
            disabled={!pool.ct.signer || data.want_allowance.gt('100000000000000000000000000000000')}
          />
          <MyButton
            name="Deposit"
            onClick={() => handleClick('deposit', state.input.want, state.input.coll, state.output.clpt, pool)}
            disabled={
              ZERO.eq(state.output.clpt) ||
              parse(state.I.want, pool.want.decimals).gt(data.want_balance) ||
              parse(state.I.coll).gt(data.coll) ||
              !parse(state.I.want, pool.want.decimals).eq(state.input.want) ||
              !parse(state.I.coll).eq(state.input.coll)
            }
          />
        </div>
      </div>
      <span className={classes.icon_arrow}>navigate_next</span>
      <div className={classes.show}>
        <div>
          <AmountShow title="clpt" state={{ state, token: pool }} fixed={3} />
          <ContractLink token={pool.coll.symbol} contract={pool.coll.addr} />
          <ContractLink token={pool.call.symbol} contract={pool.call.addr} />
          <ContractLink token={pool.symbol} contract={pool.addr} />
        </div>
      </div>
    </div>
  )
}
