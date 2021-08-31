import { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import ReactEcharts from 'echarts-for-react'
import * as echarts from 'echarts'
import { makeStyles, withStyles, FormControl, NativeSelect, InputBase } from '@material-ui/core'
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

const getOtion = {
  grid: {
    right: 0,
  },
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    boundaryGap: false,
    axisLabel: {
      color: '#fff',
      interval: 0,
      rotate: 30,
    },
    axisTick: { show: false },
  },
  yAxis: {
    type: 'value',
    axisLine: { show: true },
    splitLine: {
      show: true,
      lineStyle: {
        type: 'dashed',
        color: 'grey',
      },
    },
    axisLabel: {
      color: '#fff',
      formatter(v) {
        const texts = []
        if (v < 1000) texts.push(v)
        else texts.push(v / 1000 + 'k')
        return texts
      },
    },
  },
  series: [
    {
      data: [1500, 2300, 2240, 2180, 1350, 1407, 2600],
      type: 'line',
      symbol: 'none',
      lineStyle: { color: '#59FFAD' },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: 'rgba(73,255,199,1)',
          },
          {
            offset: 1,
            color: 'rgba(128,255,229,0)',
          },
        ]),
      },
    },
  ],
}

export default function TotalLiquidity() {
  const classes = useStyles()
  const [anchorEl, setAnchorEl] = useState(null)
  const [time, setTime] = useState('')

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
          <NativeSelect value={time} onChange={({ target: { value: e } }) => setTime(e)} input={<BootstrapInput />}>
            <option value={1}>12 hours</option>
            <option value={2}>24 hours</option>
            <option value={3}>Weekly</option>
            <option value={4}>Monthly</option>
          </NativeSelect>
        </FormControl>
      </div>
      <div className={classes.content}>
        <ReactEcharts option={getOtion} style={{ height: '100%', width: '100%' }} />
      </div>
    </div>
  )
}
