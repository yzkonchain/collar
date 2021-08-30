import { useContext, useEffect, useState, useMemo, useReducer } from 'react'
import { makeStyles } from '@material-ui/core'
import { context, STYLE } from '@/config'

import TotalLockedValue from './TotalLockedValue'
import TotalLiquidity from './TotalLiquidity'
import Volume from './Volume'
import TotalCollateral from './TotalCollateral'
import TotalDebt from './TotalDebt'
import HistoricalInterestRate from './HistoricalInterestRate'

const useStyles = makeStyles({
  root: {},
  title: {
    color: 'white',
    fontFamily: 'Gillsans',
    fontSize: '30px',
    marginBottom: '30px',
  },
  content: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    [STYLE.PC]: {
      '&>div': {
        width: '31%',
      },
    },
  },
})
export default function Overview() {
  const classes = useStyles()
  const {
    state: { signer, controller },
  } = useContext(context)

  return (
    <div className={classes.root}>
      <div className={classes.title}>Market Overview</div>
      <div className={classes.content}>
        <TotalLockedValue />
        <TotalLockedValue />
        <TotalLockedValue />
        <TotalLockedValue />
        <TotalLockedValue />
        <TotalLockedValue />
        {/* <TotalLiquidity />
        <Volume />
        <TotalCollateral />
        <TotalDebt />
        <HistoricalInterestRate /> */}
      </div>
    </div>
  )
}
