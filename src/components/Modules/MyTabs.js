import { withStyles } from '@material-ui/core/styles'
import { Tabs, Tab } from '@material-ui/core'

const MyTab = withStyles({
  root: {
    minHeight: '0',
    padding: '0 15px',
    marginRight: '0',
    boxSizing: 'content-box',
    border: '#c1c1c1 2px solid',
    borderBottom: '#4c4c4c 2px solid',
    '&>span': {
      fontFamily: 'Gillsans',
      color: '#fff',
      alignItems: 'start',
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
    border: '#4c4c4c 2px solid',
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
    backgroundColor: '#c1c1c1',
  },
  indicator: {
    backgroundColor: '#fff',
    width: 'calc(33.33% - 4px) !important',
    marginLeft: '2px',
  },
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
