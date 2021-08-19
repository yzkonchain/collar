import { makeStyles } from '@material-ui/core/styles'
import { useState } from 'react'
import { iconInfo, GlobalIcon } from '@/assets/svg'
import { textInfo } from '@/config'
import { FloatMessage2 } from '@/components/Modules'
import DynamicFont from 'react-dynamic-font'

const useStyles = makeStyles({
  root: {
    color: 'white',
    fontFamily: 'Gillsans',
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
    '@media screen and (max-width:960px)': {
      justifyContent: 'space-between',
    },
    '@media screen and (min-width:960px)': {
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
      fontSize: '35px',
    },
  },
  globalValue: {
    display: 'flex',
    '@media screen and (max-width:960px)': {
      width: '40%',
      flexDirection: 'column',
    },
    '@media screen and (min-width:960px)': {
      justifyContent: 'space-between',
    },
  },
  globalValueInfo: {
    '@media screen and (max-width:960px)': {
      marginBottom: '10px',
    },
    '@media screen and (min-width:960px)': {
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

export default function Global({ totalValueLocked, totalBorrowed, totalCollateral }) {
  const classes = useStyles()
  const [anchorEl, setAnchorEl] = useState({ totalValue: null })

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
              onMouseEnter={(e) => setAnchorEl({ totalValue: e.currentTarget })}
              onMouseLeave={() => setAnchorEl({ totalValue: null })}
            />
            <FloatMessage2 anchorEl={anchorEl['totalValue']} info={textInfo['TotalValueLocked']} />
          </div>
          <div>${totalValueLocked || 0}</div>
        </div>

        <div className={classes.globalValue}>
          <div className={classes.globalValueInfo}>
            <div>
              <DynamicFont content="Total Borrowed" />
            </div>
            <div>
              <DynamicFont content={`$${totalBorrowed || 0}`} />
            </div>
          </div>
          <div className={classes.globalValueInfo}>
            <div>
              <DynamicFont content="Total Collateral" />
            </div>
            <div>
              <DynamicFont content={`$${totalCollateral || 0}`} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
