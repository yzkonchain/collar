import { useMemo, useState, useCallback, useContext } from 'react'
import { makeStyles } from '@material-ui/core'
import { STYLE, context, mypageContext } from '@/config'

import DetailPC from './DetailPC'
import DetailMobile from './DetailMobile'
import Confirm from './Confirm'

const useStyles = makeStyles({
  root: {
    fontFamily: 'Gillsans',
    color: 'white',
    '&>div': {
      marginBottom: '40px',
    },
  },
  header: {
    display: 'flex',
    marginBottom: '15px',
    '&>div:first-child': {
      display: 'flex',
      alignItems: 'center',
      fontSize: '20px',
      margin: '10px 0',
      '&>img': {
        width: '30px',
        '&:nth-child(2)': {
          position: 'relative',
          left: '-10px',
        },
      },
      '&>span': {},
    },
    '&>div:last-child': {
      backgroundColor: '#2D4284',
      borderRadius: '20px',
      padding: '5px 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    [STYLE.MOBILE]: {
      flexDirection: 'column',
    },
    [STYLE.PC]: {
      justifyContent: 'space-between',
      alignItems: 'center',
    },
  },
})

const Detail = (props) => (
  <div>
    <DetailPC {...props} />
    <DetailMobile {...props} />
  </div>
)

export default function DetailTable({ pools }) {
  const {
    state: { signer, controller },
  } = useContext(context)
  const {
    mypageState: { confirm, type, pool, checked },
    setMypageState: set,
  } = useContext(mypageContext)
  const classes = useStyles()

  const handleClick = async (type, pool) => {
    set({ loading: true })
    if (!signer) controller.notify('noaccount')
    else {
      const checked = await controller.mypage_check(type, pool)
      if (checked) set({ confirm: true, type, pool, checked })
    }
    set({ loading: false })
  }

  return useMemo(
    () => (
      <div className={classes.root}>
        {pools.map((val, key) => {
          const pool = val.pool
          return (
            <div key={key}>
              <div className={classes.header}>
                <div>
                  <img src={pool.bond.icon} />
                  <img src={pool.want.icon} />
                  <span>
                    {pool.bond.symbol}/{pool.want.symbol}
                  </span>
                </div>
                <div>
                  <span>Expiry: {new Date(pool.expiry_time * 1000).toLocaleString()}</span>
                </div>
              </div>
              <Detail {...{ pool, val, handleClick }} />
            </div>
          )
        })}
        <Confirm
          open={confirm}
          {...{ type, pool, pools, checked }}
          onClose={() => set({ confirm: false })}
          handleClick={async () => {
            set({ confirm: false })
            ;(await controller[type].call(controller, pool)) && set({ update: {} })
          }}
        />
      </div>
    ),
    [pools, confirm, type, pool],
  )
}
