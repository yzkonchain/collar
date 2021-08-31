import { useContext, useReducer, useEffect, useMemo, useState, useCallback, Suspense, lazy } from 'react'
import { makeStyles } from '@material-ui/core'
import MyTabs from './MyTabs'
import Mint from './Mint'
import Burn from './Burn'
import Swap from './Swap'
import Liquidity from './Liquidity'

const useStyles = makeStyles({
  root: {
    marginTop: '20px',
    marginBottom: '20px',
    '&>div': {
      position: 'relative',
      margin: 'auto',
      backgroundColor: '#fff',
      '&:nth-child(1)': { zIndex: '4' },
      '&:nth-child(2)': {
        zIndex: '3',
        border: '#4c4c4c 2px solid',
        borderTop: 'none',
        padding: '20px',
      },
      '&:nth-child(3)': {
        zIndex: '2',
        transform: 'translateY(-15px)',
        boxSizing: 'border-box',
        border: '#4C4C4C 2px solid',
        height: '20px',
        width: 'calc(100% - 20px)',
      },
      '&:nth-child(4)': {
        zIndex: '1',
        transform: 'translateY(-30px)',
        boxSizing: 'border-box',
        border: '#4C4C4C 2px solid',
        height: '20px',
        width: 'calc(100% - 40px)',
      },
    },
  },
})

export default function Operation() {
  const classes = useStyles()
  const [tabs, setTabs] = useState(0)
  const tabsList = ['Mint', 'Burn', 'Swap', 'Liquidity']
  const Content = useCallback(
    lazy(() => import(`./${tabsList[tabs]}`)),
    [tabs],
  )

  return (
    <div className={classes.root}>
      <MyTabs value={tabs} onChange={(_, v) => setTabs(v)} labels={tabsList} />
      <div>
        <Suspense fallback={<div />}>
          <Content />
        </Suspense>
      </div>
      <div></div>
      <div></div>
    </div>
  )
}
