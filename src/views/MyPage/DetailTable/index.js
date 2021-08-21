import { useContext } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { poolList, context, mypageContext } from '@/config'
import DetailPC from './DetailPC'
import DetailMobile from './DetailMobile'

const useStyles = makeStyles({
  root: {
    fontFamily: 'Gillsans',
    color: 'white',
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
    '@media screen and (max-width:960px)': {
      flexDirection: 'column',
    },
    '@media screen and (min-width:960px)': {
      justifyContent: 'space-between',
      alignItems: 'center',
    },
  },
})

export default function DetailTable({ pools }) {
  const classes = useStyles()
  const {
    state: { signer },
  } = useContext(context)
  const { handleClick } = useContext(mypageContext)

  return (
    <div className={classes.root}>
      {pools.map((val, key) => {
        const pool = poolList[val.pool]
        return (
          <div key={key} style={{ marginBottom: '40px' }}>
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
            <DetailPC {...{ pool, val, handleClick }} />
            <DetailMobile {...{ pool, val, handleClick }} />
          </div>
        )
      })}
    </div>
  )
}
