import { ethers } from 'ethers'
import { useContext, useReducer, useMemo, useEffect } from 'react'
import { makeStyles } from '@material-ui/core'
import { context, liteContext } from '@/config'
import { MyButton, AmountInput, AmountShow, ApyFloatMessage } from '@/components/Modules'

const ZERO = ethers.constants.Zero
const INIT = {
  input: {
    clpt: ZERO,
  },
  output: {
    want: ZERO,
    coll: ZERO,
  },
  tip: { share: '0.000', poolBalance: '0.00', fee: '0.0000', rate: { coll: 0, want: 0 } },
  I: { clpt: '' },
  old: { clpt: '' },
}
const format = (num, n) => ethers.utils.formatUnits(num, n || 18)
const parse = (num, n) => ethers.utils.parseUnits(num || '0', n || 18)

export default function Withdraw() {
  const {
    state: { signer, controller },
  } = useContext(context)
  const {
    liteState: { bond, want, coll, pool, data },
    classesChild: classes,
    handleClick,
  } = useContext(liteContext)
  const [state, setState] = useReducer((o, n) => ({ ...o, ...n }), INIT)

  useEffect(() => state == INIT || setState(INIT), [pool])
  useEffect(() => {
    ;(async () => {
      const clpt = parse(state.I.clpt)
      if (!clpt.eq(state.input.clpt)) {
        const res = await pool.ct.get_dxdy(clpt).catch((res) => {
          if (state.I.clpt.length > state.old.clpt.length && state.I.clpt.length < format(state.input.clpt).length) {
            controller.notify('balance', 'insufficient')
          }
          return false
        })
        if (res) {
          const tip = {
            poolBalance: (format(data.swap.sx) / format(data.swap.sy, pool.want.decimals)).toPrecision(3),
            share: ((format(data.balance.clpt) / format(data.swap.sk)) * 100).toPrecision(3),
            rate: {
              coll: clpt.eq(ZERO) ? 0 : parseFloat(format(res[0]) / state.I.clpt).toPrecision(3),
              want: clpt.eq(ZERO) ? 0 : parseFloat(format(res[1], pool.want.decimals) / state.I.clpt).toPrecision(3),
            },
            fee: (format(res[0]) * (1 - format(data.swap.fee))).toFixed(4),
          }
          setState({ input: { clpt }, output: { coll: res[0], want: res[1] }, tip })
        }
      }
    })()
  }, [state])

  return useMemo(
    () => (
      <div className={classes.root}>
        <div className={classes.amount}>
          <div>
            <AmountInput
              title="clpt"
              State={{
                state,
                setState,
                token: pool,
                max: data.balance.clpt,
                if_max: data.balance.clpt.gt('0'),
              }}
              style={{ height: '239px' }}
            />
          </div>
          <span className={classes.icon}>navigate_next</span>
          <div>
            <AmountShow title="want" state={{ state, token: want }} style={{ height: '90px' }} />
            <AmountShow title="coll" state={{ state, token: coll }} style={{ height: '90px' }} />
          </div>
        </div>
        <ApyFloatMessage
          apy={data.farm_apy.toFixed(1)}
          info={
            <div>
              <div>Exchange Rate: {`1CLPT = ${state.tip.rate.want} ${want.symbol} + ${state.tip.rate.coll} COLL`}</div>
              <div>Share of Pool: {state.tip.share} %</div>
              <div>Pool Balance: {`1 ${want.symbol} = ${state.tip.poolBalance} COLL`}</div>
              <div>Nominal swap fee: {state.tip.fee} COLL</div>
            </div>
          }
        />
        <div className={classes.buttonTwo}>
          <div>
            <MyButton
              name="Withdraw"
              onClick={async () => (await handleClick('withdraw')(state.input.clpt)) && setState({ I: { clpt: '' } })}
              disabled={
                ZERO.eq(state.output.want) ||
                parse(state.I.clpt).gt(data.balance.clpt) ||
                !parse(state.I.clpt).eq(state.input.clpt)
              }
            />
            <MyButton name="Claim" onClick={() => handleClick('claim')()} disabled={ZERO.eq(data.earned.collar)} />
          </div>
          <div>
            <MyButton
              name="Withdraw & Claim"
              onClick={async () =>
                (await handleClick('burn_and_claim')(state.input.clpt)) && setState({ I: { clpt: '' } })
              }
              disabled={
                ZERO.eq(state.output.want) ||
                ZERO.eq(data.earned.collar) ||
                parse(state.I.clpt).gt(data.balance.clpt) ||
                !parse(state.I.clpt).eq(state.input.clpt)
              }
            />
          </div>
        </div>
      </div>
    ),
    [state, data],
  )
}
