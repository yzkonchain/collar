import { useReducer, useState } from 'react'
import { context } from '@/config'
import { MyNotifyProvider, Loading } from '@/components/Modules'
import Header from './components/Header'
import Navigator from './components/Navigator'

export default function App() {
  const [state, setState] = useReducer((s, ns) => ({ ...s, ...ns }), {
    menu_open: false,
    signer: null,
  })

  return (
    <context.Provider value={{ state, setState }}>
      <MyNotifyProvider>
        <div style={{ position: 'relative' }}>
          <Header />
          <Navigator />
          {/* {<Loading />} */}
        </div>
      </MyNotifyProvider>
    </context.Provider>
  )
}
