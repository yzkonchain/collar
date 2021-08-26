import { ethers } from 'ethers'
import { useContext, useState } from 'react'
import {
  Button,
  LinearProgress,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Card,
  CardActions,
  CardContent,
  TableContainer,
  Paper,
  Table,
  TableRow,
  TableCell,
  TableBody,
} from '@material-ui/core'
import { context } from '@/config'

export default function AccountDialog({ open, onClose, disconnect }) {
  const [address, setAddress] = useState(null)
  const [balance, setBalance] = useState(null)
  const {
    state: { signer },
  } = useContext(context)

  const sync_address = async () => {
    if (signer) {
      const _address = await signer.getAddress()
      if (_address !== address) setAddress(_address)
    }
  }

  const sync_balance = async () => {
    if (signer) {
      const _balance = await signer.getBalance()
      if (balance === null || !_balance.eq(balance)) setBalance(_balance)
    }
  }

  sync_address()
  sync_balance()

  return (
    <Dialog fullWidth open={open} onClose={onClose} style={{ zIndex: '9999' }}>
      <DialogTitle>Account</DialogTitle>
      <DialogContent>
        <Card>
          <CardContent>
            {address ? (
              <Box
                fontFamily="Avenir"
                textOverflow="ellipsis"
                overflow="hidden"
                m={1}
                fontSize="h6.fontSize"
                align="center"
              >
                {address}
              </Box>
            ) : (
              <Box width="100%">
                <LinearProgress color="secondary" />
              </Box>
            )}
            <TableContainer component={Paper}>
              <Table>
                <TableBody>
                  <TableRow key="address">
                    <TableCell component="th" scope="row">
                      ETH Balance
                    </TableCell>
                    <TableCell align="right">
                      {balance ? (
                        <Typography color="textPrimary" align="center" component="code">
                          {ethers.utils.formatEther(balance)}
                        </Typography>
                      ) : (
                        <Box width="100%">
                          <LinearProgress color="secondary" />
                        </Box>
                      )}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
          <CardActions>
            <Button color="primary" onClick={() => navigator.clipboard.writeText(address)}>
              <Typography noWrap>copy address</Typography>
            </Button>
            <Button color="primary" href={`https://etherscan.io/address/${address}`} target="_blank">
              <Typography noWrap>view on etherscan</Typography>
            </Button>
            <Button color="primary" onClick={disconnect} target="_blank">
              <Typography noWrap>disconnect</Typography>
            </Button>
          </CardActions>
        </Card>
      </DialogContent>
    </Dialog>
  )
}
