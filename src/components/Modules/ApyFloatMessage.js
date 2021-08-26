import { useState } from 'react'
import { FloatMessage2 } from '.'

export default function ApyFloatMessage({ apy, info }) {
  const [anchorEl, setAnchorEl] = useState(null)
  return (
    <div
      style={{
        margin: '10px 0',
        fontFamily: 'Helvetica',
        fontSize: '14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
      }}
    >
      <span>APY = {apy}%</span>
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
      <FloatMessage2 {...{ anchorEl, info }} />
    </div>
  )
}
