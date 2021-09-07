import { ethers } from 'ethers'
import { useContext, useReducer, useMemo, useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core'
import { MyButton } from '@/components/Modules'
import { context, proContext } from '@/config'
import { parse, format } from '@/utils/format'
import AmountInputMulti from './AmountInputMulti'
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
  const {
    state: { controller },
  } = useContext(context)
  const { handleClick } = useContext(proContext)
  const [state, setState] = useReducer((o, n) => ({ ...o, ...n }), INIT)
  const [tokenSelected, setTokenSelected] = useState(0)
  const { pool } = data

  useEffect(() => {
    const want = parse(state.I.want, pool.want.decimals)
    const coll = parse(state.I.coll)
    if (!coll.eq(state.input.coll)) {
      pool.ct
        .get_dy(coll)
        .then((want) => {
          setState({ input: { ...state.input, coll }, output: { ...state.output, want } })
        })
        .catch(() => {
          if (state.I.coll.length > state.old.coll.length && state.I.coll.length < format(state.input.coll).length) {
            controller.notify('balance', 'insufficient')
          }
        })
    } else if (!want.eq(state.input.want)) {
      pool.ct
        .get_dx(want)
        .then((coll) => {
          setState({ input: { ...state.input, want }, output: { ...state.output, coll } })
        })
        .catch(() => {
          if (state.I.want.length > state.old.want.length && state.I.want.length < format(state.input.want).length) {
            controller.notify('balance', 'insufficient')
          }
        })
    }
  }, [state.I])

  return (
    <div className={classes.root}>
      <div className={classes.main}>
        <div className={classes.input}>
          <AmountInputMulti
            title={['coll', 'want'][tokenSelected]}
            State={{
              state,
              setState,
              token: [pool.coll, pool.want][tokenSelected],
              max: [data.coll, data.want_balance][tokenSelected],
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
            disabled={
              !pool.ct.signer || data.want_allowance.gt('100000000000000000000000000000000') || tokenSelected === 0
            }
          />
          <MyButton
            name="Swap"
            onClick={() =>
              tokenSelected === 0
                ? handleClick('redeem', state.output.want, state.input.coll, pool)
                : handleClick('lend', state.input.want, state.output.coll, pool)
            }
            disabled={
              (tokenSelected === 0 && (ZERO.eq(state.output.want) || parse(state.I.coll).gt(data.coll))) ||
              (tokenSelected === 1 &&
                (ZERO.eq(state.output.coll) || parse(state.I.want, pool.want.decimals).gt(data.want_balance)))
            }
          />
        </div>
      </div>
      <span className={classes.icon_arrow}>navigate_next</span>
      <div className={classes.show}>
        <div>
          <AmountShow
            title={['want', 'coll'][tokenSelected]}
            state={{ state, token: [pool.want, pool.coll][tokenSelected] }}
          />
          <ContractLink token={pool.coll.symbol} contract={pool.coll.addr} />
          <ContractLink token={pool.call.symbol} contract={pool.call.addr} />
        </div>
      </div>
    </div>
  )
}
