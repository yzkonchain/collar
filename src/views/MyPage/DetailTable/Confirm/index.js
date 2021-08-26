import { useMemo, lazy, Suspense } from 'react'
import { makeStyles, withStyles, Dialog } from '@material-ui/core'
import { MyButton } from '@/components/Modules'
import LoanStats from './LoanStats'

const useStyles = makeStyles(() => ({
  root: {
    '&>div:first-child': {
      backgroundColor: 'rgba(30,44,87,0.69)',
    },
  },
  wrap: {
    borderRadius: 0,
    border: '#979797 1px solid',
    backgroundColor: 'rgba(245,245,255,0.9)',
    padding: '30px',
    boxShadow: `0px 11px 15px -7px rgb(0 0 0 / 0%),
      0px 24px 38px 3px rgb(0 0 0 / 0%),
      5px 5px 60px 0px rgb(38 111 239 / 51%)`,
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
  },
  table1: {
    '&>thead': {
      '& th': {
        color: '#275BFF',
        fontFamily: 'Frutiger',
        fontWeight: 'bold',
        paddingBottom: '15px',
        width: '200px',
      },
    },
    '&>tbody': {
      '& td': {
        color: '#275BFF',
        fontFamily: 'Helvetica',
      },
    },
  },
  table2: {
    '&>tbody': {
      '& tr': {
        '&>td': {
          fontSize: '14px',
          color: '#495EB6',
          fontFamily: 'Helvetica',
          '&:nth-child(1)': {
            width: 0,
            whiteSpace: 'nowrap',
            paddingRight: '10px',
          },
        },
      },
    },
  },
  amount: {
    paddingRight: '20px',
    '&>span:nth-child(1)': {
      fontSize: '20px',
      fontWeight: 'bold',
    },
    '&>span:nth-child(2)': {
      fontSize: '14px',
    },
  },
  loan: {
    fontFamily: 'Frutiger',
    fontSize: '20px',
    margin: '5px 0',
    color: '#495EB6',
  },
}))

export default function Confirm({ open, type, pool, pools, checked, onClose, handleClick }) {
  const classes = useStyles()
  const data = pools.filter(({ pool: { addr } }) => addr == pool.addr)[0]
  const Content = lazy(() => import(`./${type.slice(0, 1).toUpperCase() + type.slice(1)}`))

  return useMemo(
    () => (
      <Dialog {...{ onClose, open }} className={classes.root} classes={{ paper: classes.wrap }}>
        <div className={classes.content}>
          <Suspense fallback={<div></div>}>
            <Content {...{ data, pool, checked, classes }} />
          </Suspense>
          <MyButton name="Confirm" style={{ margin: '20px 60px' }} onClick={handleClick} />
          <LoanStats {...{ data, pool, classes }} />
        </div>
      </Dialog>
    ),
    [open, type, pool, pools],
  )
}
