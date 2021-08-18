import { ethers } from 'ethers'
import { useContext, useReducer, useEffect, useMemo } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { liteContext } from '@/config'

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
    liteState: { pool, pools, bond, want, bondList, wantList },
    setLiteState,
  } = useContext(liteContext)

  useEffect(() => {
    const wantList = pools.filter((val) => val['bond'].addr === bond).map((val) => val['want'])
    setLiteState({ wantList, want: wantList[0].addr })
  }, [bond])

  useEffect(() => {
    setLiteState({ pool: pools.filter((val) => val['bond'].addr === bond && val['want'].addr === want)[0]['pool'] })
  }, [want])

  return useMemo(
    () => (
      <div className={classes.root}>
        <span className={classes.formControlTitle}>Selector Pair</span>
        <div className={classes.formControlList}>
          <FormControl className={classes.formControl}>
            <Select
              value={bond}
              onChange={(e) => {
                setLiteState({ bond: e.target.value })
              }}
              className={classes.select}
              IconComponent={ExpandMoreIcon}
            >
              {bondList.map((val, key) => {
                return (
                  <MenuItem value={val.addr} key={key}>
                    <img alt="" src={val.icon} className={classes.icon} style={{ width: '20px' }} />
                    <span style={{ fontFamily: 'Gillsans' }}>{val.symbol}</span>
                  </MenuItem>
                )
              })}
            </Select>
          </FormControl>

          <img alt="" src={ArrowForwardIosIcon} className={classes.icon} />
          <FormControl className={classes.formControl}>
            <Select
              value={want}
              onChange={(e) => setLiteState({ want: e.target.value })}
              className={classes.select}
              IconComponent={ExpandMoreIcon}
            >
              {wantList.length ? (
                wantList.map((val, key) => {
                  return (
                    <MenuItem value={val.addr} key={key}>
                      <img alt="" src={val.icon} className={classes.icon} style={{ width: '20px' }} />
                      <span style={{ fontFamily: 'Gillsans' }}>{val.symbol}</span>
                    </MenuItem>
                  )
                })
              ) : (
                <MenuItem value={want}></MenuItem>
              )}
            </Select>
          </FormControl>
        </div>
      </div>
    ),
    [bond, want, wantList],
  )
}
