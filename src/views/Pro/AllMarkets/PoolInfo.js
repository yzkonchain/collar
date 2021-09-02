import { ethers } from 'ethers'
import { useContext, useEffect, useState, useMemo, useReducer } from 'react'
import { makeStyles } from '@material-ui/core'
import Operation from './Operation'
import Diagram from './Diagram'
import { Price } from '@/hooks'

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
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
    },
  },
  icon: {
    width: '35px',
    '&:nth-child(1)': {
      position: 'relative',
      left: '-10px',
    },
    '&:nth-child(2)': {
      position: 'absolute',
      left: '30px',
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

const format = (num, n) => ethers.utils.formatUnits(num, n || 18)
const parse = (num, n) => ethers.utils.parseUnits(num || '0', n || 18)

export default function PoolInfo({ index, data, onOff: { onOff, setOnOff }, tableHeadWidth, diagram }) {
  const classes = useStyles()
  const { pool, bond_total, coll_total, want_total, clpt_total, reward_rate, apy, farm_apy, clpt_price } = data
  const echartsData = {
    grid: {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    },
    xAxis: {
      type: 'category',
      show: false,
    },
    yAxis: {
      type: 'value',
      min: 'dataMin',
      max: 'dataMax',
      show: false,
    },
    series: [
      {
        data: diagram,
        type: 'line',
        showSymbol: false,
        smooth: true,
        lineStyle: { color: '#59FFAD' },
      },
    ],
  }

  return useMemo(
    () => (
      <div className={classes.root}>
        <div className={classes.table}>
          <div
            style={{
              width: tableHeadWidth[0],
              display: 'flex',
              position: 'relative',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              borderTop: '2px solid #ddd',
              padding: '20px 0',
            }}
          >
            <div>
              <img alt="" src={pool.bond.icon} className={classes.icon} />
              <img alt="" src={pool.want.icon} className={classes.icon} />
            </div>
            <span>{pool.bond.symbol}</span>
            <span>{pool.want.symbol}</span>
          </div>
          <div
            className={classes.info}
            style={{
              borderTop: '2px solid',
              borderImage: 'linear-gradient(to right,rgba(63,76,144,0.1),#fff) 100',
              backgroundImage:
                onOff === index ? 'none' : 'linear-gradient(to right,rgba(0,0,0,0.2),rgba(255,255,255,0))',
            }}
          >
            {/* Expiry */}
            <div style={{ width: tableHeadWidth[1], color: '#49FFC7' }}>
              {new Date(pool.expiry_time * 1000).toLocaleString()}
            </div>

            {/* Price */}
            <div style={{ width: tableHeadWidth[2], display: 'flex', flexDirection: 'column' }}>
              <span>{pool.coll.symbol}</span>
              <span style={{ marginBottom: '10px', color: '#A3B7E4', fontSize: '12px' }}>
                {/* ${(format(want_total) / format(coll_total)).toFixed(3)} */}${Price[pool.coll.addr].toFixed(3)}
              </span>
              <span>{pool.symbol}</span>
              <span style={{ color: '#A3B7E4', fontSize: '12px' }}>${clpt_price.toFixed(3)}</span>
            </div>

            {/* Collateral */}
            <div style={{ width: tableHeadWidth[3], display: 'flex', flexDirection: 'column' }}>
              <span>{(format(bond_total) * 1).toFixed(3)}</span>
              <span style={{ marginBottom: '10px' }}>{pool.bond.symbol}</span>
              <span style={{ color: '#A3B7E4', fontSize: '12px' }}>
                ${(format(bond_total) * Price[pool.bond.addr]).toFixed(3)}
              </span>
            </div>

            {/* Liquidity */}
            <div style={{ width: tableHeadWidth[4], display: 'flex', flexDirection: 'column' }}>
              <span style={{ marginBottom: '10px' }}>${(format(clpt_total) * clpt_price).toFixed(3)}</span>
              <span style={{ color: '#A3B7E4', fontSize: '12px' }}>
                {`${(format(want_total) * Price[pool.want.addr]).toFixed(3)} ${pool.want.symbol}`}
              </span>
              <span style={{ color: '#A3B7E4', fontSize: '12px' }}>
                {`${(format(coll_total) * Price[pool.coll.addr]).toFixed(3)} ${pool.coll.symbol}`}
              </span>
            </div>

            {/* Fixed APY */}
            <div style={{ width: tableHeadWidth[5] }}>{apy.toFixed(3)}%</div>

            {/* Historical Borrow APY */}
            <div style={{ width: tableHeadWidth[6] }}>{<Diagram data={echartsData} />}</div>

            {/* Staking APY */}
            <div style={{ width: tableHeadWidth[7] }}>{farm_apy.toFixed(2)}%</div>

            {/* COLLAR Reward */}
            <div style={{ width: tableHeadWidth[8] }}>{format(reward_rate)}</div>

            <div style={{ width: tableHeadWidth[9], alignItems: 'flex-end' }}>
              {
                <span className={classes.button} onClick={() => setOnOff(onOff === index ? -1 : index)}>
                  {onOff === index ? 'remove' : 'add'}
                </span>
              }
            </div>
          </div>
        </div>
        {onOff === index && <Operation data={data} />}
      </div>
    ),
    [onOff, diagram],
  )
}
