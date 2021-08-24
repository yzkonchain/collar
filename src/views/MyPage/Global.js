import { useState } from 'react'
import { makeStyles } from '@material-ui/core'
import DynamicFont from 'react-dynamic-font'
import { textInfo, STYLE } from '@/config'
import { FloatMessage2 } from '@/components/Modules'
import { iconInfo, GlobalIcon } from '@/assets/svg'

const useStyles = makeStyles({
  root: {
    color: 'white',
    fontFamily: 'Gillsans',
    '&>hr': {
      border: '#3B54A0 1px solid',
      width: '100%',
      margin: '20px 0',
    },
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '25px',
    marginBottom: '20px',
    '&>img': {
      width: '20px',
      marginRight: '5px',
    },
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
      '&>span': { color: '#7B96EB', marginRight: '5px' },
      '&>img': {
        width: '16px',
      },
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
        <img src={GlobalIcon} alt="" />
        <span>Global</span>
      </div>
      <div className={classes.data}>
        <div className={classes.totalValue}>
          <div>
            <span>Total Value Locked</span>
            <img
              src={iconInfo}
              alt=""
              onMouseEnter={({ currentTarget: e }) => setAnchorEl(e)}
              onMouseLeave={() => setAnchorEl(null)}
            />
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
