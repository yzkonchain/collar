import { useState } from 'react'
import {
  makeStyles,
  withStyles,
  Table,
  TableBody,
  TableCell as OldTableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core'
import { Price } from '@/hooks'
import { poolConfig } from '@/config'
import { MyButtonWhite, FloatMessage2 } from '@/components/Modules'

const useStyles = makeStyles({
  root: {
    '&>div>table': {
      '& tr': {
        borderBottom: '#D8D8D8 1px solid',
      },
      '& th,& td': {
        color: 'white',
        padding: 0,
        border: 'none',
        fontSize: '18px',
        fontFamily: 'Frutiger',
        whiteSpace: 'nowrap',
      },
      '& button': {
        width: '133px',
      },
    },
  },
  token: {
    margin: '15px 0',
    textAlign: 'center',
    width: 'fit-content',
    '& img': {
      width: '40px',
      marginBottom: '5px',
      '&:nth-child(2)': {
        position: 'relative',
        left: '-15px',
      },
    },
  },
  tableHead: {
    '& th': {
      paddingBottom: '10px !important',
    },
  },
  cellWidthEmpty: {
    width: 0,
  },
  button: {
    textAlign: 'right',
    margin: '15px 0',
    width: 0,
  },
  price: {
    fontSize: '10px',
    color: '#99A8C9',
  },
})

const TableCell = withStyles({ root: { lineHeight: 'unset' } })((props) => <OldTableCell {...props} />)

const TableCellInfo = ({ title, info }) => {
  const [anchorEl, setAnchorEl] = useState(null)
  return (
    <TableCell align="center">
      <span>{title}</span>
      <span
        style={{
          fontFamily: 'Material Icons Outlined',
          fontSize: '16px',
          marginLeft: '5px',
          color: '#B2B2B2',
        }}
        onMouseEnter={(e) => setAnchorEl(e.currentTarget)}
        onMouseLeave={() => setAnchorEl(null)}
      >
        info
      </span>
      <FloatMessage2 anchorEl={anchorEl} info={info} />
    </TableCell>
  )
}

const dec = {
  apy: 2,
  apr: 2,
  sop: 2,
  balance: 3,
  earned: 3,
  price: 3,
}

export default function PC({ pool, val, handleClick }) {
  const classes = useStyles()
  return (
    <div className={classes.root}>
      <TableContainer>
        <Table>
          <TableHead className={classes.tableHead}>
            <TableRow>
              <TableCell>Token</TableCell>
              <TableCell align="center">Balance</TableCell>
              <TableCellInfo title="APY" info="1x daily compound" />
              <TableCell align="center">APR</TableCell>
              <TableCell align="center">
                Share of
                <br />
                Pool
              </TableCell>
              <TableCell align="center">
                Claimable
                <br />
                COLLAR
              </TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>
                <div className={classes.token}>
                  <img src={pool.coll.icon} alt="" />
                  <img src={pool.want.icon} alt="" />
                  <br />
                  <span>COLL/{pool.want.symbol}</span>
                </div>
              </TableCell>
              <TableCell align="center">
                <div>{parseFloat(val.clpt).toFixed(dec.balance)}</div>
                <div className={classes.price}>~${parseFloat(val.receivables).toFixed(dec.price)}</div>
              </TableCell>
              <TableCell align="center">{(val.clpt_apy * 100).toFixed(dec.apy)}%</TableCell>
              <TableCell align="center">{(val.clpt_apr * 100).toFixed(dec.apr)}%</TableCell>
              <TableCell align="center">{parseFloat(val.shareOfPoll).toFixed(dec.sop)}%</TableCell>
              <TableCell align="center">
                <div>{parseFloat(val.earned).toFixed(dec.earned)}</div>
                <div className={classes.price}>
                  ~${parseFloat(val.earned * Price[poolConfig.collar]).toFixed(dec.price)}
                </div>
              </TableCell>
              <TableCell className={classes.button}>
                <MyButtonWhite name={'Withdraw All'} onClick={() => handleClick('withdrawAll', pool)} />
                <MyButtonWhite name={'Claim'} onClick={() => handleClick('claim', pool)} />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className={classes.cellWidthEmpty}>
                <div className={classes.token}>
                  <img src={pool.coll.icon} alt="" />
                  <br />
                  <span>COLL</span>
                </div>
              </TableCell>
              <TableCell align="center">
                <div>{parseFloat(val.coll).toFixed(dec.balance)}</div>
                <div className={classes.price}>~${parseFloat(val.coll * Price[pool.coll.addr]).toFixed(dec.price)}</div>
              </TableCell>
              <TableCell align="center">{parseFloat(val.coll_apy).toFixed(dec.apy)}%</TableCell>
              <TableCell />
              <TableCell />
              <TableCell />
              <TableCell className={classes.button}>
                <MyButtonWhite
                  name="Redeem All"
                  onClick={() => handleClick('redeemAll', pool)}
                  disabled={pool.expiry_time * 1000 < new Date()}
                />
                <MyButtonWhite
                  name="Settle"
                  onClick={() => handleClick('settle', pool)}
                  disabled={pool.expiry_time * 1000 > new Date()}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <div className={classes.token}>
                  <img src={pool.call.icon} alt="" />
                  <br />
                  <span>CALL</span>
                </div>
              </TableCell>
              <TableCell align="center">
                <div>{parseFloat(val.call).toFixed(dec.balance)}</div>
              </TableCell>
              <TableCell />
              <TableCell />
              <TableCell />
              <TableCell />
              <TableCell className={classes.button}>
                <MyButtonWhite name="Repay All" onClick={() => handleClick('repayAll', pool)} />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}
