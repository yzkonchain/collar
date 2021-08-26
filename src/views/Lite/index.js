import { ethers } from 'ethers'
import { useContext, useReducer, useEffect, useMemo, useState, useCallback, Suspense, lazy } from 'react'
import { makeStyles } from '@material-ui/core'
import { context, liteContext, pools, poolSelect, STYLE } from '@/config'

import Info from './Info'
import PoolSelector from './PoolSelector'
import { MyTabs, MyTabsChild, Loading } from '@/components/Modules'

const useStyles = makeStyles({
  root: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    '&>div': {
      position: 'relative',
      backgroundColor: 'white',
      '&:first-child': {
        zIndex: '4',
        margin: '20px 20px 0 20px',
      },
      '&:nth-child(2)': {
        zIndex: '2',
        transform: 'translateY(-13px)',
        boxSizing: 'border-box',
        border: '#4C4C4C 2px solid',
        height: '20px',
        width: 'calc(100% - 60px)',
      },
      '&:nth-child(3)': {
        zIndex: '1',
        transform: 'translateY(-26px)',
        boxSizing: 'border-box',
        border: '#4C4C4C 2px solid',
        height: '20px',
        width: 'calc(100% - 80px)',
      },
      [STYLE.MOBILE]: {
        width: 'calc(100% - 40px)',
      },
      [STYLE.PC]: {
        width: '900px',
        '&:nth-child(2)': {
          width: '880px',
        },
        '&:nth-child(3)': {
          width: '860px',
        },
      },
    },
  },
  content: {
    zIndex: '3',
    position: 'relative',
    backgroundColor: 'white',
    border: '#4C4C4C 2px solid',
    borderTop: 'none',
    padding: '15px',
  },
})
const useStylesChild = makeStyles({
  root: {},
  amount: {
    display: 'flex',
    justifyContent: 'space-between',
    // marginBottom: '15px',
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
  buttonOne: {
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
  buttonTwo: {
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
      [STYLE.PC]: {
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
})

const ZERO = ethers.constants.Zero
const data_zero = {
  balance: {
    bond: ZERO,
    want: ZERO,
    call: ZERO,
    coll: ZERO,
    clpt: ZERO,
    collar: ZERO,
  },
  allowance: {
    bond: ZERO,
    want: ZERO,
  },
  earned: {
    collar: ZERO,
  },
  swap: {
    sx: ZERO,
    sy: ZERO,
    sk: ZERO,
  },
  apy: 0,
}

export default function Lite() {
  const classes = useStyles()
  const classesChild = useStylesChild()
  const {
    state: { signer, controller },
  } = useContext(context)
  const [loading, setLoading] = useState(false)
  const [liteState, setLiteState] = useReducer((o, n) => ({ ...o, ...n }), {
    tabs: 0,
    tabsChild: 0,
    round: [0, !pools[0].r2],
    pool: pools[0].r1,
    coll: pools[0].r1.coll,
    bond: pools[0].r1.bond,
    want: pools[0].r1.want,
    data: data_zero,
    forceUpdate: {},
  })
  const { tabs, tabsChild, pool, data, round } = liteState
  const tabsList = ['LOAN', 'FARM', 'SWAP']
  const tabsChildList = [
    ['Borrow', 'Repay'],
    ['Deposit', 'Withdraw'],
    ['Lend', 'Exit'],
  ]

  const Content = useCallback(
    lazy(() => import(`./${tabsChildList[tabs][tabsChild]}`)),
    [tabs, tabsChild],
  )

  const handleClick = useCallback(
    (type) =>
      async function () {
        return await controller[type].call(null, ...arguments, pool).then((res) => {
          if (res) setLiteState({ forceUpdate: {} })
          return res
        })
      },
    [controller, pool],
  )

  useEffect(() => {
    const poolName = `${pool.bond.addr}-${pool.want.addr}`
    setLiteState({ pool: poolSelect[`${poolName}-${round[0]}`], forceUpdate: {} })
  }, [round[0]])

  useEffect(() => {
    const poolName = `${pool.bond.addr}-${pool.want.addr}`
    const poolRound = !poolSelect[`${poolName}-1`]
    const newRound = [poolRound ? 0 : round[0], poolRound]
    if (signer) {
      ;(async () => {
        setLoading(true)
        const newData = await controller.fetch_state(pool)
        setLiteState({ data: newData, round: newRound })
        setLoading(false)
      })()
    } else if (data !== data_zero || round[1] !== poolRound) setLiteState({ data: data_zero, round: newRound })
  }, [signer, pool])

  return useMemo(
    () => (
      <liteContext.Provider value={{ liteState, setLiteState, handleClick, classesChild }}>
        <div className={classes.root}>
          <div>
            <MyTabs value={tabs} onChange={(_, v) => setLiteState({ tabs: v, tabsChild: 0 })} labels={tabsList} />
            <div className={classes.content}>
              <MyTabsChild
                tabs={tabs}
                value={tabsChild}
                labels={tabsChildList}
                onChange={(_, v) => setLiteState({ tabsChild: v })}
                round={{ round, setRound: (round) => setLiteState({ round }) }}
                expiry={pool.expiry_time * 1000}
              />
              <PoolSelector />
              <Suspense fallback={<div style={{ height: tabs == 1 ? '389px' : '240px' }} />}>
                <Content />
              </Suspense>
            </div>
          </div>
          <div></div>
          <div></div>
          <Info />
          <Loading open={loading} />
        </div>
      </liteContext.Provider>
    ),
    [liteState, loading],
  )
}
