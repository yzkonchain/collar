import { ethers } from 'ethers'
import { useContext, useReducer, useMemo, useEffect } from 'react'
import { context, liteContext } from '@/config'
import { MyButton, AmountInput, AmountShow, ApyFloatMessage } from '@/components/Modules'

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
const format = (num, n) => ethers.utils.formatUnits(num, n || 18)
const parse = (num, n) => ethers.utils.parseUnits(num || '0', n || 18)

export default function Borrow() {
  const {
    state: { controller },
  } = useContext(context)
  const {
    liteState: { pool, bond, want, coll, data },
    classesChild: classes,
    handleClick,
  } = useContext(liteContext)
  INIT.tip.apy = data.apy.toPrecision(3)
  const [state, setState] = useReducer((o, n) => ({ ...o, ...n }), INIT)

  useEffect(() => state == INIT || setState(INIT), [pool])
  useEffect(() => {
    ;(async () => {
      const bond = parse(state.I.bond, pool.bond.decimals)
      if (!bond.eq(state.input.bond)) {
        const want = await pool.ct.get_dy(bond).catch((bond) => {
          if (state.I.bond.length > state.old.bond.length && state.I.bond.length < format(state.input.bond).length) {
            controller.notify('balance', 'insufficient')
          }
          return false
        })
        if (want) {
          const tip = {
            fee: (format(want, pool.want.decimals) * (1 - format(data.swap.fee))).toFixed(4),
            min: (format(want, pool.want.decimals) * 0.995).toFixed(3),
            slip: controller.calc_slip(data, [bond, null], pool).toPrecision(3),
            apy: data.apy.toPrecision(3),
          }
          setState({ input: { bond }, output: { want }, tip })
        }
      }
    })()
  }, [state.I])

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
                max: data.balance.bond,
                if_max: data.allowance.bond.gt('100000000000000000000000000000000'),
              }}
              style={{ height: '90px' }}
            />
          </div>
          <span className={classes.icon}>navigate_next</span>
          <div>
            <AmountShow title="want" state={{ state, token: want }} style={{ height: '90px' }} />
          </div>
        </div>
        <ApyFloatMessage
          apy={state.tip.apy}
          info={
            <div>
              <div>Slippage tolerance: {state.tip.slip} %</div>
              <div>
                Minimum recieved: {state.tip.min} {want.symbol}
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ marginRight: '5px' }}>Route:</span>
                <span>{bond.symbol}</span>
                <span className="material-icons">keyboard_double_arrow_right</span>
                <span>{coll.symbol}</span>
                <span className="material-icons">keyboard_double_arrow_right</span>
                <span>{want.symbol}</span>
              </div>
              <div>
                Nominal swap fee: {state.tip.fee} {want.symbol}
              </div>
            </div>
          }
        />
        <div className={classes.buttonOne}>
          <div>
            <MyButton
              name="Approve"
              onClick={() => handleClick('approve')(bond)}
              disabled={!pool.ct.signer || data.allowance.bond.gt('100000000000000000000000000000000')}
            />
            <MyButton
              name="Deposit & Borrow"
              onClick={async () =>
                (await handleClick('borrow')(state.input.bond, state.output.want)) && setState({ I: { bond: '' } })
              }
              disabled={
                ZERO.eq(state.output.want) ||
                parse(state.I.bond, pool.bond.decimals).gt(data.balance.bond) ||
                !parse(state.I.bond, pool.bond.decimals).eq(state.input.bond)
              }
            />
          </div>
        </div>
      </div>
    ),
    [state, data],
  )
}
