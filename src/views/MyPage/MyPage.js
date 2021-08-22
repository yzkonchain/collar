import { useContext, useEffect, useState, useMemo } from 'react'
import { context, mypageDetail } from '@/config'
import { makeStyles } from '@material-ui/core/styles'
import { Price, contract } from '@/hooks'
import { Loading } from '@/components/Modules'
import { Global, Balance, DetailTable } from '.'

const useStyles = makeStyles({
  root: {
    position: 'relative',
    paddingTop: '30px',
    height: 'inherit',
  },
  mypage: {
    display: 'flex',
    flexDirection: 'column',
    margin: 'auto',
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
  pools: mypageDetail,
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
  const [loading, setLoading] = useState(false)
  const [update, setUpdate] = useState({})
  const [count, setCount] = useState(INIT)
  const { pools, total } = count

  const handleClick = async (type, pool) => {
    if (await controller[type](pool)) setUpdate({})
  }

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      const timer = new Date().getTime()
      const pools = signer ? await controller.mypage_data() : await controller.mypage_data_noaccount()
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
      setCount((count) => {
        if (timer > count.timer) {
          setLoading(false)
          return { pools, total, timer: new Date().getTime() }
        } else return count
      })
    })()
  }, [signer, update])

  return useMemo(
    () => (
      <div className={classes.root}>
        <div className={classes.mypage}>
          <Global {...total} />
          <Balance {...total} />
          <DetailTable {...{ pools, handleClick }} />
        </div>
        {loading && <Loading />}
      </div>
    ),
    [count, loading],
  )
}
