import { ethers } from 'ethers'
import { useContext, useReducer, useMemo, useEffect, useState } from 'react'
import { context, liteContext, tokenList } from '@/config'
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

export default function Withdraw(props) {
  const classes = useStyles()
  const {
    state: { signer },
  } = useContext(context)
  const {
    liteState: { forceUpdate, bond, want, pool, poolList, data, controller },
    setLiteState,
  } = useContext(liteContext)
  const [state, setState] = useReducer((s, ns) => ({ ...s, ...ns }), {
    input: {
      clpt: ZERO,
    },
    output: {
      want: ZERO,
      coll: ZERO,
    },
    tip: { share: '0.000', pool: '0.00', fee: '0.0000', rate: { want: 0, coll: 0 } },
    I: { clpt: '' },
    old: { clpt: '' },
  })
  useEffect(() => {
    if (!signer || ZERO.eq(data.swap.sk)) return
    ;(async () => {
      const _clpt = ethers.utils.parseUnits(state.I.clpt || '0', 18)
      const res = await controller.ct(pool, signer).get_dxdy(_clpt)
      const _pool = (ethers.utils.formatEther(data.swap.sx) / ethers.utils.formatEther(data.swap.sy)).toPrecision(3)
      const share = (
        (ethers.utils.formatEther(data.balance.clpt) / ethers.utils.formatEther(data.swap.sk)) *
        100
      ).toPrecision(3)
      const rate = {
        coll: _clpt.eq(ZERO) ? 0 : parseFloat(ethers.utils.formatEther(res[0]) / state.I.clpt).toPrecision(3),
        want: _clpt.eq(ZERO) ? 0 : parseFloat(ethers.utils.formatEther(res[1]) / state.I.clpt).toPrecision(3),
      }
      const fee = (ethers.utils.formatEther(res[0]) * (1 - ethers.utils.formatEther(data.swap.fee))).toFixed(4)
      if (_clpt.eq(state.input.clpt) === false) {
        setState({
          input: { clpt: _clpt },
          output: { want: res[1], coll: res[0] },
          tip: { share, pool: _pool, fee, rate },
        })
      }
    })()
  }, [state])

  useEffect(() => {
    setState({
      tip: { share: '0.000', pool: '0.00', fee: '0.0000', rate: { want: 0, coll: 0 } },
      I: { clpt: '' },
      old: { clpt: '' },
    })
  }, [pool])

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
                max: parseFloat(ethers.utils.formatEther(data.balance.clpt)),
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
            {
              'Share of Pool': `${state.tip.share} %`,
            },
            {
              'Pool Balance': `1 ${tokenList[want].symbol} = ${state.tip.pool} COLL`,
            },
            { 'Nominal swap fee': `${state.tip.fee} COLL` },
          ]}
        />
        <div className={classes.button}>
          <div>
            <MyButton
              name="Withdraw"
              onClick={async () => {
                await controller.withdraw(state.input.clpt, pool, signer)
                setLiteState({ forceUpdate: {} })
              }}
            />
            <MyButton
              name="Claim"
              onClick={async () => {
                await controller.claim(pool, signer)
                setLiteState({ forceUpdate: {} })
              }}
            />
          </div>
          <div>
            <MyButton
              name="Withdraw & Claim"
              onClick={async () => {
                await controller.burn_and_claim(state.input.clpt, pool, signer)
                setLiteState({ forceUpdate: {} })
              }}
            />
          </div>
        </div>
      </div>
    ),
    [state, pool, data],
  )
}
