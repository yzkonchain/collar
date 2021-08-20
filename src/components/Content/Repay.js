import { ethers } from 'ethers'
import { useContext, useReducer, useMemo, useEffect } from 'react'
import { context, liteContext, tokenList, poolList } from '@/config'
import { MyButton, AmountInputDouble, AmountShow, ApyFloatMessage } from '@/components/Modules'
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

export default function Repay(props) {
  const classes = useStyles()
  const {
    state: { signer },
  } = useContext(context)
  const {
    liteState: { bond, want, pool, data },
    setLiteState,
    handleClick,
  } = useContext(liteContext)

  const [state, setState] = useReducer((s, ns) => ({ ...s, ...ns }), INIT)

  useEffect(() => {
    if (!signer || ZERO.eq(data.swap.sk)) return
    ;(async () => {
      const want = ethers.utils.parseUnits(state.I.want || '0', 18)
      const coll = ethers.utils.parseUnits(state.I.coll || '0', 18)
      const bond = want.add(coll)
      const fee = (format(want) * (1 - format(data.swap.fee))).toFixed(4)
      const min = (format(bond) * 0.995).toFixed(3)
      const slip = (
        (parseFloat(
          format(
            data.swap.sx
              .add(bond)
              .add(data.swap.sk)
              .mul(ethers.utils.parseEther('1'))
              .div(data.swap.sy.add(data.swap.sk.mul(poolList[pool].swap_sqp).div(ethers.BigNumber.from(1e9))))
              .sub(ethers.utils.parseEther('1')),
          ),
        ) *
          3155692600000) /
          (poolList[pool].expiry_time * 1000 - new Date()) -
        data.apy
      ).toPrecision(3)
      if (want.eq(state.input.want) === false || coll.eq(state.input.coll) === false) {
        setState({ input: { want, coll }, output: { bond }, tip: { fee, min, slip } })
      }
    })()
  }, [state])

  useEffect(() => state == INIT || setState(INIT), [pool])

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
                token: [want, poolList[pool].coll.addr],
                max: [
                  Math.min(parseFloat(format(data.balance.call)), parseFloat(format(data.balance.want))),
                  Math.min(parseFloat(format(data.balance.call)), parseFloat(format(data.balance.coll))),
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
            APY={data.apy ? data.apy.toPrecision(3) : '0.00'}
            info={[
              { 'Slippage tolerance': `${state.tip.slip} %` },
              {
                'Minimum recieved': `${parseFloat(format(state.input.want.add(state.input.coll))).toFixed(3)} ${
                  tokenList[bond].symbol
                }`,
              },
              { Route: `COLL-> ${tokenList[bond].symbol} / ${tokenList[want].symbol}->${tokenList[bond].symbol}` },
              { 'Nominal swap fee': `${state.tip.fee} ${tokenList[want].symbol} ` },
            ]}
          />
        </div>
        <div className={classes.button}>
          <div>
            <MyButton name="Approve" onClick={async () => handleClick('approve')(want, pool)} />
            <MyButton
              name="Repay"
              onClick={async () => handleClick('repay')(state.input.want, state.input.coll, pool, signer)}
            />
          </div>
        </div>
      </div>
    ),
    [state, pool, data],
  )
}