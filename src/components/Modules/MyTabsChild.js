import { useState } from 'react'
import {
  makeStyles,
  withStyles,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tabs,
  Tab,
  Switch,
} from '@material-ui/core'
import { textInfo, STYLE } from '@/config'
import { FloatMessage2 } from '@/components/Modules'

const timer = (time) => {
  const dtime = new Date(time) - new Date()
  return [
    Math.floor(dtime / 86400000),
    Math.floor((dtime % 86400000) / 3600000),
    Math.floor(((dtime % 86400000) % 3600000) / 60000),
  ]
}
const Timer = withStyles({
  root: {
    fontFamily: 'Frutiger',
    [STYLE.MOBILE]: {
      display: 'none',
    },
    [STYLE.PC]: {
      display: 'flex',
      width: 'max-content',
      fontSize: '18px',
      color: '#303848',
      marginRight: '10px',
      '&>div': {
        marginLeft: '10px',
        '&>span:nth-child(odd)': {
          fontSize: '18px',
          marginLeft: '2px',
        },
        '&>span:nth-child(even)': {
          fontSize: '12px',
        },
      },
    },
  },
})(({ classes, timer: [d, h, m] }) => (
  <div className={classes.root}>
    <span>Expiry :</span>
    <div>
      <span>{d}</span>
      <span> Days </span>
      <span>{h}</span>
      <span> Hours </span>
      <span>{m}</span>
      <span> Mins </span>
    </div>
  </div>
))

const MyAccordion = withStyles({
  root: {
    backgroundColor: '#EDF2FF',
    color: '#4975FF',
    boxShadow: 'none',
    margin: '0 !important',
    borderRadius: '5px',
    '&>div:first-child': {
      minHeight: 0,
      height: 0,
    },
    '&>div:last-child div': {
      padding: '3px',
      fontSize: '16px',
      fontFamily: 'Helvetica',
    },
    '&:before': {
      background: 'none',
    },
  },
})((props) => (
  <Accordion {...props} expanded={props.expanded}>
    <AccordionSummary />
    <AccordionDetails>{props.info}</AccordionDetails>
  </Accordion>
))
const MyTab = withStyles({
  root: {
    fontFamily: 'Frutiger',
    minHeight: '0',
    padding: '0',
    textTransform: 'capitalize',
    fontWeight: 'bold',
    fontSize: '18px',
    color: '#30384B',
    '&>span': {
      alignItems: 'start',
    },
  },
  textColorInherit: {
    opacity: '1',
  },
  selected: {
    '&>span': {
      color: '#275bff',
    },
  },
})((props) => <Tab {...props} />)

const MyTabs = withStyles({
  root: {
    minHeight: '0',
    display: 'block',
  },
  scroller: {
    height: '35px',
  },
  fixed: {
    width: 'auto',
  },
  indicator: {
    backgroundColor: '#275BFF',
    height: '5px',
    width: '20% !important',
    zIndex: '1',
  },
})((props) => {
  const { labels, tabs, value, expiry } = props
  const selected = labels[tabs][value]
  const label = {}
  labels.forEach((v) => v.forEach((v) => (label[v] = true)))
  const [expanded, setExpanded] = useState(label)
  const [anchorEl, setAnchorEl] = useState(null)
  const { round, setRound } = props.round
  const count_time = timer(expiry)
  const classes = makeStyles((theme) => ({
    root: { position: 'relative' },
    roundInfo: {
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
      position: 'absolute',
      right: 0,
    },
    hr: {
      position: 'absolute',
      top: '24px',
      width: '100%',
      zIndex: '0',
      borderBottom: '#D8D8D8 1px solid',
      borderTop: 'none',
    },
  }))()
  return (
    <div className={classes.root}>
      <div className={classes.roundInfo}>
        <Timer timer={count_time} />
        <Switch
          color="primary"
          size="small"
          checked={!!round[0]}
          onChange={() => setRound([round[0] ? 0 : 1, round[1]])}
          disabled={round[1]}
        />
        <div style={{ display: 'flex', alignItems: 'center', fontSize: '16px' }}>
          <span style={{ color: round[1] ? '#C4C4C4' : '#303848', fontFamily: 'Frutiger' }}>NewRound</span>
          <span
            style={{
              fontFamily: 'Material Icons Outlined',
              color: '#B2B2B2',
              marginLeft: '2px',
            }}
            onMouseEnter={(e) => setAnchorEl(e.currentTarget)}
            onMouseLeave={() => setAnchorEl(null)}
          >
            info
          </span>
          <FloatMessage2 anchorEl={anchorEl} info={textInfo['round']} />
        </div>
      </div>
      <Tabs {...props} variant="standard">
        {labels[tabs].map((v, k) => (
          <MyTab
            key={k}
            disableRipple
            label={
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span>{v}</span>
                <span
                  style={{
                    display: v === selected ? 'flex' : 'none',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#275BFF',
                    color: 'white',
                    textTransform: 'none',
                    fontFamily: 'Material Icons',
                    fontSize: '18px',
                    margin: '0 8px',
                    height: '14px',
                    width: '24px',
                    borderRadius: '8px',
                  }}
                  onClick={() => setExpanded({ ...expanded, [v]: !expanded[v] })}
                >
                  {expanded[v] ? 'expand_less' : 'expand_more'}
                </span>
              </div>
            }
          />
        ))}
      </Tabs>
      <hr className={classes.hr} />
      <MyAccordion expanded={expanded[selected]} info={textInfo[selected]} />
    </div>
  )
})

export default MyTabs
