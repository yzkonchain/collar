import { useContext, useEffect, useState, useMemo, useReducer } from 'react'
import { makeStyles } from '@material-ui/core'
import { context, STYLE } from '@/config'

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

  return (
    <div className={classes.root}>
      <Overview />
      <AllMarkets />
    </div>
  )
}
