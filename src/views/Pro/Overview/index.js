import { useContext, useEffect, useState, useMemo, useReducer, Suspense, lazy, useCallback } from 'react'
import { makeStyles } from '@material-ui/core'
import { context, proContext, STYLE } from '@/config'

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
        width: '48%',
      },
    },
  },
})

const echartsContent = ['TotalLockedValue', 'TotalLiquidity', 'TotalCollateral', 'HistoricalInterestRate'].map((item) =>
  lazy(() => import(`./${item}`)),
)

export default function Overview() {
  const classes = useStyles()
  const {
    state: { signer, controller },
  } = useContext(context)
  const { proState, setProState } = useContext(proContext)
  const [period, setPeriod] = useState({
    totalLockedValue: '12h',
    totalLiquidity: '12h',
    totalCollateral: '12h',
    historicalInterestRate: '12h',
  })

  const handleChange = (p, key) => controller.pro_data(p, key).then((data) => setProState(data))
  useEffect(() => handleChange('12h'), [])

  return (
    <div className={classes.root}>
      <div className={classes.title}>Market Overview</div>
      <div className={classes.content}>
        <Suspense fallback={<div />}>
          {echartsContent.map((Item, key) => (
            <Item key={key} {...{ period, setPeriod, handleChange }} />
          ))}
        </Suspense>
      </div>
    </div>
  )
}
