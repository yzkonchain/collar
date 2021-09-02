import { ethers } from 'ethers'
import { useMemo, useState } from 'react'
import { makeStyles } from '@material-ui/core'
import { FloatMessage2 } from '@/components/Modules'
import { textInfo, tokenList } from '@/config'
import { Price } from '@/hooks'

const useStyles = makeStyles({
  root: {
    fontFamily: 'Frutiger',
    display: 'flex',
    padding: '10px',
    alignItems: 'center',
  },
  main: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    color: '#30384B',
    fontWeight: 'bold',
    '&>span': {
      fontSize: '12px',
      marginLeft: '2px',
    },
  },
  dollar: {
    color: '#99A8C9',
    margin: '5px',
  },
  token: {
    fontSize: '12px',
    fontWeight: 'bold',
    fontFamily: 'Frutiger',
    color: '#30384B',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginRight: '10px',
  },
})

const format = (num, n) => ethers.utils.formatUnits(num, n || 18)

export default function AmountShow({ state: { state, token }, title, contract }) {
  const classes = useStyles()
  const [anchorEl, setAnchorEl] = useState(null)
  return (
    <div className={classes.root}>
      <div className={classes.token}>
        <img alt="" src={token.icon} style={{ width: '35px' }} />
        <span>{token.symbol}</span>
      </div>
      <div className={classes.main}>
        <div style={{ fontSize: '35px' }}>{format(state.output[title], token.decimals)}</div>
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
