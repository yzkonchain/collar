import {
  withStyles,
  Table,
  TableBody,
  TableCell as OldTableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core'

const TableCell = withStyles({ root: { lineHeight: 'unset', padding: '0' } })((props) => <OldTableCell {...props} />)

export default function LoanStats({ data, pool, classes }) {
  return (
    <TableContainer>
      <div className={classes.loan}>Current Loan Stats:</div>
      <Table className={classes.table2}>
        <TableBody>
          <TableRow>
            <TableCell>Repaid Loan Amount:</TableCell>
            <TableCell>{`${(data.coll_total_supply + data.coll_total - data.call_total_supply).toFixed(2)} ${
              pool.want.symbol
            }`}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Outstanding Loan Amount:</TableCell>
            <TableCell>{`${data.call_total_supply.toFixed(2)} ${pool.want.symbol}`}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Collateral Deposit Amount:</TableCell>
            <TableCell>{`${data.bond_total.toFixed(2)} ${pool.bond.symbol}`}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  )
}
