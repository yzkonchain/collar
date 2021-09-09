import { ethers } from 'ethers'
import { useContext, useReducer, useMemo, useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core'
import { MyButton } from '@/components/Modules'
import { context, proContext } from '@/config'
import { parse, format } from '@/utils/format'
import AmountInputMulti from './AmountInputMulti'
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
  const [tokenSelected, setTokenSelected] = useState(0)
  const { pool } = data

  useEffect(() => {
    const call = parse(state.I.call)
    const coll = parse(state.I.coll)
    const want = parse(state.I.want, pool.want.decimals)
    if (!call.eq(state.input.call)) {
      setState({
        I: { call: state.I.call, coll: state.I.call, want: state.I.call },
        input: { call, coll: call, want: call },
        output: { bond: call },
      })
    } else if (!coll.eq(state.input.coll)) {
      setState({
        I: { call: state.I.coll, coll: state.I.coll, want: state.I.coll },
        input: { call: coll, coll, want: coll },
        output: { bond: coll },
      })
    } else if (!want.eq(state.input.want)) {
      setState({
        I: { call: state.I.want, coll: state.I.want, want: state.I.want },
        input: { call: want, coll: want, want },
        output: { bond: want },
      })
    }
  }, [state.I])

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
              max:
                tokenSelected === 0
                  ? data.coll.lt(data.call)
                    ? data.coll
                    : data.call
                  : data.want_balance.lt(data.call)
                  ? data.want_balance
                  : data.call,
              if_max: data.call.gt('0'),
            }}
          />
          <AmountInputMulti
            title={['coll', 'want'][tokenSelected]}
            State={{
              state,
              setState,
              token: [pool.coll, pool.want][tokenSelected],
              max: [
                data.coll.lt(data.call) ? data.coll : data.call,
                data.want_balance.lt(data.call) ? data.want_balance : data.call,
              ][tokenSelected],
              if_max: [data.coll.gt('0'), data.want_balance.gt('0')][tokenSelected],
            }}
            setTokenSelected={() => {
              setTokenSelected(tokenSelected > 0 ? 0 : 1)
              setState(INIT)
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
            name="Burn"
            onClick={() => handleClick('repay', state.input.want, state.input.coll, pool)}
            disabled={
              ZERO.eq(state.output.bond) ||
              parse(state.I.call).gt(data.call) ||
              (tokenSelected === 0 && parse(state.I.coll).gt(data.coll)) ||
              (tokenSelected === 1 && parse(state.I.want, pool.want.decimals).gt(data.want_balance))
            }
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
