import { ethers } from 'ethers'
import { useContext, useReducer, useMemo, useEffect } from 'react'
import { context, liteContext, tokenList, poolList } from '@/config'
import { MyButton, AmountInput, AmountShow, ApyFloatMessage } from '@/components/Modules'
import { ArrowForwardIosIcon } from '@/assets/svg'

const ZERO = ethers.constants.Zero
const INIT = {
  input: {
    coll: ZERO,
  },
  output: {
    want: ZERO,
  },
  tip: { fee: '0.0000', min: '0.000', slip: '0.00' },
  I: { coll: '' },
  old: { coll: '' },
}
const format = (num) => ethers.utils.formatEther(num)

export default function Exit(props) {
  const {
    state: { signer },
  } = useContext(context)
  const {
    liteState: { bond, want, pool, data, controller },
    classesChild: classes,
    setLiteState,
    handleClick,
  } = useContext(liteContext)
  const [state, setState] = useReducer((s, ns) => ({ ...s, ...ns }), INIT)

  useEffect(() => state == INIT || setState(INIT), [pool])
  useEffect(() => {
    if (!signer || ZERO.eq(data.swap.sk)) return
    ;(async () => {
      const coll = ethers.utils.parseUnits(state.I.coll || '0', 18)
      const want = await controller.ct(pool).get_dy(coll)
      const fee = (format(want) * (1 - format(data.swap.fee))).toFixed(4)
      const min = (format(want) * 0.995).toFixed(3)
      const slip = (controller.calc_apy(data, [null, want], pool) - data.apy).toPrecision(3)
      if (!coll.eq(state.input.coll)) {
        setState({ input: { coll }, output: { want }, tip: { fee, min, slip } })
      }
    })()
  }, [state])

  return useMemo(
    () => (
      <div className={classes.root}>
        <div className={classes.amount}>
          <div>
            <AmountInput
              title="coll"
              State={{
                state,
                setState,
                token: poolList[pool].coll.addr,
                max: parseFloat(format(data.balance.coll)),
                maxCondition: () => data.balance.coll.gt('0'),
              }}
              style={{ height: '90px' }}
            />
          </div>
          <img alt="" src={ArrowForwardIosIcon} className={classes.icon} />
          <div>
            <AmountShow title="want" state={{ state, token: want }} style={{ height: '90px' }} />
          </div>
        </div>
        <ApyFloatMessage
          APY={data.apy ? data.apy.toPrecision(3) : '0.00'}
          info={[
            { 'Slippage tolerance': `${state.tip.slip} %` },
            { 'Minimum recieved': `${state.tip.min} ${tokenList[want].symbol}` },
            { Route: `COLL -> ${tokenList[want].symbol}` },
            { 'Nominal swap fee': `${state.tip.fee} ${tokenList[want].symbol} ` },
          ]}
        />
        <div className={classes.buttonOne}>
          <div>
            <MyButton name="Approve" onClick={() => console.log('Approve')} />
            <MyButton
              name="Exit"
              onClick={async () => handleClick('redeem')(state.output.want, state.input.coll, pool)}
            />
          </div>
        </div>
      </div>
    ),
    [state, pool, data],
  )
}
