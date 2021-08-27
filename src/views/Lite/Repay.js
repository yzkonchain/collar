import { ethers } from 'ethers'
import { useContext, useReducer, useMemo, useEffect } from 'react'
import { context, liteContext } from '@/config'
import { MyButton, AmountInputDouble, AmountShow, ApyFloatMessage } from '@/components/Modules'

const ZERO = ethers.constants.Zero
const INIT = {
  input: {
    want: ZERO,
    coll: ZERO,
  },
  output: {
    bond: ZERO,
  },
  tip: { fee: '0.0000', min: '0.000', slip: '0.00' },
  I: { want: '', coll: '' },
  old: { want: '', coll: '' },
}
const format = (num, n) => ethers.utils.formatUnits(num, n || 18)
const parse = (num, n) => ethers.utils.parseUnits(num || '0', n || 18)

export default function Repay() {
  const {
    state: { signer, controller },
  } = useContext(context)
  const {
    liteState: { bond, want, coll, pool, data },
    classesChild: classes,
    handleClick,
  } = useContext(liteContext)
  INIT.tip.apy = data.apy.toPrecision(3)
  const [state, setState] = useReducer((o, n) => ({ ...o, ...n }), INIT)

  useEffect(() => state == INIT || setState(INIT), [pool])
  useEffect(() => {
    ;(async () => {
      const want = parse(state.I.want, pool.want.decimals)
      const coll = parse(state.I.coll)
      if (!want.eq(state.input.want) || !coll.eq(state.input.coll)) {
        const bond = want.add(coll)
        const tip = {
          fee: (format(want, pool.want.decimals) * (1 - format(data.swap.fee))).toFixed(4),
          min: (format(bond, pool.bond.decimals) * 0.995).toFixed(3),
          slip: controller.calc_slip(data, [bond, null], pool).toPrecision(3),
          apy: data.apy.toPrecision(3),
        }
        setState({ input: { want, coll }, output: { bond }, tip })
      }
    })()
  }, [state])

  return useMemo(
    () => (
      <div className={classes.root}>
        <div className={classes.amount}>
          <div>
            <AmountInputDouble
              title={['want', 'coll']}
              State={{
                state,
                setState,
                token: [want, coll],
                max: [
                  data.balance.want.lt(data.balance.call.sub(state.input.coll))
                    ? data.balance.want
                    : data.balance.call.sub(state.input.coll),
                  data.balance.coll.lt(data.balance.call.sub(state.input.want))
                    ? data.balance.coll
                    : data.balance.call.sub(state.input.want),
                ],
                if_max: [
                  data.allowance.want.gt('100000000000000000000000000000000') &&
                    state.output.bond.lt(data.balance.call),
                  data.balance.coll.gt('0') && state.output.bond.lt(data.balance.call),
                ],
              }}
              style={{ height: '90px' }}
            />
          </div>
          <span className={classes.icon}>navigate_next</span>
          <div>
            <AmountShow title="bond" state={{ state, token: bond }} style={{ height: '90px' }} />
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ margin: '10px 0', fontFamily: 'Helvetica', fontSize: '12px' }}>
            Maximum debt = {format(data.balance.call)} {pool.call.symbol}
          </div>
          <ApyFloatMessage
            apy={state.tip.apy}
            info={
              <div>
                <div>Slippage tolerance: {state.tip.slip} %</div>
                <div>
                  Minimum recieved: {state.tip.min} {bond.symbol}
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ marginRight: '5px' }}>Route:</span>
                  <span>{coll.symbol}</span>
                  <span className="material-icons">keyboard_double_arrow_right</span>
                  <span>{bond.symbol}</span>
                  <span style={{ margin: '0 5px' }}>/</span>
                  <span>{want.symbol}</span>
                  <span className="material-icons">keyboard_double_arrow_right</span>
                  <span>{bond.symbol}</span>
                </div>
                <div>
                  Nominal swap fee: {state.tip.fee} {want.symbol}
                </div>
              </div>
            }
          />
        </div>
        <div className={classes.buttonOne}>
          <div>
            <MyButton
              name="Approve"
              onClick={() => handleClick('approve')(want)}
              disabled={!signer || data.allowance.want.gt('100000000000000000000000000000000')}
            />
            <MyButton
              name="Repay"
              onClick={async () =>
                (await handleClick('repay')(state.input.want, state.input.coll)) &&
                setState({ I: { want: '', coll: '' } })
              }
              disabled={
                ZERO.eq(state.output.bond) ||
                state.output.bond.gt(data.balance.call) ||
                parse(state.I.want, pool.want.decimals).gt(data.balance.want) ||
                parse(state.I.coll).gt(data.balance.coll)
              }
            />
          </div>
        </div>
      </div>
    ),
    [state, data],
  )
}
