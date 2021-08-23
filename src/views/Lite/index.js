import { ethers } from 'ethers'
import { useContext, useReducer, useEffect, useMemo, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { context, liteContext, pools, poolSelect } from '@/config'
import { contract } from '@/hooks'

import Borrow from './Borrow'
import Repay from './Repay'
import Deposit from './Deposit'
import Withdraw from './Withdraw'
import Lend from './Lend'
import Exit from './Exit'
import Info from './Info'
import PoolSelector from './PoolSelector'
import { MyTabs, MyTabsChild, Loading } from '@/components/Modules'

const useStyles = makeStyles((theme) => ({
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
      //Mobile
      '@media screen and (max-width:960px)': {
        width: 'calc(100% - 40px)',
      },
      //PC
      '@media screen and (min-width:960px)': {
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
}))
const useStylesChild = makeStyles((theme) => ({
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
  const CT = contract()
  const {
    state: { signer },
  } = useContext(context)
  const [loading, setLoading] = useState(false)
  const [liteState, setLiteState] = useReducer((s, ns) => ({ ...s, ...ns }), {
    tabs: 0,
    tabsChild: 0,
    round: [0, true],
    pool: pools[0].r1,
    coll: pools[0].r1.coll,
    bond: pools[0].r1.bond,
    want: pools[0].r1.want,
    data: data_zero,
    controller: null,
    forceUpdate: {},
  })
  const { tabs, tabsChild, pool, data, round, controller } = liteState

  const handleClick = (type) =>
    async function () {
      if (controller) {
        // setLoading(true)
        const res = await controller[type].call(null, ...arguments, pool)
        if (res) setLiteState({ forceUpdate: {} })
        // setLoading(false)
        return res
      } else CT()
    }

  const tabsList = ['LOAN', 'FARM', 'SWAP']
  const tabsChildList = [
    ['Borrow', 'Repay'],
    ['Deposit', 'Withdraw'],
    ['Lend', 'Exit'],
  ]
  const Content = [
    [Borrow, Repay],
    [Deposit, Withdraw],
    [Lend, Exit],
  ][tabs][tabsChild]

  useEffect(() => {
    const poolName = `${pool.bond.addr}-${pool.want.addr}`
    setLiteState({ pool: poolSelect[`${poolName}-${round[0]}`] })
  }, [round[0]])

  useEffect(() => {
    if (signer) {
      ;(async () => {
        setLoading(true)
        const controller = CT(signer)
        const poolName = `${pool.bond.addr}-${pool.want.addr}`
        const poolRound = !poolSelect[`${poolName}-1`]
        const newData = await controller.fetch_state(pool)
        setLiteState({
          controller,
          data: newData,
          round: [poolRound ? 0 : round[0], poolRound],
        })
        setLoading(false)
      })()
    } else {
      if (data !== data_zero) setLiteState({ data: data_zero, controller: null, round: [0, true] })
    }
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
              <Content />
            </div>
          </div>
          <div></div>
          <div></div>
          <Info />
          {loading && <Loading />}
        </div>
      </liteContext.Provider>
    ),
    [liteState, loading],
  )
}
