import { ethers } from 'ethers'
import { useContext, useReducer, useMemo, useEffect } from 'react'
import { context, liteContext, tokenList, poolList } from '@/config'
import { MyButton, AmountInput, AmountShow, ApyFloatMessage } from '@/components/Modules'
import { makeStyles } from '@material-ui/core/styles'
import { ArrowForwardIosIcon } from '@/assets/svg'

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
    justifyContent: 'space-between',
    '&>div': {
      width: 'calc(50% - 15px)',
      display: 'flex',
      flexDirection: 'column',
      '&>button': {
        '&:first-child': {
          marginBottom: '15px',
        },
      },
      //PC
      '@media screen and (min-width:960px)': {
        '&:first-child': {
          flexDirection: 'row',
          justifyContent: 'space-between',
          '&>button': {
            width: 'calc(50% - 10px)',
            marginBottom: '0 !important',
          },
        },
        '&:last-child': {
          '&>button': {
            width: '100%',
            marginBottom: '0 !important',
          },
        },
      },
    },
  },
}))
const ZERO = ethers.constants.Zero
const INIT = {
  input: {
    clpt: ZERO,
  },
  output: {
    want: ZERO,
    coll: ZERO,
  },
  tip: { share: '0.000', poolBalance: '0.00', fee: '0.0000', rate: { want: 0, coll: 0 } },
  I: { clpt: '' },
  old: { clpt: '' },
}
const format = (num) => ethers.utils.formatEther(num)

export default function Withdraw(props) {
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
      const clpt = ethers.utils.parseUnits(state.I.clpt || '0', 18)
      const res = await controller.ct(pool, signer).get_dxdy(clpt)
      const poolBalance = (format(data.swap.sx) / format(data.swap.sy)).toPrecision(3)
      const share = ((format(data.balance.clpt) / format(data.swap.sk)) * 100).toPrecision(3)
      const rate = {
        coll: clpt.eq(ZERO) ? 0 : parseFloat(format(res[0]) / state.I.clpt).toPrecision(3),
        want: clpt.eq(ZERO) ? 0 : parseFloat(format(res[1]) / state.I.clpt).toPrecision(3),
      }
      const fee = (format(res[0]) * (1 - format(data.swap.fee))).toFixed(4)
      if (clpt.eq(state.input.clpt) === false) {
        setState({
          input: { clpt },
          output: { coll: res[0], want: res[1] },
          tip: { share, fee, rate, pool: poolBalance },
        })
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
        <div className={classes.button}>
          <div>
            <MyButton name="Withdraw" onClick={async () => handleClick('withdraw')(state.input.clpt, pool)} />
            <MyButton name="Claim" onClick={async () => handleClick('claim')(pool)} />
          </div>
          <div>
            <MyButton
              name="Withdraw & Claim"
              onClick={async () => handleClick('burn_and_claim')(state.input.clpt, pool)}
            />
          </div>
        </div>
      </div>
    ),
    [state, pool, data],
  )
}
