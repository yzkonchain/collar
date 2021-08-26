import { useReducer, useState } from 'react'
import { MyNotifyProvider } from '@/components/Modules'
import { context } from '@/config'
import { contract } from '@/hooks'

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
        <Header />
        <Navigator />
      </Root>
    </MyNotifyProvider>
  )
}
