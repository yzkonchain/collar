import { ethers } from 'ethers'
import { useContext, useReducer, useMemo, useEffect } from 'react'
import { context, liteContext } from '@/config'
import { MyButton, AmountInputDouble, AmountShow, ApyFloatMessage } from '@/components/Modules'
import { ArrowForwardIosIcon } from '@/assets/svg'

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
const format = (num) => ethers.utils.formatEther(num)

export default function Repay() {
  const {
    state: { signer },
  } = useContext(context)
  const {
    liteState: { bond, want, coll, pool, data, controller },
    classesChild: classes,
    setLiteState,
    handleClick,
  } = useContext(liteContext)
  INIT.tip.apy = data.apy.toPrecision(3)
  const [state, setState] = useReducer((s, ns) => ({ ...s, ...ns }), INIT)

  useEffect(() => state == INIT || setState(INIT), [pool])
  useEffect(() => {
    if (!signer || ZERO.eq(data.swap.sk)) return
    ;(async () => {
      const want = ethers.utils.parseUnits(state.I.want || '0', 18)
      const coll = ethers.utils.parseUnits(state.I.coll || '0', 18)
      if (!want.eq(state.input.want) || !coll.eq(state.input.coll)) {
        const bond = want.add(coll)
        const tip = {
          fee: (format(want) * (1 - format(data.swap.fee))).toFixed(4),
          min: (format(bond) * 0.995).toFixed(3),
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
                  data.balance.call.lt(data.balance.want) ? data.balance.call : data.balance.want,
                  data.balance.call.lt(data.balance.coll) ? data.balance.call : data.balance.coll,
                ],
                maxCondition: [
                  () => data.allowance.want.gt('100000000000000000000000000000000'),
                  () => data.balance.coll.gt('0'),
                ],
              }}
              style={{ height: '90px' }}
            />
          </div>
          <img alt="" src={ArrowForwardIosIcon} className={classes.icon} />
          <div>
            <AmountShow title="bond" state={{ state, token: bond }} style={{ height: '90px' }} />
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ margin: '-8px 0 8px 0', fontFamily: 'Helvetica', fontSize: '0.8em' }}>
            Maximum debt = {format(data.balance.call)}
          </div>
          <ApyFloatMessage
            APY={state.tip.apy}
            info={[
              { 'Slippage tolerance': `${state.tip.slip} %` },
              { 'Minimum recieved': `${state.tip.min} ${bond.symbol}` },
              { Route: `COLL-> ${bond.symbol} / ${want.symbol}->${bond.symbol}` },
              { 'Nominal swap fee': `${state.tip.fee} ${want.symbol} ` },
            ]}
          />
        </div>
        <div className={classes.buttonOne}>
          <div>
            <MyButton
              name="Approve"
              onClick={() => handleClick('approve')(want.addr)}
              disabled={!signer || data.allowance.want.gt('100000000000000000000000000000000')}
            />
            <MyButton
              name="Repay"
              onClick={async () =>
                (await handleClick('repay')(state.input.want, state.input.coll)) &&
                setState({ I: { want: '', coll: '' } })
              }
              disabled={ZERO.eq(state.output.bond)}
            />
          </div>
        </div>
      </div>
    ),
    [state, data],
  )
}