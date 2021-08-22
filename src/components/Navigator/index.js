import { useContext, useState } from 'react'
import { context } from '@/config'
import { makeStyles } from '@material-ui/core/styles'
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom'
import { Drawer, Box, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core'
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
  fontSpan: {
    '& span': {
      fontFamily: 'Gillsans',
      color: 'white',
      fontSize: '18px',
    },
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
      <ListItemIcon style={{ display: 'inline-block', textAlign: 'center' }}>
        <img src={icon} alt="" />
      </ListItemIcon>
      <ListItemText primary={item} className={classes.fontSpan} style={{ margin: '0 0' }} />
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
      <ListItemIcon style={{ display: 'inline-block', textAlign: 'center' }}>
        <img src={icon} alt="" />
      </ListItemIcon>
      <ListItemText primary={item} className={classes.fontSpan} style={{ margin: '0 0' }} />
    </ListItem>
  )
}

export default function Navigator() {
  const classes = useStyles()
  const {
    state: { menu_open, signer },
    setState,
  } = useContext(context)
  const [curpage, setCurpage] = useState(window.location.pathname.split('/')[1] || 'lite')
  const changePage = (item) => {
    setCurpage(item)
    setState({ menu_open: false })
  }
  return (
    <BrowserRouter>
      <Drawer variant="persistent" anchor="left" open={menu_open} className={classes.drawer}>
        <Box width="30vw" style={{ backgroundColor: '#4975FF' }}>
          <Box
            display="flex"
            style={{ minHeight: '56px', justifyContent: 'center' }}
            onClick={() => setState({ menu_open: false })}
          >
            <img src={CloseMenuIcon} alt="" />
          </Box>
          <List style={{ padding: 0 }}>
            <MyListItem onClick={() => changePage('lite')} item="Lite" icon={LiteIcon} cur={curpage} />
            <MyListItem onClick={() => changePage('mypage')} item="MyPage" icon={MypageIcon} cur={curpage} />
            <MyListItem onClick={() => changePage('faucet')} item="Faucet" icon={LiteIcon} cur={curpage} />
            <MyListItem onClick={() => changePage('term')} item="Term" icon={TermIcon} cur={curpage} />
            <MyListItem onClick={() => changePage('pro')} item="Pro" icon={ProIcon} cur={curpage} />
            <MyListItemUrl url="https://collar.org" item="Home" icon={LiteIcon} />
          </List>
        </Box>
      </Drawer>
      <div
        className={classes.blurbg}
        style={{ display: menu_open ? 'block' : 'none' }}
        onClick={() => setState({ menu_open: false })}
      ></div>
      <Box>
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
      </Box>
    </BrowserRouter>
  )
}
