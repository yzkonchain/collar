import { ethers } from 'ethers'
import { useContext, useReducer, useMemo, useEffect } from 'react'
import { context, liteContext, tokenList, poolList } from '@/config'
import { MyButton, AmountInput, AmountShow, ApyFloatMessage } from '@/components/Modules'
import { ArrowForwardIosIcon } from '@/assets/svg'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  root: {},
  amount: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '15px',
    '&>div': {
      width: '50%',
    },
    '&>img': {
      marginTop: '40px',
    },
  },
  icon: {
    margin: '0 10px',
  },
  button: {
    display: 'flex',
    flexDirection: 'column',
    '&>div': {
      display: 'flex',
      justifyContent: 'space-between',
      '&>button': {
        width: 'calc(50% - 15px)',
      },
    },
  },
}))
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

export default function Lend(props) {
  const classes = useStyles()
  const {
    state: { signer },
  } = useContext(context)
  const {
    liteState: { bond, want, pool, data, controller },
    setLiteState,
    handleClick,
  } = useContext(liteContext)

  const [state, setState] = useReducer((s, ns) => ({ ...s, ...ns }), INIT)
  useEffect(() => state == INIT || setState(INIT), [pool])
  useEffect(() => {
    if (!signer || ZERO.eq(data.swap.sk)) return
    ;(async () => {
      const want = ethers.utils.parseUnits(state.I.want || '0', 18)
      const coll = await controller.ct(pool, signer).get_dx(want)
      const fee = (format(coll) * (1 - format(data.swap.fee))).toFixed(4)
      const min = (format(coll) * 0.995).toFixed(3)
      const slip = (
        (parseFloat(
          format(
            data.swap.sx
              .add(data.swap.sk)
              .mul(ethers.utils.parseEther('1'))
              .div(
                data.swap.sy.add(want).add(data.swap.sk.mul(poolList[pool].swap_sqp).div(ethers.BigNumber.from(1e9))),
              )
              .sub(ethers.utils.parseEther('1')),
          ),
        ) *
          3155692600000) /
          (poolList[pool].expiry_time * 1000 - new Date()) -
        data.apy
      ).toPrecision(3)
      if (!want.eq(state.input.want)) {
        setState({ input: { want }, output: { coll }, tip: { fee, min, slip } })
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
          APY={data.apy ? data.apy.toPrecision(3) : '0.00'}
          info={[
            { 'Slippage tolerance': `${state.tip.slip} %` },
            { 'Minimum recieved': `${state.tip.min} COLL` },
            { Route: `${tokenList[want].symbol} -> COLL` },
            { 'Nominal swap fee': `${state.tip.fee} COLL` },
          ]}
        />
        <div className={classes.button}>
          <div>
            <MyButton name="Approve" onClick={async () => handleClick('approve')(want, pool)} />
            <MyButton
              name="Lend"
              onClick={async () => handleClick('lend')(state.input.want, state.output.coll, pool)}
            />
          </div>
        </div>
      </div>
    ),
    [state, pool, data],
  )
}