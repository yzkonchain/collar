import { useRef, useEffect, useMemo } from 'react'
import ReactEcharts from 'echarts-for-react'

export default function Diagram({ data }) {
  const echartsRef = useRef()
  if (echartsRef.current) {
    echartsRef.current.getEchartsInstance().setOption(data)
  }

  return (
    <div style={{ height: '60px', width: '120px' }}>
      <ReactEcharts ref={echartsRef} option={data} style={{ height: '100%', width: '100%' }} />
    </div>
  )
}
