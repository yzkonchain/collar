import { useContext, useEffect, useState, useMemo } from 'react'
import { context } from '@/config'
import { makeStyles } from '@material-ui/core/styles'
import { Price, contract } from '@/hooks'
import { Global, Balance, DetailTable } from '.'

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    margin: '30px auto',
    '&>hr': {
      border: '#3B54A0 1px solid',
      width: '100%',
      margin: '20px 0',
    },
    //Mobile
    '@media screen and (max-width:960px)': {
      width: 'calc(100% - 40px)',
      padding: '0 20px',
    },
    //PC
    '@media screen and (min-width:960px)': {
      width: '900px',
    },
  },
})
const INIT = {
  pools: [],
  total: {
    totalValueLocked: 0,
    totalBorrowed: 0,
    totalCollateral: 0,
    outstandingDebt: 0,
    depostBalance: 0,
    receivables: 0,
    rewards: 0,
  },
  timer: new Date().getTime(),
}

export default function MyPage() {
  const classes = useStyles()
  const {
    state: { signer },
  } = useContext(context)
  const controller = contract()(signer, true)
  const [update, setUpdate] = useState({})
  const [count, setCount] = useState(INIT)
  const { pools, total } = count

  const handleClick = async (type, pool) => {
    if (await controller[type](pool)) setUpdate({})
  }

  useEffect(() => {
    if (signer) {
      ;(async () => {
        const pools = await controller.mypage_data()
        const total = { ...INIT.total }
        pools.forEach(({ pool, coll_total, want_total, bond_total, call, receivables, earned }) => {
          const getPrice = (token) => Price[pool[token].addr]
          total.totalValueLocked +=
            coll_total * getPrice('coll') + want_total * getPrice('want') + bond_total * getPrice('bond')
          total.totalBorrowed += coll_total * getPrice('coll')
          total.totalCollateral += bond_total * getPrice('bond')
          total.outstandingDebt += call * getPrice('want')
          total.depostBalance += call * getPrice('bond')
          total.receivables += receivables
          total.rewards += earned * Price['COLLAR']
        })
        setCount({ pools, total, timer: new Date().getTime() })
      })()
    } else {
      ;(async () => {
        const timer = new Date().getTime()
        const pools = await controller.mypage_data_noaccount()
        const total = { ...INIT.total }
        pools.forEach(({ pool, coll_total, want_total, bond_total }) => {
          const getPrice = (token) => Price[pool[token].addr]
          total.totalValueLocked +=
            coll_total * getPrice('coll') + want_total * getPrice('want') + bond_total * getPrice('bond')
          total.totalBorrowed += coll_total * getPrice('coll')
          total.totalCollateral += bond_total * getPrice('bond')
        })
        setCount((count) => (timer > count.timer ? { pools: [], total, timer: new Date().getTime() } : count))
      })()
    }
  }, [signer, update])

  return useMemo(
    () => (
      <div className={classes.root}>
        <Global {...total} />
        <hr />
        <Balance {...total} />
        <DetailTable {...{ pools, handleClick }} />
      </div>
    ),
    [count],
  )
}
