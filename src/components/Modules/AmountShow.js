import { ethers } from 'ethers'
import { useMemo, useState } from 'react'
import { makeStyles } from '@material-ui/core'
import { FloatMessage2 } from '@/components/Modules'
import { textInfo, tokenList } from '@/config'
import { Price } from '@/hooks'
import DynamicFont from 'react-dynamic-font'

const useStyles = makeStyles((theme) => ({
  root: {
    fontFamily: 'Frutiger',
    '&>div:first-child': {
      margin: '5px 0',
      height: '25px',
      display: 'flex',
      alignItems: 'center',
    },
  },
  AmountShow: {
    border: '#272727 2px solid',
    padding: '10px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    color: '#30384B',
    fontWeight: 'bold',
    '&>div': {
      maxWidth: 'calc(50vw - 85.5px)',
      '&>span': { fontSize: '2em' },
    },
    '&>span': {
      fontSize: '12px',
      marginLeft: '2px',
    },
  },
  dollar: {
    color: '#99A8C9',
    margin: '5px',
  },
}))
const format = (num, n) => ethers.utils.formatUnits(num, n || 18)

export default function AmountShow({ state: { state, token }, title, style }) {
  const classes = useStyles()
  const [anchorEl, setAnchorEl] = useState(null)
  return (
    <div className={classes.root}>
      <div>
        <span
          style={{
            fontFamily: 'Helvetica',
            fontSize: '14px',
          }}
        >
          {title.toUpperCase()}
        </span>
        <span
          style={{
            fontFamily: 'Material Icons Outlined',
            fontSize: '16px',
            marginLeft: '5px',
            color: '#B2B2B2',
          }}
          onMouseEnter={(e) => setAnchorEl(e.currentTarget)}
          onMouseLeave={() => setAnchorEl(null)}
        >
          info
        </span>
        <FloatMessage2 anchorEl={anchorEl} info={textInfo[title]} />
      </div>

      <div className={classes.AmountShow} style={style}>
        <div>
          <DynamicFont content={parseFloat(format(state.output[title], token.decimals)).toFixed(3)} />
        </div>
        <span>{token.symbol}</span>
        <span className={classes.dollar}>
          ~$
          {(token.symbol == 'CLPT'
            ? 1 * format(state.output.clpt)
            : Price[token.addr] * format(state.output[title], token.decimals)
          ).toFixed(3)}
        </span>
      </div>
    </div>
  )
}
