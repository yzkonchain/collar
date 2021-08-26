import { makeStyles } from '@material-ui/core'
import DynamicFont from 'react-dynamic-font'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    paddingBottom: '20px',
    marginBottom: '10px',
    '&>div>hr': {
      position: 'absolute',
      width: '100%',
      bottom: 0,
      border: 'none',
      borderTop: 'white 1px solid',
    },
  },
  title: {
    fontFamily: 'Frutiger',
    color: 'white',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: '5px 0',
    '& span:last-child': {
      backgroundColor: '#4976FF',
      padding: '0px 5px',
      height: '20px',
      lineHeight: '20px',
    },
  },
  amount: {
    width: '100%',
    fontFamily: 'Frutiger',
    fontSize: '1.5em',
    marginTop: '5px',
    color: 'white',
    textAlign: 'left',
  },
}))

export default function InfoCard1(props) {
  const classes = useStyles()
  const { token, status, amount } = props

  return (
    <div className={classes.root}>
      <div className={classes.title}>
        <span style={{ fontSize: '0.9em' }}>{token}</span>
        <span style={{ fontSize: '0.6em' }}>{status}</span>
      </div>
      <div className={classes.amount}>
        <DynamicFont content={parseFloat(amount).toFixed(3)} />
      </div>
      <div>
        <hr />
      </div>
    </div>
  )
}
