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

export default function Exit(props) {
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
      coll: ZERO,
    },
    output: {
      want: ZERO,
    },
    tip: { fee: '0.0000', min: '0.000', slip: '0.00' },
    I: { coll: '' },
    old: { coll: '' },
  })

  useEffect(() => {
    if (!signer || ZERO.eq(data.swap.sk)) return
    ;(async () => {
      const _coll = ethers.utils.parseUnits(state.I.coll || '0', 18)
      const _want = await controller.ct(pool, signer).get_dy(_coll)
      const fee = (ethers.utils.formatEther(_want) * (1 - ethers.utils.formatEther(data.swap.fee))).toFixed(4)
      const min = (ethers.utils.formatEther(_want) * 0.995).toFixed(3)
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
      if (_coll.eq(state.input.coll) === false) {
        setState({
          input: { coll: _coll },
          output: { want: _want },
          tip: { fee, min, slip },
        })
        return
      }
    })()
  }, [state])

  useEffect(() => {
    setState({
      tip: { fee: '0.0000', min: '0.000', slip: '0.00' },
      I: { coll: '' },
      old: { coll: '' },
    })
  }, [pool])

  return useMemo(
    () => (
      <div className={classes.root}>
        <div className={classes.amount}>
          <div>
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
            <AmountShow title="want" state={{ state, token: want }} style={{ height: '90px' }} />
          </div>
        </div>
        <ApyFloatMessage
          APY={data.apy ? data.apy.toPrecision(3) : '0.00'}
          info={[
            {
              'Slippage tolerance': `${state.tip.slip} %`,
            },
            {
              'Minimum recieved': `${state.tip.min} ${tokenList[want].symbol}`,
            },
            { Route: `COLL -> ${tokenList[want].symbol}` },
            {
              'Nominal swap fee': `${state.tip.fee} ${tokenList[want].symbol} `,
            },
          ]}
        />
        <div className={classes.button}>
          <div>
            <MyButton
              name="Approve"
              onClick={() => {
                console.log('Approve')
              }}
            />
            <MyButton
              name="Exit"
              onClick={async () => {
                await controller.redeem(state.output.want, state.input.coll, pool, signer)
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
