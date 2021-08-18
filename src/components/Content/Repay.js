import { ethers } from 'ethers'
import { useCallback, useContext, useReducer, useMemo, useEffect, useState } from 'react'
import { context, liteContext, tokenList } from '@/config'
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
      bond: ZERO,
    },
    tip: { fee: '0.0000', min: '0.000', slip: '0.00' },
    I: { want: '', coll: '' },
    old: { want: '', coll: '' },
  })

  useEffect(() => {
    if (!signer || ZERO.eq(data.swap.sk)) return
    ;(async () => {
      const _want = ethers.utils.parseUnits(state.I.want || '0', 18)
      const _coll = ethers.utils.parseUnits(state.I.coll || '0', 18)
      const _bond = _want.add(_coll)
      const fee = (ethers.utils.formatEther(_want) * (1 - ethers.utils.formatEther(data.swap.fee))).toFixed(4)
      const min = (ethers.utils.formatEther(_bond) * 0.995).toFixed(3)
      const slip = (
        (parseFloat(
          ethers.utils.formatEther(
            data.swap.sx
              .add(_bond)
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
      if (_want.eq(state.input.want) === false || _coll.eq(state.input.coll) === false) {
        setState({ input: { want: _want, coll: _coll }, output: { bond: _bond }, tip: { fee, min, slip } })
      }
    })()
  }, [state])

  useEffect(() => {
    setState({
      tip: { fee: '0.0000', min: '0.000', slip: '0.00' },
      I: { want: '', coll: '' },
      old: { want: '', coll: '' },
    })
  }, [pool])

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
                token: [want, poolList[pool]['coll'].addr],
                max: [
                  Math.min(
                    parseFloat(ethers.utils.formatEther(data.balance.call)),
                    parseFloat(ethers.utils.formatEther(data.balance.want)),
                  ),
                  Math.min(
                    parseFloat(ethers.utils.formatEther(data.balance.call)),
                    parseFloat(ethers.utils.formatEther(data.balance.coll)),
                  ),
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
            Maximum debt = {ethers.utils.formatEther(data.balance.call)}
          </div>
          <ApyFloatMessage
            APY={data.apy ? data.apy.toPrecision(3) : '0.00'}
            info={[
              {
                'Slippage tolerance': `${state.tip.slip} %`,
              },
              {
                'Minimum recieved': `${parseFloat(
                  ethers.utils.formatEther(state.input.want.add(state.input.coll)),
                ).toFixed(3)} ${tokenList[bond].symbol}`,
              },
              {
                Route: `COLL-> ${tokenList[bond].symbol} / ${tokenList[want].symbol}->${tokenList[bond].symbol}`,
              },
              { 'Nominal swap fee': `${state.tip.fee} ${tokenList[want].symbol} ` },
            ]}
          />
        </div>
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
              name="Repay"
              onClick={async () => {
                await controller.repay(state.input.want, state.input.coll, pool, signer)
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
