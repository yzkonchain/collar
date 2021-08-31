import { ethers } from 'ethers'
import { useContext, useEffect, useState, useMemo, useReducer } from 'react'
import { makeStyles } from '@material-ui/core'
import { context, STYLE, signerNoAccount } from '@/config'
import PoolInfo from './PoolInfo'

const useStyles = makeStyles({
  root: {},
  title: {
    color: '#fff',
    fontFamily: 'Gillsans',
    fontSize: '30px',
    marginBottom: '30px',
  },
  header: {
    color: '#fff',
    fontFamily: 'Gillsans',
    fontSize: '20px',
    margin: '10px 0',
    display: 'flex',
    '&>div': {
      textAlign: 'center',
    },
  },
})

const tableHead = [
  'Pool',
  'Expiry',
  'Price',
  'Collateral',
  'Liquidity',
  'Fixed APY',
  'Historical Borrow APY',
  'Staking APY',
  'COLLAR Reward',
  '',
]
const tableHeadWidth = ['100px', '90px', '90px', '90px', '140px', '90px', '130px', '110px', '90px', '30px']

export default function AllMarkets() {
  const classes = useStyles()
  const {
    state: { signer, controller },
  } = useContext(context)
  const [onOff, setOnOff] = useState(0)

  return (
    <div className={classes.root}>
      <div className={classes.title}>All Markets</div>
      <div className={classes.header}>
        {tableHead.map((head, key) => {
          return (
            <div
              key={key}
              style={{
                width: tableHeadWidth[key],
                display: 'flex',
                alignItems: 'center',
                justifyContent: key === 0 ? 'start' : 'center',
              }}
            >
              <span>{head}</span>
            </div>
          )
        })}
      </div>
      {[1, 2, 3].map((val, key) => {
        return <PoolInfo key={key} val={val} onOff={{ setOnOff, onOff }} tableHeadWidth={tableHeadWidth} />
      })}
    </div>
  )
}
