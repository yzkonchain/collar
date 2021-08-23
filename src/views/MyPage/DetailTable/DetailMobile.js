import { makeStyles, withStyles } from '@material-ui/core/styles'
import { Table, TableBody, TableCell as OldTableCell, TableContainer, TableHead, TableRow } from '@material-ui/core'
import { MyButtonWhite } from '@/components/Modules'
import { STYLE } from '@/config'
import { Price } from '@/hooks'

const useStyles = makeStyles({
  root: {
    [STYLE.PC]: {
      display: 'none',
    },
    [STYLE.MOBILE]: {
      '&>div:first-child': {
        '& tr': {
          borderBottom: '#D8D8D8 1px solid',
        },
        '& th,& td': {
          color: 'white',
          padding: 0,
          border: 'none',
          fontSize: '18px',
          fontFamily: 'Gillsans',
          whiteSpace: 'nowrap',
        },
        '& button': {
          width: '133px',
        },
      },
    },
  },
  tableHead: {
    '& th': {
      paddingBottom: '10px !important',
    },
  },
  rowApy: {
    width: 0,
    paddingRight: '25px !important',
  },
  clpt: {
    fontFamily: 'Gillsans',
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
    width: 0,
    padding: '10px 0 !important',
    '& button': {
      display: 'block',
    },
  },
  token: {
    fontSize: '12px',
    margin: '15px 0',
    textAlign: 'center',
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
  cellWidthEmpty: {
    width: 0,
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
              <TableCell>APY</TableCell>
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
                <div className={classes.price}>~${parseFloat(val.coll * Price['COLL']).toFixed(dec.price)}</div>
              </TableCell>
              <TableCell align="center" className={classes.rowApy}>
                {parseFloat(val.coll_apy).toFixed(dec.apy)}%
              </TableCell>
              <TableCell className={classes.button}>
                <MyButtonWhite name="Redeem All" onClick={() => handleClick('redeemAll', pool)} />
                <MyButtonWhite name="Settle" onClick={() => handleClick('settle', pool)} />
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
                <div className={classes.price}>~${parseFloat(val.call * Price['COLL']).toFixed(dec.price)}</div>
              </TableCell>
              <TableCell align="center" className={classes.rowApy}>
                {parseFloat(val.call_apy).toFixed(dec.apy)}%
              </TableCell>
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
              <TableCell align="center" className={classes.rowApy}>
                {parseFloat(val.clpt_apy).toFixed(dec.apy)}%
              </TableCell>
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
            <span>{parseFloat(val.clpt_apr).toFixed(dec.apr)}%</span>
          </div>
          <div>
            <span>Share of Pool</span>
            <span>{parseFloat(val.shareOfPoll).toFixed(dec.sop)}%</span>
          </div>
          <div>
            <span>Claimable COLLAR</span>
            <span>{parseFloat(val.earned).toFixed(dec.earned)}</span>
          </div>
        </div>
        <MyButtonWhite name={'Claim'} onClick={() => handleClick('claim', pool)} />
      </div>
    </div>
  )
}
