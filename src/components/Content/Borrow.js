import { ethers } from 'ethers'
import { useContext, useReducer, useMemo, useEffect } from 'react'
import { context, liteContext, tokenList, poolList } from '@/config'
import { MyButton, AmountInput, AmountShow, ApyFloatMessage } from '@/components/Modules'
import { ArrowForwardIosIcon } from '@/assets/svg'

const ZERO = ethers.constants.Zero
const INIT = {
  input: {
    bond: ZERO,
  },
  output: {
    want: ZERO,
  },
  tip: { fee: '0.0000', min: '0.000', slip: '0.00' },
  I: { bond: '' },
  old: { bond: '' },
}
const format = (num) => ethers.utils.formatEther(num)

export default function Borrow() {
  const {
    state: { signer },
  } = useContext(context)
  const {
    liteState: { pool, bond, want, data, controller },
    classesChild: classes,
    setLiteState,
    handleClick,
  } = useContext(liteContext)
  const [state, setState] = useReducer((s, ns) => ({ ...s, ...ns }), INIT)

  useEffect(() => state == INIT || setState(INIT), [pool])
  useEffect(() => {
    if (!signer || ZERO.eq(data.swap.sk)) return
    ;(async () => {
      const bond = ethers.utils.parseUnits(state.I.bond || '0', 18)
      const want = await controller.ct(pool).get_dy(bond)
      const fee = (format(want) * (1 - format(data.swap.fee))).toFixed(4)
      const min = (format(want) * 0.995).toFixed(3)
      const slip = (controller.calc_apy(data, [bond, null], pool) - data.apy).toPrecision(3)
      if (!bond.eq(state.input.bond)) {
        setState({ input: { bond }, output: { want }, tip: { fee, min, slip } })
      }
    })()
  }, [state])

  return useMemo(
    () => (
      <div className={classes.root}>
        <div className={classes.amount}>
          <div>
            <AmountInput
              title="bond"
              State={{
                state,
                setState,
                token: bond,
                max: parseFloat(format(data.balance.bond)),
                maxCondition: () => data.allowance.bond.gt('100000000000000000000000000000000'),
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
            { 'Minimum recieved': `${state.tip.min}` },
            { Route: `${tokenList[bond].symbol} -> COLL -> ${tokenList[want].symbol}` },
            { 'Nominal swap fee': `${state.tip.fee} ${tokenList[want].symbol}` },
          ]}
        />
        <div className={classes.buttonOne}>
          <div>
            <MyButton name="Approve" onClick={() => handleClick('approve')(bond, pool)} />
            <MyButton
              name="Deposit & Borrow"
              onClick={() => handleClick('borrow')(state.input.bond, state.output.want, pool)}
            />
          </div>
        </div>
      </div>
    ),
    [state, pool, data],
  )
}
