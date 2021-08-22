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
      fontSize: '30px',
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

const dec = {
  tvl: 3,
  tb: 3,
  tc: 3,
}

export default function Global({ totalValueLocked, totalBorrowed, totalCollateral, signer }) {
  const classes = useStyles()
  const [anchorEl, setAnchorEl] = useState(null)

  return (
    <div className={classes.root} style={{ height: signer ? '100%' : 'calc(100vh)' }}>
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
      {/* <div style={{ height: signer ? 0 : 'calc(100vh - 300px)' }}></div> */}
    </div>
  )
}
