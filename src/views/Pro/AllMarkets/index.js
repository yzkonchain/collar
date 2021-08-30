import { useContext, useEffect, useState, useMemo, useReducer } from 'react'
import { makeStyles } from '@material-ui/core'
import { context, STYLE } from '@/config'
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

const tableHead = ['160px', '120px', '270px', '120px', '210px', '80px']

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
        <div style={{ width: tableHead[0], textAlign: 'left' }}>Pool</div>
        <div style={{ width: tableHead[1] }}>Fixed APY</div>
        <div style={{ width: tableHead[2] }}>Historical Borrow APY</div>
        <div style={{ width: tableHead[3] }}>Staking APY</div>
        <div style={{ width: tableHead[4] }}>COLLAR Reward</div>
        <div style={{ width: tableHead[5] }}></div>
      </div>
      {[1, 2, 3].map((val, key) => {
        return <PoolInfo key={key} val={val} onOff={{ setOnOff, onOff }} tableHead={tableHead} />
      })}
    </div>
  )
}
