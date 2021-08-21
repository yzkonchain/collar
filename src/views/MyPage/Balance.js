import { useContext, useMemo } from 'react'
import { context } from '@/config'
import { makeStyles, withStyles } from '@material-ui/core/styles'
import DynamicFont from 'react-dynamic-font'

const useStyles = makeStyles({
  root: {
    '&>div:first-child': {
      fontSize: '25px',
      fontFamily: 'Gillsans',
      color: '#fff',
      marginBottom: '10px',
    },
    '&>div:last-child': {
      display: 'flex',
      justifyContent: 'space-between',
      '&>div': {
        display: 'flex',
        width: 'calc(50% - 10px)',
        justifyContent: 'space-between',
        '&>div': {
          width: 'calc(50% - 10px)',
        },
      },
      '@media screen and (max-width:960px)': {
        flexDirection: 'column',
        '&>div': {
          width: '100%',
        },
      },
    },
  },
})

const dec = {
  debt: 3,
  balance: 3,
  recv: 3,
  rewards: 3,
}

const MyDiv = withStyles({
  root: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    '&>div': {
      position: 'relative',
      backgroundColor: 'white',
      boxSizing: 'border-box',
      border: '#4C4C4C 3px solid',
    },
  },
  main: {
    zIndex: '4',
    width: '100%',
    padding: '15px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  second: {
    zIndex: '2',
    transform: 'translateY(-11px)',
    height: '15px',
    width: 'calc(100% - 20px)',
  },
  third: {
    zIndex: '1',
    transform: 'translateY(-22px)',
    height: '15px',
    width: 'calc(100% - 40px)',
  },
})(({ classes, title, remarks, amount, token, color }) => {
  return (
    <div className={classes.root}>
      <div className={classes.main}>
        <div style={{ color: '#30384B', fontSize: '16px', fontFamily: 'Helvetica' }}>
          <DynamicFont content={title} />
        </div>
        <div style={{ color: '#A3B7E4', fontSize: '10px', fontFamily: 'Helvetica', marginBottom: '10px' }}>
          <DynamicFont content={remarks} />
        </div>
        <div style={{ color: color || '#30384B', fontSize: '18px', fontWeight: 'bold' }}>
          <DynamicFont content={amount} />
        </div>
        <span style={{ color: '#30384B', fontSize: '15px', fontWeight: 'bold' }}>{token}</span>
      </div>
      <div className={classes.second}></div>
      <div className={classes.third}></div>
    </div>
  )
})

export default function Balance(props) {
  const classes = useStyles()
  const { state } = useContext(context)
  const { outstandingDebt, depostBalance, receivables, rewards } = props
  return useMemo(
    () =>
      state.signer ? (
        <div className={classes.root}>
          <div>Your Balance</div>
          <div>
            <div>
              <MyDiv
                title="Outstanding Debt"
                remarks="*Value of Borrowed Asset"
                amount={(outstandingDebt || 0).toFixed(dec.debt)}
                token="USD"
              />
              <MyDiv
                title="Depost Balance"
                remarks="*Value of Collateral"
                amount={(depostBalance || 0).toFixed(dec.balance)}
                token="USD"
              />
            </div>
            <div>
              <MyDiv
                title="Receivables"
                remarks="*Value of Lent Asset"
                amount={(receivables || 0).toFixed(dec.recv)}
                token="USD"
              />
              <MyDiv
                title="Rewards"
                remarks="*Value of Claimable COLLAR"
                amount={(rewards || 0).toFixed(dec.rewards)}
                token="COLLAR"
                color="#4975FF"
              />
            </div>
          </div>
        </div>
      ) : (
        <div></div>
      ),
    [props],
  )
}
