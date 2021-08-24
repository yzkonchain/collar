import { ethers } from 'ethers'
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

const TableCell = withStyles({ root: { lineHeight: 'unset', padding: '0' } })((props) => <OldTableCell {...props} />)
const format = (num, n) => parseFloat(ethers.utils.formatUnits(num, n || 18)).toFixed(3)

export default function RepayAll({ data, pool, checked, classes }) {
  return (
    <TableContainer>
      <Table className={classes.table1}>
        <TableHead>
          <TableRow>
            <TableCell>YOUR REDEMPTION</TableCell>
            <TableCell>YOUR RECEPTION</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>
              <div className={classes.amount}>
                <span>{`${format(checked.call)}`}</span>
                <span>{` ${pool.call.symbol}`}</span>
              </div>
              <span style={{ fontSize: '20px', fontWeight: 'bold' }}>+</span>
              <div className={classes.amount}>
                <span>{`${format(checked.want)}`}</span>
                <span>{` ${pool.want.symbol}`}</span>
              </div>
              {checked.coll.gt(ethers.constants.Zero) && (
                <div>
                  <span style={{ fontSize: '20px', fontWeight: 'bold' }}>+</span>
                  <div className={classes.amount}>
                    <span>{`${format(checked.coll)}`}</span>
                    <span>{` ${pool.coll.symbol}`}</span>
                  </div>
                </div>
              )}
            </TableCell>
            <TableCell>
              <div className={classes.amount}>
                <span>{`${format(checked.bond)}`}</span>
                <span>{` ${pool.bond.symbol}`}</span>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  )
}
