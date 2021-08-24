import { ethers } from 'ethers'
import { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import { makeStyles, withStyles, TextField, Tabs, Tab } from '@material-ui/core'
import { iconInfo } from '@/assets/svg'
import { FloatMessage2 } from '@/components/Modules'
import { textInfo } from '@/config'
import { Price } from '@/hooks'
import { useSnackbar } from 'notistack'

const useStyles = makeStyles((theme) => ({
  AmountInput: {
    border: '#272727 2px solid',
    padding: '10px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    position: 'relative',
    '& input': {
      fontFamily: 'Gillsans',
      padding: '0',
      margin: '0 5px 0 0',
      fontSize: (props) => props.fontSize,
      fontWeight: 'bold',
      border: 'none',
      width: '100%',
      color: '#30384B',
    },
    '& button': {
      fontFamily: 'Gillsans',
      fontSize: '0.8em',
      color: 'white',
      background: '#30384B',
      border: 'none',
      padding: '2px 5px',
      position: 'relative',
      '&[disabled]': {
        background: '#d4d4d4',
      },
      '&>span': {
        fontFamily: 'Helvetica',
        position: 'absolute',
        transform: 'translate(-32px,-16px)',
        color: '#30384B',
        fontSize: '10px',
      },
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
    fontFamily: 'Gillsans',
    fontSize: '12px',
    fontWeight: 'bold',
    color: '#30384B',
    marginLeft: '2px',
  },
  dollar: {
    color: '#99A8C9',
    margin: '5px',
    fontWeight: 'bold',
    fontFamily: 'Gillsans',
    fontSize: '12px',
  },
}))
const format = (num, n) => ethers.utils.formatUnits(num, n || 18)
const parse = (num, n) => ethers.utils.parseUnits(num || '0', n || 18)

const MyTabs = withStyles({
  root: {
    minHeight: '0',
  },
  flexContainer: {
    margin: '5px 0',
    height: '25px',
    '&>button': {
      minHeight: '0',
      minWidth: '0',
      padding: '0',
      marginRight: '15px',
      border: 'none !important',
      fontFamily: 'Helvetica',
      fontSize: '0.8em',
      textTransform: 'uppercase',
      '&>span': {
        alignItems: 'start',
      },
    },
  },
  indicator: {
    display: 'none',
  },
})((props) => {
  const [anchorEl, setAnchorEl] = useState({})
  return (
    <div style={{ position: 'relative' }}>
      <Tabs {...props}>
        {props.labels.map((v, k) => (
          <Tab
            disableRipple
            key={k}
            classes={{ selected: makeStyles({ s: { fontWeight: 'bold', color: '#275bff' } })().s }}
            label={
              <div>
                <span style={{ verticalAlign: 'middle' }}>{v}</span>
                <img
                  onMouseEnter={(e) => setAnchorEl({ [k]: e.currentTarget })}
                  onMouseLeave={() => setAnchorEl({})}
                  alt=""
                  src={iconInfo}
                  style={{ width: '14px', marginLeft: '5px', verticalAlign: 'middle' }}
                />
                <FloatMessage2 anchorEl={anchorEl[k]} info={props.info[k]} />
              </div>
            }
          />
        ))}
      </Tabs>
    </div>
  )
})

const MyInput = ({ state, setState, title, max, if_max, token, style }) => {
  const [fontSize, setFontSize] = useState(35)
  const classes = useStyles({ fontSize })
  const inputRef = useRef()
  const { enqueueSnackbar } = useSnackbar()
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
        if (max.lt(parse(value))) {
          enqueueSnackbar({ type: 'failed', title: 'Fail.', message: 'Maximum range exceeded.' })
          return
        }
        setState({ I: { ...state.I, [title]: value }, old: { ...state.old, [title]: old } })
      }
    },
    [state.I, title],
  )
  useEffect(() => {
    const [_new, _old] = [state.I[title], state.old[title]]
    const { offsetWidth: o, scrollWidth: s } = inputRef.current
    if (_new.length > (_old || '').length && o != s && fontSize >= 8) setFontSize(fontSize * 0.91)
    else if (_new.length < (_old || '').length && o >= s && fontSize < 35) setFontSize(fontSize * 1.1)
  }, [fontSize, state.I, title])

  return (
    <div className={classes.AmountInput} style={style}>
      <div className={classes.amount}>
        <TextField
          value={state.I[title]}
          onChange={changInput}
          inputRef={inputRef}
          placeholder="0.00"
          InputProps={{
            endAdornment: (
              <button
                onClick={() =>
                  setState({
                    I: {
                      ...state.I,
                      [title]: `${format(max, token.decimals)}`,
                    },
                  })
                }
                disabled={!if_max}
              >
                MAX
                <span>balance</span>
              </button>
            ),
          }}
        ></TextField>
      </div>
      <span className={classes.token}>{token.symbol}</span>
      <span className={classes.dollar}> ~${(Price[token.addr] * state.I[title]).toFixed(3)}</span>
    </div>
  )
}

export default function AmountInputDouble({ State, title, style }) {
  const [tabs, setTabs] = useState(0)
  const { state, setState, token, max, if_max } = State
  return useMemo(
    () => (
      <div>
        <MyTabs value={tabs} onChange={(_, v) => setTabs(v)} labels={title} info={title.map((val) => textInfo[val])} />
        <MyInput
          {...{
            title: title[tabs],
            token: token[tabs],
            if_max: if_max[tabs],
            max: max[tabs],
            tabs,
            state,
            setState,
            style,
          }}
        />
      </div>
    ),
    [State, tabs],
  )
}
