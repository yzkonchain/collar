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

export default function Claim({ data, pool, checked, classes }) {
  return (
    <TableContainer>
      <Table className={classes.table1}>
        <TableHead>
          <TableRow>
            <TableCell align="center">YOUR RECEPTION</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell align="center">
              <div className={classes.amount}>
                <span>{`${format(checked.earned)}`}</span>
                <span>{` ${pool.symbol}`}</span>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  )
}
