import { ethers } from 'ethers'
import { useContext, useReducer, useMemo, useEffect } from 'react'
import { context, liteContext, tokenList, poolList } from '@/config'
import { MyButton, AmountInput, AmountShow, ApyFloatMessage } from '@/components/Modules'
import { makeStyles } from '@material-ui/core/styles'
import { ArrowForwardIosIcon } from '@/assets/svg'

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
const format = (num) => ethers.utils.formatEther(num)

export default function Withdraw() {
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
      const clpt = ethers.utils.parseUnits(state.I.clpt || '0', 18)
      const res = await controller.ct(pool).get_dxdy(clpt)
      const tip = {
        poolBalance: (format(data.swap.sx) / format(data.swap.sy)).toPrecision(3),
        share: ((format(data.balance.clpt) / format(data.swap.sk)) * 100).toPrecision(3),
        rate: {
          coll: clpt.eq(ZERO) ? 0 : parseFloat(format(res[0]) / state.I.clpt).toPrecision(3),
          want: clpt.eq(ZERO) ? 0 : parseFloat(format(res[1]) / state.I.clpt).toPrecision(3),
        },
        fee: (format(res[0]) * (1 - format(data.swap.fee))).toFixed(4),
      }
      if (!clpt.eq(state.input.clpt)) {
        setState({ input: { clpt }, output: { coll: res[0], want: res[1] }, tip })
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
                max: parseFloat(format(data.balance.clpt)),
                maxCondition: () => data.balance.clpt.gt('0'),
              }}
              style={{ height: '249px' }}
            />
          </div>
          <img alt="" src={ArrowForwardIosIcon} className={classes.icon} />
          <div>
            <AmountShow title="want" state={{ state, token: want }} style={{ height: '90px' }} />
            <AmountShow title="coll" state={{ state, token: poolList[pool].coll.addr }} style={{ height: '90px' }} />
          </div>
        </div>
        <ApyFloatMessage
          APY={`todo`}
          info={[
            {
              'Exchange Rate': `1CLPT = ${state.tip.rate.want} ${tokenList[want].symbol} + ${state.tip.rate.coll} COLL`,
            },
            { 'Share of Pool': `${state.tip.share} %` },
            { 'Pool Balance': `1 ${tokenList[want].symbol} = ${state.tip.poolBalance} COLL` },
            { 'Nominal swap fee': `${state.tip.fee} COLL` },
          ]}
        />
        <div className={classes.buttonTwo}>
          <div>
            <MyButton name="Withdraw" onClick={() => handleClick('withdraw')(state.input.clpt, pool)} />
            <MyButton name="Claim" onClick={() => handleClick('claim')(pool)} />
          </div>
          <div>
            <MyButton name="Withdraw & Claim" onClick={() => handleClick('burn_and_claim')(state.input.clpt, pool)} />
          </div>
        </div>
      </div>
    ),
    [state, pool, data],
  )
}
