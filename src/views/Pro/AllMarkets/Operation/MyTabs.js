import { withStyles, Tabs, Tab } from '@material-ui/core'

const MyTab = withStyles({
  root: {
    minHeight: '0',
    padding: '0 15px',
    marginRight: '0',
    boxSizing: 'content-box',
    border: '#c1c1c1 1px solid',
    borderBottom: '#4c4c4c 2px solid',
    fontFamily: 'Gillsans',
    backgroundColor: '#344B90',
    '&>span': {
      color: '#fff',
      alignItems: 'center',
      fontSize: '17px',
    },
    '&:first-child': {
      borderLeft: '#4c4c4c 2px solid',
    },
    '&:last-child': {
      borderRight: '#4c4c4c 2px solid',
    },
  },
  textColorInherit: {
    opacity: '1',
  },
  selected: {
    backgroundColor: 'white',
    border: '#c1c1c1 2px solid',
    borderBottom: 'none',
    '&>span': {
      color: '#30384b',
    },
  },
})((props) => <Tab {...props} />)
const MyTabs = withStyles({
  root: {
    minHeight: '0',
  },
  flexContainer: {
    height: '35px',
  },
  indicator: { display: 'none' },
})((props) => {
  return (
    <div style={{ position: 'relative' }}>
      <Tabs {...props} variant="fullWidth">
        {props.labels.map((v, k) => (
          <MyTab key={k} label={v} />
        ))}
      </Tabs>
    </div>
  )
})

export default MyTabs
