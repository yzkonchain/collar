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

export default function Redeem({ data, pool, classes }) {
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
                <span>{`${data.bond_total.toFixed(3)}`}</span>
                <span>{` ${pool.coll.symbol}`}</span>
              </div>
              <span style={{ fontSize: '20px', fontWeight: 'bold' }}>+</span>
              <div className={classes.amount}>
                <span>{`${data.bond_total.toFixed(3)}`}</span>
                <span>{` ${pool.call.symbol}`}</span>
              </div>
            </TableCell>
            <TableCell>
              <div className={classes.amount}>
                <span>{`${data.bond_total.toFixed(3)}`}</span>
                <span>{` ${pool.bond.symbol}`}</span>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  )
}
