import { useState, useCallback, useMemo, useRef, useEffect, useContext } from 'react'
import ReactEcharts from 'echarts-for-react'
import { makeStyles, withStyles, FormControl, NativeSelect, InputBase, CircularProgress } from '@material-ui/core'
import { proContext } from '@/config'
import { FloatMessage2 } from '@/components/Modules'

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  title: {
    color: '#7B96EB',
    fontFamily: 'Gillsans',
    fontSize: '21px',
    display: 'flex',
    alignItems: 'center',
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
    height: '300px',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
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

export default function TotalLiquidity({ period, setPeriod, handleChange }) {
  const classes = useStyles()
  const [anchorEl, setAnchorEl] = useState(null)
  const [loading, setLoading] = useState(true)
  const {
    proState: { totalLiquidity },
  } = useContext(proContext)

  useEffect(() => {
    if (totalLiquidity.series) setLoading(false)
  }, [totalLiquidity])

  return (
    <div className={classes.root}>
      <div className={classes.title}>
        <div>
          <span style={{ marginRight: '5px' }}>Total Liquidity</span>
          <span
            className={classes.symbol}
            onMouseEnter={(e) => setAnchorEl(e.currentTarget)}
            onMouseLeave={() => setAnchorEl(null)}
          >
            info
          </span>
          <FloatMessage2 anchorEl={anchorEl} info={'Total Liquidity'} />
        </div>

        <FormControl className={classes.time}>
          <NativeSelect
            value={period['totalLiquidity']}
            onChange={({ target: { value: e } }) => {
              setPeriod({ ...period, totalLiquidity: e })
              setLoading(true)
              handleChange(e, 'totalLiquidity')
            }}
            input={<BootstrapInput />}
          >
            <option value={'12h'}>12 hours</option>
            <option value={'24h'}>24 hours</option>
            <option value={'7d'}>Weekly</option>
            <option value={'1m'}>Monthly</option>
          </NativeSelect>
        </FormControl>
      </div>
      <div className={classes.content}>
        {loading ? (
          <CircularProgress color="primary" size={80} />
        ) : (
          <ReactEcharts option={totalLiquidity} style={{ height: '100%', width: '100%' }} />
        )}
      </div>
    </div>
  )
}
