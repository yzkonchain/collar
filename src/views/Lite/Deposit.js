import { ethers } from 'ethers'
import { useContext, useReducer, useMemo, useEffect } from 'react'
import { context, liteContext } from '@/config'
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
  tip: { share: 0, poolBalance: 0, slip: 0 },
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
    setLiteState,
    handleClick,
  } = useContext(liteContext)
  const [state, setState] = useReducer((o, n) => ({ ...o, ...n }), INIT)

  useEffect(() => state == INIT || setState(INIT), [pool])
  useEffect(() => {
    if (!signer || ZERO.eq(data.swap.sk)) return
    ;(async () => {
      const want = parse(state.I.want, pool.want.decimals)
      const coll = parse(state.I.coll)
      if (!want.eq(state.input.want) || !coll.eq(state.input.coll)) {
        const clpt = await controller.get_dk(coll, want, pool)
        if (clpt) {
          const tip = {
            share: ((format(clpt) / format(data.swap.sk)) * 100).toPrecision(3),
            poolBalance: (format(data.swap.sx) / format(data.swap.sy, pool.want.decimals)).toPrecision(3),
            slip: controller.calc_slip(data, [coll, want], pool).toPrecision(3),
          }
          setState({ input: { want, coll }, output: { clpt }, tip })
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
              title="want"
              State={{
                state,
                setState,
                token: want,
                max: data.balance.want,
                if_max: data.allowance.want.gt('100000000000000000000000000000000'),
              }}
              style={{ height: '90px' }}
            />
            <AmountInput
              title="coll"
              State={{
                state,
                setState,
                token: coll,
                max: data.balance.coll,
                if_max: data.balance.coll.gt('0'),
              }}
              style={{ height: '90px' }}
            />
          </div>
          <img alt="" src={ArrowForwardIosIcon} className={classes.icon} />

          <div>
            <AmountShow title="clpt" state={{ state, token: pool }} style={{ height: '239px' }} />
          </div>
        </div>
        <ApyFloatMessage
          APY={`todo`}
          info={[
            { 'Share of Pool': `${state.tip.share} %` },
            { 'Pool Balance': `1 ${want.symbol} = ${state.tip.poolBalance} COLL` },
            { 'Slippage tolerance': `${state.tip.slip} %` },
          ]}
        />
        <div className={classes.buttonTwo}>
          <div>
            <MyButton
              name="Approve"
              onClick={() => handleClick('approve')(want.addr)}
              disabled={!signer || data.allowance.want.gt('100000000000000000000000000000000')}
            />
            <MyButton
              name="Deposit"
              onClick={async () =>
                (await handleClick('deposit')(state.input.want, state.input.coll, state.output.clpt)) &&
                setState({ I: { want: '', coll: '' } })
              }
              disabled={ZERO.eq(state.output.clpt)}
            />
          </div>
          <div>
            <MyButton name="Claim" onClick={() => handleClick('claim')()} disabled={ZERO.eq(data.earned.collar)} />
          </div>
        </div>
      </div>
    ),
    [state, data],
  )
}
