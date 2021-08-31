import { ethers } from 'ethers'
import { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import { makeStyles, TextField } from '@material-ui/core'
import { balanceMax, balanceMaxDisabled } from '@/assets/svg'
import { Price } from '@/hooks'

const useStyles = makeStyles({
  root: {
    display: 'flex',
    padding: '10px',
    alignItems: 'center',
  },
  main: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    position: 'relative',
    fontFamily: 'Frutiger',
    width: '100%',
    '& input': {
      padding: '0',
      margin: '0 5px 0 0',
      fontSize: ({ fontSize }) => `${fontSize}px`,
      fontWeight: 'bold',
      border: 'none',
      width: '100%',
      color: '#30384B',
    },
  },
  amount: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    '&>div': {
      width: '100%',
      '&>div': {
        '&:before,&:after,&:hover:not(.Mui-disabled):before': {
          border: 'none',
        },
      },
    },
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
  dollar: {
    color: '#99A8C9',
    margin: '5px',
    fontWeight: 'bold',
    fontSize: '12px',
  },
})

const format = (num, n) => ethers.utils.formatUnits(num, n || 18)
const parse = (num, n) => ethers.utils.parseUnits(num || '0', n || 18)

export default function AmountInput({ State, title }) {
  const [fontSize, setFontSize] = useState(35)
  const classes = useStyles({ fontSize })
  const { state, setState, token, max, if_max } = State
  const inputRef = useRef()

  const changInput = useCallback(
    ({ target: { value }, nativeEvent: { data } }) => {
      if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', null].indexOf(data) > -1) {
        const old = state.I[title]
        if (
          (data === '.' && (value.length === 1 || old.indexOf('.') !== -1)) ||
          (old === '0' && ['.', null].indexOf(data) === -1) ||
          (value.indexOf('.') == -1 ? 0 : value.length - value.indexOf('.') - 1) > token.decimals
        )
          return
        setState({ I: { ...state.I, [title]: value }, old: { ...state.old, [title]: old } })
      }
    },
    [state.I, max],
  )

  useEffect(() => {
    const [_new, _old] = [state.I[title], state.old[title]]
    const { offsetWidth: o, scrollWidth: s } = inputRef.current
    if (_new.length > (_old || '').length && o < s - 1 && fontSize >= 8) setFontSize(fontSize * 0.91)
    else if (_new.length < (_old || '').length && o >= s && fontSize < 35) setFontSize(fontSize * 1.1)
  }, [fontSize, state.I[title]])

  return useMemo(
    () => (
      <div className={classes.root}>
        <div className={classes.token}>
          <img alt="" src={token.icon} style={{ width: '35px' }} />
          <span>{token.symbol}</span>
        </div>
        <div className={classes.main}>
          <div className={classes.amount}>
            <TextField
              value={state.I[title]}
              onChange={changInput}
              inputRef={inputRef}
              placeholder="0.00"
              InputProps={{
                endAdornment: (
                  <img
                    alt=""
                    src={if_max ? balanceMax : balanceMaxDisabled}
                    onClick={
                      if_max
                        ? () => {
                            setState({
                              I: {
                                ...state.I,
                                [title]: `${format(max, token.decimals)}`,
                              },
                            })
                          }
                        : () => {}
                    }
                    style={{ width: '60px' }}
                  />
                ),
              }}
            ></TextField>
          </div>
          <span className={classes.dollar}>~${(Price[token.addr] * state.I[title]).toFixed(3)}</span>
        </div>
      </div>
    ),
    [State],
  )
}
