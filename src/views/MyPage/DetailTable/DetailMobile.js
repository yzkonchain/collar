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
import { MyButtonWhite } from '@/components/Modules'

const useStyles = makeStyles({
  root: {
    '&>div:first-child': {
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
  tableHead: {
    '& th': {
      paddingBottom: '10px !important',
    },
  },
  clpt: {
    fontFamily: 'Frutiger',
    fontSize: '18px',
    color: 'white',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '#D8D8D8 1px solid',
    paddingBottom: '5px',
    '& button': {
      width: '133px',
    },
    '&>div': {
      width: 'calc(100% - 133px - 15px)',
      '& div': {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px',
        backgroundColor: '#2D4284',
        borderRadius: '25px',
        margin: '8px 0',
      },
    },
  },
  button: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    padding: '15px 0 !important',
  },
  token: {
    fontSize: '12px',
    margin: '15px 0',
    width: 'fit-content',
    '& img': {
      width: '30px',
      marginBottom: '5px',
      '&:nth-child(2)': {
        position: 'relative',
        left: '-15px',
      },
    },
  },
  price: {
    fontSize: '10px',
    color: '#99A8C9',
  },
})

const TableCell = withStyles({ root: { lineHeight: 'unset' } })((props) => <OldTableCell {...props} />)

const dec = {
  apy: 2,
  apr: 2,
  sop: 2,
  balance: 3,
  earned: 3,
  price: 3,
}

export default function Mobile({ pool, val, handleClick }) {
  const classes = useStyles()
  return (
    <div className={classes.root}>
      <TableContainer>
        <Table>
          <TableHead className={classes.tableHead}>
            <TableRow>
              <TableCell>Token</TableCell>
              <TableCell align="center">Balance</TableCell>
              <TableCell align="center">APY</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
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
              <TableCell className={classes.button}>
                <MyButtonWhite name="Repay All" onClick={() => handleClick('repayAll', pool)} />
              </TableCell>
            </TableRow>
            <TableRow style={{ borderBottom: 'none' }}>
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
              <TableCell className={classes.button}>
                <MyButtonWhite name={'Withdraw'} onClick={() => handleClick('withdrawAll', pool)} />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <div className={classes.clpt}>
        <div>
          <div style={{ marginTop: 0 }}>
            <span>APR</span>
            <span>{(val.clpt_apr * 100).toFixed(dec.apr)}%</span>
          </div>
          <div>
            <span>Share of Pool</span>
            <span>{parseFloat(val.shareOfPoll).toFixed(dec.sop)}%</span>
          </div>
          <div>
            <span>Claimable COLLAR</span>
            <div style={{ display: 'flex', flexDirection: 'column', padding: 0 }}>
              <span>{parseFloat(val.earned).toFixed(dec.earned)}</span>
              <span className={classes.price}>~${(val.earned * Price[poolConfig.collar]).toFixed(dec.price)}</span>
            </div>
          </div>
        </div>
        <MyButtonWhite name={'Claim'} onClick={() => handleClick('claim', pool)} />
      </div>
    </div>
  )
}
