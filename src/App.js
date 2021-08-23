import { useReducer, useState } from 'react'
import { context } from '@/config'
import { MyNotifyProvider } from '@/components/Modules'
import Header from './components/Header'
import Navigator from './components/Navigator'

export default function App() {
  const [state, setState] = useReducer((o, n) => ({ ...o, ...n }), {
    menu_open: false,
    signer: null,
  })

  return (
    <context.Provider value={{ state, setState }}>
      <MyNotifyProvider>
        <div style={{ position: 'relative' }}>
          <Header />
          <Navigator />
        </div>
      </MyNotifyProvider>
    </context.Provider>
  )
}
