import { ethers } from 'ethers'
import { useContext, useReducer, useMemo, useEffect } from 'react'
import { context, liteContext, tokenList, poolList } from '@/config'
import { MyButton, AmountInput, AmountShow, ApyFloatMessage } from '@/components/Modules'
import { ArrowForwardIosIcon } from '@/assets/svg'

const ZERO = ethers.constants.Zero
const INIT = {
  input: {
    want: ZERO,
  },
  output: {
    coll: ZERO,
  },
  tip: { fee: '0.0000', min: '0.000', slip: '0.00' },
  I: { want: '' },
  old: { want: '' },
}
const format = (num) => ethers.utils.formatEther(num)

export default function Lend() {
  const {
    state: { signer },
  } = useContext(context)
  const {
    liteState: { bond, want, pool, data, controller },
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
      const coll = await controller.ct(pool).get_dx(want)
      const tip = {
        fee: (format(coll) * (1 - format(data.swap.fee))).toFixed(4),
        min: (format(coll) * 0.995).toFixed(3),
        slip: controller.calc_slip(data, [null, want], pool).toPrecision(3),
        apy: data.apy.toPrecision(3),
      }
      if (!want.eq(state.input.want)) {
        setState({ input: { want }, output: { coll }, tip })
      }
    })()
  }, [state])

  return useMemo(
    () => (
      <div className={classes.root}>
        <div className={classes.amount}>
          <div>
            <AmountInput
              title="want"
              State={{
                state,
                setState,
                token: want,
                max: parseFloat(format(data.balance.want)),
                maxCondition: () => data.allowance.want.gt('100000000000000000000000000000000'),
              }}
              style={{ height: '90px' }}
            />
          </div>
          <img alt="" src={ArrowForwardIosIcon} className={classes.icon} />
          <div>
            <AmountShow title="coll" state={{ state, token: poolList[pool].coll.addr }} style={{ height: '90px' }} />
          </div>
        </div>
        <ApyFloatMessage
          APY={state.tip.apy}
          info={[
            { 'Slippage tolerance': `${state.tip.slip} %` },
            { 'Minimum recieved': `${state.tip.min} COLL` },
            { Route: `${tokenList[want].symbol} -> COLL` },
            { 'Nominal swap fee': `${parseFloat(state.tip.fee).toPrecision(3)} COLL` },
          ]}
        />
        <div className={classes.buttonOne}>
          <div>
            <MyButton name="Approve" onClick={() => handleClick('approve')(want, pool)} />
            <MyButton name="Lend" onClick={() => handleClick('lend')(state.input.want, state.output.coll, pool)} />
          </div>
        </div>
      </div>
    ),
    [state, pool, data],
  )
}
