import { useState } from 'react'
import { makeStyles } from '@material-ui/core'
import DynamicFont from 'react-dynamic-font'
import { textInfo, STYLE } from '@/config'
import { FloatMessage2 } from '@/components/Modules'

const useStyles = makeStyles({
  root: {
    color: 'white',
    fontFamily: 'Frutiger',
    '&>hr': {
      border: '#3B54A0 1px solid',
      width: '100%',
      margin: '20px 0',
    },
  },
  header: {
    display: 'flex',
    fontSize: '25px',
    alignItems: 'center',
    marginBottom: '20px',
  },
  data: {
    display: 'flex',
    [STYLE.MOBILE]: {
      justifyContent: 'space-between',
    },
    [STYLE.PC]: {
      flexDirection: 'column',
    },
  },
  totalValue: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '20px',
    '&>div:first-child': {
      fontSize: '20px',
      display: 'flex',
      alignItems: 'center',
      marginBottom: '5px',
    },
    '&>div:last-child': {
      [STYLE.MOBILE]: {
        fontSize: '25px',
      },
      [STYLE.PC]: {
        fontSize: '40px',
      },
    },
  },
  globalValue: {
    display: 'flex',
    [STYLE.MOBILE]: {
      width: '40%',
      flexDirection: 'column',
    },
    [STYLE.PC]: {
      justifyContent: 'space-between',
    },
  },
  globalValueInfo: {
    [STYLE.MOBILE]: {
      marginBottom: '10px',
    },
    [STYLE.PC]: {
      width: '48%',
    },
    '&>div:first-child span': {
      fontSize: '20px',
      color: '#7B96EB',
      marginBottom: '5px',
    },
    '&>div:last-child': {
      display: 'flex',
      alignItems: 'center',
      backgroundColor: '#111C3C',
      padding: '5px 10px',
    },
  },
})

const dec = {
  tvl: 3,
  tb: 3,
  tc: 3,
}

export default function Global({ totalValueLocked, totalBorrowed, totalCollateral }) {
  const classes = useStyles()
  const [anchorEl, setAnchorEl] = useState(null)

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <span className="material-icons-outlined">language</span>
        <span>Global</span>
      </div>
      <div className={classes.data}>
        <div className={classes.totalValue}>
          <div>
            <span style={{ color: '#7B96EB' }}>Total Value Locked</span>
            <span
              style={{
                fontFamily: 'Material Icons Outlined',
                fontSize: '18px',
                marginLeft: '5px',
                color: '#B2B2B2',
              }}
              onMouseEnter={({ currentTarget: e }) => setAnchorEl(e)}
              onMouseLeave={() => setAnchorEl(null)}
            >
              info
            </span>
            <FloatMessage2 anchorEl={anchorEl} info={textInfo['TotalValueLocked']} />
          </div>
          <div>$ {parseFloat(totalValueLocked || 0).toFixed(dec.tvl)}</div>
        </div>

        <div className={classes.globalValue}>
          <div className={classes.globalValueInfo}>
            <div>
              <DynamicFont content="Total Borrowed" />
            </div>
            <div>
              <DynamicFont content={`$ ${parseFloat(totalBorrowed || 0).toFixed(dec.tb)}`} />
            </div>
          </div>
          <div className={classes.globalValueInfo}>
            <div>
              <DynamicFont content="Total Collateral" />
            </div>
            <div>
              <DynamicFont content={`$ ${parseFloat(totalCollateral || 0).toFixed(dec.tc)}`} />
            </div>
          </div>
        </div>
      </div>
      <hr />
    </div>
  )
}
