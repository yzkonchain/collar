import { useReducer, useState } from 'react'
import { MyNotifyProvider } from '@/components/Modules'
import { context, STYLE } from '@/config'
import { contract } from '@/hooks'

import Header from './components/Header'
import Navigator from './components/Navigator'

const global = { ifPC: window.innerWidth > STYLE.WIDTH }

const Root = ({ children }) => {
  const [state, setState] = useReducer((o, n) => ({ ...o, ...n }), {
    controller: contract(),
    signer: null,
    menu_open: false,
  })

  const [ifPC, setIfPC] = useState(global.ifPC)

  const handleResize = ({ target: { innerWidth: w } }) => {
    if (w > STYLE.WIDTH && !global.ifPC) {
      global.ifPC = true
      setIfPC(true)
    } else if (w < STYLE.WIDTH && global.ifPC) {
      global.ifPC = false
      setIfPC(false)
    }
  }

  window.addEventListener('resize', handleResize)

  return <context.Provider value={{ state, setState, ifPC }}>{children}</context.Provider>
}

export default function App() {
  return (
    <MyNotifyProvider>
      <Root>
        <Header />
        <Navigator />
      </Root>
    </MyNotifyProvider>
  )
}
