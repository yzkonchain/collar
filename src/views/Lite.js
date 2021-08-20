import { ethers } from 'ethers'
import { useContext, useReducer, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { context, liteContext, pools, poolList, bondList } from '@/config'
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
const ZERO = ethers.constants.Zero

export default function Lite() {
  const classes = useStyles()
  const controller = contract()
  const {
    state: { signer },
  } = useContext(context)
  const [liteState, setLiteState] = useReducer((s, ns) => ({ ...s, ...ns }), {
    tabs: 0,
    tabsChild: 0,
    round: false,
    pool: pools[0]['pool'],
    bond: pools[0]['bond'].addr,
    want: pools[0]['want'].addr,
    pools,
    poolList,
    bondList,
    wantList: [],
    data: {
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
    },
    controller,
    forceUpdate: {},
  })
  useEffect(() => {
    if (signer) {
      ;(async () => {
        setLiteState({
          data: await controller.fetch_state(liteState.pool, signer),
        })
      })()
    } else {
      setLiteState({
        data: {
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
        },
      })
    }
  }, [signer, liteState.pool])

  const { tabs, tabsChild, round } = liteState
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

  return (
    <liteContext.Provider value={{ liteState, setLiteState }}>
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
  )
}
