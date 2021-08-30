import { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import { makeStyles, withStyles, FormControl, NativeSelect, InputBase } from '@material-ui/core'
import { FloatMessage2 } from '@/components/Modules'

const useStyles = makeStyles({
  root: {
    marginBottom: '30px',
    width: '100%',
  },
  title: {
    color: '#7B96EB',
    fontFamily: 'Gillsans',
    fontSize: '21px',
    display: 'flex',
    alignItems: 'center',
    marginBottom: '30px',
    justifyContent: 'space-between',
  },
  symbol: {
    fontFamily: 'Material Icons Outlined',
    fontSize: '18px',
    color: '#B2B2B2',
  },
  time: {
    '& option': {
      backgroundColor: '#000 !important',
      borderTop: 'none',
    },
  },
  content: {
    height: '200px',
    background: '#fff',
  },
})

const BootstrapInput = withStyles({
  root: {},
  input: {
    color: '#fff',
    borderRadius: 10,
    position: 'relative',
    border: '1px solid #979797',
    fontSize: 16,
    padding: '3px 10px',
    '&:focus': {
      borderRadius: 10,
      backgroundColor: '#000',
    },
  },
})(InputBase)

export default function TotalLockedValue() {
  const classes = useStyles()
  const [anchorEl, setAnchorEl] = useState(null)

  const [age, setAge] = useState('')

  return (
    <div className={classes.root}>
      <div className={classes.title}>
        <div>
          <span style={{ marginRight: '5px' }}>Total Locked Value</span>
          <span
            className={classes.symbol}
            onMouseEnter={(e) => setAnchorEl(e.currentTarget)}
            onMouseLeave={() => setAnchorEl(null)}
          >
            info
          </span>
          <FloatMessage2 anchorEl={anchorEl} info={'Total Locked Value'} />
        </div>

        <FormControl className={classes.time}>
          <NativeSelect value={age} onChange={({ target: { value: e } }) => setAge(e)} input={<BootstrapInput />}>
            <option value={1}>12 hours</option>
            <option value={2}>24 hours</option>
            <option value={3}>Weekly</option>
            <option value={4}>Monthly</option>
          </NativeSelect>
        </FormControl>
      </div>
      <div className={classes.content}></div>
    </div>
  )
}
