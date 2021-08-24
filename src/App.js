import { useReducer, useState } from 'react'
import { context } from '@/config'
import { contract } from '@/hooks'
import { MyNotifyProvider } from '@/components/Modules'
import Header from './components/Header'
import Navigator from './components/Navigator'

const Root = ({ children }) => {
  const CT = contract()
  const [state, setState] = useReducer((o, n) => ({ ...o, ...n }), {
    CT,
    controller: CT(),
    signer: null,
    menu_open: false,
  })
  return <context.Provider value={{ state, setState }}>{children}</context.Provider>
}

export default function App() {
  return (
    <MyNotifyProvider>
      <Root>
        <div style={{ position: 'relative' }}>
          <Header />
          <Navigator />
        </div>
      </Root>
    </MyNotifyProvider>
  )
}
