import { useContext, useEffect, useState, useMemo, useReducer } from 'react'
import { makeStyles } from '@material-ui/core'
import { context, mypageDetail, mypageContext, STYLE, poolConfig } from '@/config'
import { Loading } from '@/components/Modules'
import { Price } from '@/hooks'

import Global from './Global'
import Balance from './Balance'
import DetailTable from './DetailTable/index'

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
    [STYLE.MOBILE]: {
      width: 'calc(100% - 40px)',
      padding: '0 20px',
    },
    [STYLE.PC]: {
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
}

export default function MyPage() {
  const classes = useStyles()
  const {
    state: { signer, controller },
  } = useContext(context)

  const [mypageState, setMypageState] = useReducer((o, n) => ({ ...o, ...n }), {
    loading: false,
    confirm: false,
    type: '',
    pool: { want: {}, bond: {}, coll: {}, call: {} },
    checked: {},
    update: {},
  })
  const [data, setData] = useState(INIT)
  const { pools, total } = data
  const { loading, update } = mypageState

  useEffect(
    () =>
      (async () => {
        setMypageState({ loading: true })
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
          total.rewards += earned * Price[poolConfig.collar]
        })
        setData((_data) =>
          signer || INIT === _data || (INIT !== data && total.outstandingDebt + total.receivables == 0)
            ? { pools, total }
            : _data,
        )
        setMypageState({ loading: false })
      })(),
    [signer, update],
  )

  return useMemo(
    () => (
      <mypageContext.Provider value={{ mypageState, setMypageState, data }}>
        <div className={classes.root}>
          <div className={classes.mypage}>
            <Global {...total} />
            <Balance {...total} />
            <DetailTable {...{ pools }} />
          </div>
          <Loading open={loading} />
        </div>
      </mypageContext.Provider>
    ),
    [data, mypageState],
  )
}
