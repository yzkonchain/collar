import { useState } from 'react'
import { makeStyles, withStyles } from '@material-ui/core/styles'
import { Accordion, AccordionSummary, AccordionDetails, Tabs, Tab, Switch } from '@material-ui/core'
import { TabsArrow } from '@/assets/svg'
import { textInfo } from '@/config'

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
      padding: '4px',
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
    fontFamily: 'Gillsans',
    minHeight: '0',
    padding: '0',
    textTransform: 'capitalize',
    fontWeight: 'bold',
    fontSize: '1.1em',
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
  const { labels, tabs, value } = props
  const selected = labels[tabs][value]
  const label = {}
  labels.forEach((v) => v.forEach((v) => (label[v] = true)))
  const [expanded, setExpanded] = useState(label)
  const { round, setRound } = props.round
  const classes = makeStyles((theme) => ({
    root: { position: 'relative' },
    button: {
      position: 'absolute',
      top: '2px',
      right: 0,
    },
    switch: {
      transform: 'translateY(-8px)',
    },
    expanded: {
      background: 'none',
      border: 'none',
      padding: 0,
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
      <div className={classes.button}>
        <Switch checked={round} onChange={() => setRound(!round)} className={classes.switch} disabled />
      </div>
      <Tabs {...props} variant="standard">
        {labels[tabs].map((v, k) => (
          <MyTab
            key={k}
            disableRipple
            label={
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span>{v}</span>
                <img
                  onClick={() => setExpanded({ ...expanded, [v]: !expanded[v] })}
                  className={classes.expanded}
                  style={{
                    margin: '0 6px',
                    width: '30px',
                    display: v === selected ? 'inline' : 'none',
                    transform: expanded[v] ? 'initial' : 'rotateX(180deg)',
                  }}
                  src={TabsArrow}
                />
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
