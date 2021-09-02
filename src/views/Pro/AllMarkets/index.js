import { ethers } from 'ethers'
import { useContext, useEffect, useState, useMemo, useReducer } from 'react'
import { makeStyles, CircularProgress } from '@material-ui/core'
import { context, proContext, STYLE, signerNoAccount } from '@/config'
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
  'Farm APY',
  'COLLAR Reward',
  '',
]
const tableHeadWidth = ['80px', '100px', '80px', '90px', '150px', '90px', '140px', '110px', '90px', '30px']

export default function AllMarkets() {
  const classes = useStyles()
  const {
    state: { signer, controller },
  } = useContext(context)
  const {
    proState: { historicalInterestRate },
  } = useContext(proContext)
  const [onOff, setOnOff] = useState(-1)
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (historicalInterestRate.series) setLoading(false)
  }, [historicalInterestRate])

  useEffect(() => {
    controller.pro_data().then((data) => setData(data))
  }, [])

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
                justifyContent: 'center',
                fontFamily: 'Frutiger',
              }}
            >
              <span>{head}</span>
            </div>
          )
        })}
      </div>
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '500px' }}>
          <CircularProgress color="primary" size={80} />
        </div>
      ) : (
        data.map((data, index) => {
          return (
            <PoolInfo
              key={index}
              index={index}
              data={data}
              diagram={historicalInterestRate.series[index].data}
              onOff={{ setOnOff, onOff }}
              tableHeadWidth={tableHeadWidth}
            />
          )
        })
      )}
    </div>
  )
}
