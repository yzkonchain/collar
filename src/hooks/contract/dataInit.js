const echartsData = {
  grid: {
    right: 0,
  },
  tooltip: {
    trigger: 'axis',
  },
  xAxis: {
    type: 'category',
    data: [],
    axisLabel: { color: '#fff', interval: 2 },
    axisTick: { show: false },
  },
  yAxis: {
    type: 'value',
    min: 'dataMin',
    max: 'dataMax',
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
        switch (true) {
          case v < parseFloat('1e3'):
            texts.push(parseFloat(v).toFixed(1))
            break
          case v < parseFloat('1e6'):
            texts.push(parseInt(v / 1000) + 'K')
            break
          case v < parseFloat('1e9'):
            texts.push(parseInt(v / 1000000) + 'M')
            break
          case v < parseFloat('1e12'):
            texts.push(parseInt(v / 1000000) + 'G')
            break
          case v < parseFloat('1e15'):
            texts.push(parseInt(v / 1000000) + 'T')
            break
          default:
            texts.push(v)
            break
        }
        return texts
      },
    },
  },
  series: [
    {
      data: [],
      type: 'line',
      showSymbol: false,
      lineStyle: { color: '#59FFAD' },
    },
  ],
}

export { echartsData }
