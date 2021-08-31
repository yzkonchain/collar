import { useContext, useEffect, useState, useMemo, useReducer } from 'react'
import { makeStyles } from '@material-ui/core'
import { context, proContext, STYLE } from '@/config'
import Overview from './Overview'
import AllMarkets from './AllMarkets'

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    margin: 'auto',
    padding: '30px 20px',
    [STYLE.PC]: {
      width: `${STYLE.WIDTH}px`,
    },
    [STYLE.MOBILE]: {},
  },
})

export default function Pro() {
  const classes = useStyles()
  const {
    state: { signer, controller },
  } = useContext(context)
  const [proState, setProState] = useReducer((o, n) => (typeof n === 'function' ? n(o) : { ...o, ...n }), {
    totalLockedValue: {},
    totalLiquidity: {},
    totalCollateral: {},
    historicalInterestRate: {},
  })

  return (
    <proContext.Provider value={{ proState, setProState }}>
      <div className={classes.root}>
        <Overview />
        <AllMarkets />
      </div>
    </proContext.Provider>
  )
}
