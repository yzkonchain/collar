import { ethers } from 'ethers'
import { useCallback, useContext, useReducer, useMemo, useEffect, useState } from 'react'
import { context, liteContext, tokenList } from '@/config'
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

export default function Repay(props) {
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
      want: ZERO,
      coll: ZERO,
    },
    output: {
      clpt: ZERO,
    },
    tip: { share: '0.000', pool: '0.00', slip: '0.00' },
    I: { want: '', coll: '' },
    old: { want: '', coll: '' },
  })

  useEffect(() => {
    if (!signer || ZERO.eq(data.swap.sk)) return
    ;(async () => {
      const _want = ethers.utils.parseUnits(state.I.want || '0', 18)
      const _coll = ethers.utils.parseUnits(state.I.coll || '0', 18)
      const _clpt = await controller.ct(pool, signer).get_dk(_coll, _want)

      const _pool = (ethers.utils.formatEther(data.swap.sx) / ethers.utils.formatEther(data.swap.sy)).toPrecision(3)
      const share = (
        (ethers.utils.formatEther(data.balance.clpt) / ethers.utils.formatEther(data.swap.sk)) *
        100
      ).toPrecision(3)
      const slip = (
        (parseFloat(
          ethers.utils.formatEther(
            data.swap.sx
              .add(_coll)
              .add(data.swap.sk)
              .mul(ethers.utils.parseEther('1'))
              .div(
                data.swap.sy.add(_want).add(data.swap.sk.mul(poolList[pool].swap_sqp).div(ethers.BigNumber.from(1e9))),
              )
              .sub(ethers.utils.parseEther('1')),
          ),
        ) *
          3155692600000) /
          (poolList[pool].expiry_time * 1000 - new Date()) -
        data.apy
      ).toPrecision(3)

      if (_want.eq(state.input.want) === false || _coll.eq(state.input.coll) === false) {
        setState({
          input: { want: _want, coll: _coll },
          output: { clpt: _clpt },
          tip: { share, pool: _pool, slip },
        })
      }
    })()
  }, [state])

  useEffect(() => {
    setState({
      tip: { share: '0.000', pool: '0.00', slip: '0.00' },
      I: { want: '', coll: '' },
      old: { want: '', coll: '' },
    })
  }, [pool])

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
                max: parseFloat(ethers.utils.formatEther(data.balance.want)),
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
                max: parseFloat(ethers.utils.formatEther(data.balance.coll)),
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
            {
              'Share of Pool': `${state.tip.share} %`,
            },
            {
              'Pool Balance': `1 ${tokenList[want].symbol} = ${state.tip.pool} COLL`,
            },
            {
              'Slippage tolerance': `${state.tip.slip} %`,
            },
          ]}
        />
        <div className={classes.button}>
          <div>
            <MyButton
              name="Approve"
              onClick={async () => {
                await controller.approve(want, pool, signer)
                setLiteState({ forceUpdate: {} })
              }}
            />
            <MyButton
              name="Deposit"
              onClick={async () => {
                await controller.deposit(state.input.want, state.input.coll, state.output.clpt, pool, signer)
                setLiteState({ forceUpdate: {} })
              }}
            />
          </div>
          <div>
            <MyButton
              name="Claim"
              onClick={async () => {
                await controller.claim(pool, signer)
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
