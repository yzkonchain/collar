import { ethers } from 'ethers'
import { useContext, useReducer, useEffect, useMemo } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { liteContext, pools, tokenList, bondList, wantList, poolSelect } from '@/config'

import { FormControl, InputLabel, Box, Select, MenuItem } from '@material-ui/core'
import { iconInfo, ArrowForwardIosIcon } from '@/assets/svg'

import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
const useStyles = makeStyles((theme) => ({
  root: {},
  formControlTitle: {
    fontFamily: 'Helvetica',
    fontSize: '0.8em',
    display: 'block',
    margin: '10px 0',
    color: '#30384B',
  },
  formControlList: {
    display: 'flex',
    justifyContent: 'space-between',
    '&>div': {
      backgroundColor: '#F4F4F4',
      '&>div': {
        lineHeight: 'unset',
      },
      '&>div::before': {
        border: 'none',
      },
    },
  },
  formControl: {
    width: '50%',
    '& span': {
      fontFamily: 'Gillsans',
    },
  },
  icon: {
    margin: '0 10px',
  },
  select: {
    '&>div': {
      '& span,& img': {
        verticalAlign: 'middle',
      },
    },
  },
}))

export default function PoolSelector() {
  const classes = useStyles()
  const {
    liteState: { pool, bond, want, round },
    setLiteState,
  } = useContext(liteContext)

  const getPool = (bond, want) => poolSelect[`${bond}-${want}-${round ? '1' : '0'}`]

  return useMemo(
    () => (
      <div className={classes.root}>
        <span className={classes.formControlTitle}>Selector Pair</span>
        <div className={classes.formControlList}>
          <FormControl className={classes.formControl}>
            <Select
              value={bond}
              onChange={({ target: { value: bond } }) => {
                const want = wantList[bond][0].addr
                const {
                  pool,
                  coll: { addr: coll },
                } = getPool(bond, want)
                setLiteState({ bond, want, coll, pool })
              }}
              className={classes.select}
              IconComponent={ExpandMoreIcon}
            >
              {bondList.map(({ addr, icon, symbol }) => {
                return (
                  <MenuItem value={addr} key={addr}>
                    <img alt="" src={icon} className={classes.icon} style={{ width: '20px' }} />
                    <span style={{ fontFamily: 'Gillsans' }}>{symbol}</span>
                  </MenuItem>
                )
              })}
            </Select>
          </FormControl>

          <img alt="" src={ArrowForwardIosIcon} className={classes.icon} />
          <FormControl className={classes.formControl}>
            <Select
              value={want}
              onChange={({ target: { value: want } }) => {
                const {
                  pool,
                  coll: { addr: coll },
                } = getPool(bond, want)
                setLiteState({ want, coll, pool })
              }}
              className={classes.select}
              IconComponent={ExpandMoreIcon}
            >
              {wantList[bond].map(({ addr, icon, symbol }) => {
                return (
                  <MenuItem value={addr} key={addr}>
                    <img alt="" src={icon} className={classes.icon} style={{ width: '20px' }} />
                    <span style={{ fontFamily: 'Gillsans' }}>{symbol}</span>
                  </MenuItem>
                )
              })}
            </Select>
          </FormControl>
        </div>
      </div>
    ),
    [bond, want, round],
  )
}
