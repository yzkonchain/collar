import { useContext, useState } from 'react'
import { HashRouter as Router, Route, Link, Switch } from 'react-router-dom'
import { makeStyles, Drawer, List, ListItem } from '@material-ui/core'
import { context } from '@/config'
import { LiteIcon, TermIcon, ProIcon, MypageIcon, CloseMenuIcon } from '@/assets/svg'

import Lite from '@/views/Lite'
import MyPage from '@/views/MyPage'
import Faucet from '@/views/Faucet'
import Term from '@/views/Term'
import Pro from '@/views/Pro'

const useStyles = makeStyles((theme) => ({
  drawer: {
    '&>div': {
      display: 'flex',
      flexDirection: 'row',
      background: 'none',
      border: 'none',
      zIndex: '9999',
    },
  },
  listItem: {
    flexDirection: 'column',
  },
  icon: {
    margin: '8px 0',
  },
  fontSpan: {
    fontFamily: 'Frutiger',
    margin: '0 0',
    color: 'white',
    fontSize: '18px',
  },
  blurbg: {
    '&, &:before': {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0,0,0,0.5)',
      zIndex: '9998',
    },
    '&:after': {
      filter: 'blur(15px) brightness(110%)',
    },
  },
}))

const MyListItem = ({ onClick, item, icon, cur }) => {
  const classes = useStyles()
  return (
    <ListItem
      button
      onClick={onClick}
      key={item}
      to={`/${item.toLowerCase()}`}
      component={Link}
      className={classes.listItem}
      style={{ backgroundColor: cur == item.toLowerCase() ? '#1E2C57' : '#4C76F9', marginBottom: '20px' }}
    >
      <img src={icon} className={classes.icon} alt="" />
      <span className={classes.fontSpan}>{item}</span>
    </ListItem>
  )
}
const MyListItemUrl = ({ url, item, icon }) => {
  const classes = useStyles()
  return (
    <ListItem
      button
      onClick={() => (window.location.href = url)}
      className={classes.listItem}
      style={{ backgroundColor: '#4C76F9', marginBottom: '20px' }}
    >
      <img src={icon} className={classes.icon} alt="" />
      <span className={classes.fontSpan}>{item}</span>
    </ListItem>
  )
}

export default function Navigator() {
  const classes = useStyles()
  const {
    state: { menu_open, signer },
    setState,
  } = useContext(context)
  const [curpage, setCurpage] = useState(window.location.hash.slice(2) || 'lite')
  const changePage = (item) => {
    setCurpage(item)
    setState({ menu_open: false })
  }
  return (
    <Router>
      <Drawer variant="persistent" anchor="left" open={menu_open} className={classes.drawer}>
        <div style={{ width: '30vw', backgroundColor: '#4975FF' }}>
          <div
            style={{ display: 'flex', minHeight: '56px', justifyContent: 'center' }}
            onClick={() => setState({ menu_open: false })}
          />
          <List style={{ padding: 0 }}>
            <MyListItem onClick={() => changePage('lite')} item="Lite" icon={LiteIcon} cur={curpage} />
            <MyListItem onClick={() => changePage('mypage')} item="MyPage" icon={MypageIcon} cur={curpage} />
            <MyListItem onClick={() => changePage('faucet')} item="Faucet" icon={ProIcon} cur={curpage} />
            <MyListItem onClick={() => changePage('term')} item="Term" icon={TermIcon} cur={curpage} />
            <MyListItem onClick={() => changePage('pro')} item="Pro" icon={ProIcon} cur={curpage} />
            <MyListItemUrl url="https://collar.org" item="Home" icon={ProIcon} />
          </List>
        </div>
      </Drawer>
      <div
        className={classes.blurbg}
        style={{ display: menu_open ? 'block' : 'none' }}
        onClick={() => setState({ menu_open: false })}
      ></div>
      <Switch>
        <Route path="/lite">
          <Lite />
        </Route>
        <Route path="/pro">
          <Pro />
        </Route>
        <Route path="/term">
          <Term />
        </Route>
        <Route path="/mypage">
          <MyPage />
        </Route>
        <Route path="/faucet">
          <Faucet />
        </Route>
        <Route path="/">
          <Lite />
        </Route>
      </Switch>
    </Router>
  )
}
