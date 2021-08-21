import { ethers } from 'ethers'
import { useContext, useReducer, useMemo, useEffect } from 'react'
import { context, liteContext, tokenList, poolList } from '@/config'
import { MyButton, AmountInput, AmountShow, ApyFloatMessage } from '@/components/Modules'
import { ArrowForwardIosIcon } from '@/assets/svg'

const ZERO = ethers.constants.Zero
const INIT = {
  input: {
    want: ZERO,
    coll: ZERO,
  },
  output: {
    clpt: ZERO,
  },
  tip: { share: '0.000', poolBalance: '0.00', slip: '0.00' },
  I: { want: '', coll: '' },
  old: { want: '', coll: '' },
}
const format = (num) => ethers.utils.formatEther(num)

export default function Repay(props) {
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
      const want = ethers.utils.parseUnits(state.I.want || '0', 18)
      const coll = ethers.utils.parseUnits(state.I.coll || '0', 18)
      const clpt = await controller.ct(pool).get_dk(coll, want)
      const poolBalance = (format(data.swap.sx) / format(data.swap.sy)).toPrecision(3)
      const share = ((format(data.balance.clpt) / format(data.swap.sk)) * 100).toPrecision(3)
      const slip = (controller.calc_apy(data, [coll, want], pool) - data.apy).toPrecision(3)
      if (!want.eq(state.input.want) || !coll.eq(state.input.coll)) {
        setState({ input: { want, coll }, output: { clpt }, tip: { share, slip, poolBalance } })
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
            <AmountShow title="clpt" state={{ state, token: pool }} style={{ height: '249px' }} />
          </div>
        </div>
        <ApyFloatMessage
          APY={`todo`}
          info={[
            { 'Share of Pool': `${state.tip.share} %` },
            { 'Pool Balance': `1 ${tokenList[want].symbol} = ${state.tip.poolBalance} COLL` },
            { 'Slippage tolerance': `${state.tip.slip} %` },
          ]}
        />
        <div className={classes.buttonTwo}>
          <div>
            <MyButton name="Approve" onClick={async () => handleClick('approve')(want, pool)} />
            <MyButton
              name="Deposit"
              onClick={async () => handleClick('deposit')(state.input.want, state.input.coll, state.output.clpt, pool)}
            />
          </div>
          <div>
            <MyButton name="Claim" onClick={async () => handleClick('claim')(pool)} />
          </div>
        </div>
      </div>
    ),
    [state, pool, data],
  )
}
