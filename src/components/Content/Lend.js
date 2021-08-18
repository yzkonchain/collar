import { ethers } from 'ethers'
import { useContext, useReducer, useMemo, useEffect, useState } from 'react'
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

export default function Lend(props) {
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
    },
    output: {
      coll: ZERO,
    },
    tip: { fee: '0.0000', min: '0.000', slip: '0.00' },
    I: { want: '' },
    old: { want: '' },
  })

  useEffect(() => {
    if (!signer || ZERO.eq(data.swap.sk)) return
    ;(async () => {
      const _want = ethers.utils.parseUnits(state.I.want || '0', 18)
      const _coll = await controller.ct(pool, signer).get_dx(_want)
      const fee = (ethers.utils.formatEther(_coll) * (1 - ethers.utils.formatEther(data.swap.fee))).toFixed(4)
      const min = (ethers.utils.formatEther(_coll) * 0.995).toFixed(3)
      const slip = (
        (parseFloat(
          ethers.utils.formatEther(
            data.swap.sx
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
      if (_want.eq(state.input.want) === false) {
        setState({ input: { want: _want }, output: { coll: _coll }, tip: { fee, min, slip } })
      }
    })()
  }, [state])

  useEffect(() => {
    setState({
      tip: { fee: '0.0000', min: '0.000', slip: '0.00' },
      I: { want: '' },
      old: { want: '' },
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
          </div>
          <img alt="" src={ArrowForwardIosIcon} className={classes.icon} />
          <div>
            <AmountShow title="coll" state={{ state, token: poolList[pool].coll.addr }} style={{ height: '90px' }} />
          </div>
        </div>
        <ApyFloatMessage
          APY={data.apy ? data.apy.toPrecision(3) : '0.00'}
          info={[
            {
              'Slippage tolerance': `${state.tip.slip} %`,
            },
            { 'Minimum recieved': `${state.tip.min} COLL` },
            { Route: `${tokenList[want].symbol} -> COLL` },
            {
              'Nominal swap fee': `${state.tip.fee} COLL`,
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
              name="Lend"
              onClick={async () => {
                await controller.lend(state.input.want, state.output.coll, pool, signer)
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
