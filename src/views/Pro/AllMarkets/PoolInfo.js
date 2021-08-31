import { useContext, useEffect, useState, useMemo, useReducer } from 'react'
import { makeStyles } from '@material-ui/core'
import { USDT, USDC } from '@/assets/svg/token'
import Operation from './Operation'

const useStyles = makeStyles({
  root: {},
  table: {
    color: '#fff',
    display: 'flex',
    fontSize: '15px',
    fontFamily: 'Frutiger',
  },
  info: {
    padding: '20px 0',
    display: 'flex',
    '&>div': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  },
  icon: {
    width: '35px',
    '&:nth-child(2)': {
      position: 'relative',
      left: '-15px',
    },
  },
  button: {
    fontFamily: 'Material Icons',
    backgroundColor: '#4975FF',
    borderRadius: '5px',
    fontSize: '20px',
    padding: '2px',
    cursor: 'pointer',
  },
})

export default function PoolInfo({ val, onOff: { onOff, setOnOff }, tableHeadWidth }) {
  const classes = useStyles()
  return useMemo(
    () => (
      <div className={classes.root}>
        <div className={classes.table}>
          <div
            style={{
              width: tableHeadWidth[0],
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              borderTop: '2px solid #ddd',
              padding: '20px 0',
            }}
          >
            <div>
              <img alt="" src={USDT} className={classes.icon} />
              <img alt="" src={USDC} className={classes.icon} />
            </div>
            <span>BOND/WANT</span>
          </div>
          <div
            className={classes.info}
            style={{
              borderTop: '2px solid',
              borderImage: 'linear-gradient(to right,rgba(63,76,144,0.1),#fff) 100',
              backgroundImage: onOff === val ? 'none' : 'linear-gradient(to right,rgba(0,0,0,0.2),rgba(255,255,255,0))',
            }}
          >
            <div style={{ width: tableHeadWidth[1] }}>Oct 1st 2021</div>
            <div style={{ width: tableHeadWidth[2] }}>COLL</div>
            <div style={{ width: tableHeadWidth[3] }}>71200USDT</div>
            <div style={{ width: tableHeadWidth[4] }}>71200USDT</div>
            <div style={{ width: tableHeadWidth[5] }}>3.12%</div>
            <div style={{ width: tableHeadWidth[6] }}>---</div>
            <div style={{ width: tableHeadWidth[7] }}>3.12%</div>
            <div style={{ width: tableHeadWidth[8] }}>71200/BLOCK</div>
            <div style={{ width: tableHeadWidth[9], justifyContent: 'flex-end' }}>
              {
                <span className={classes.button} onClick={() => setOnOff(onOff === val ? 0 : val)}>
                  {onOff === val ? 'remove' : 'add'}
                </span>
              }
            </div>
          </div>
        </div>
        {onOff === val && <Operation />}
      </div>
    ),
    [onOff],
  )
}
