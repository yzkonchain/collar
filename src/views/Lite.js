import { ethers } from 'ethers'
import { useContext, useReducer, useEffect, useMemo } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { context, liteContext, pools } from '@/config'
import { contract } from '@/hooks'

import { MyTabs, MyTabsChild } from '@/components/Modules'
import { PoolSelector, Borrow, Repay, Deposit, Withdraw, Lend, Exit, Info } from '@/components/Content'

const useStyles = makeStyles((theme) => ({
  root: {
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
  const [liteState, setLiteState] = useReducer((s, ns) => ({ ...s, ...ns }), {
    tabs: 0,
    tabsChild: 0,
    round: false,
    pool: pools[0].r1.pool,
    coll: pools[0].r1.coll.addr,
    bond: pools[0].bond.addr,
    want: pools[0].want.addr,
    data: data_zero,
    controller: null,
    forceUpdate: {},
  })
  const { tabs, tabsChild, pool, data, round, controller } = liteState

  const handleClick = (type) =>
    async function () {
      if (controller) {
        await controller[type].call(null, ...arguments, pool)
        setLiteState({ forceUpdate: {} })
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
    if (signer) {
      ;(async () => {
        const controller = CT(signer)
        setLiteState({ data: await controller.fetch_state(pool), controller })
      })()
    } else {
      if (data !== data_zero) setLiteState({ data: data_zero, controller: null })
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
              />
              <PoolSelector />
              <Content />
            </div>
          </div>
          <div></div>
          <div></div>
          <Info />
        </div>
      </liteContext.Provider>
    ),
    [liteState],
  )
}
