import { makeStyles, withStyles } from '@material-ui/core/styles'
import {
  Paper,
  Table,
  TableBody,
  TableCell as OldTableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core'
import { FloatMessage2, MyButtonWhite } from '@/components/Modules'
import { poolList } from '@/config'
import { Price } from '@/hooks'

const useStyles = makeStyles({
  root: {
    fontFamily: 'Gillsans',
    color: 'white',
  },
  header: {
    display: 'flex',
    marginBottom: '15px',
    '&>div:first-child': {
      display: 'flex',
      alignItems: 'center',
      fontSize: '20px',
      margin: '10px 0',
      '&>img': {
        width: '30px',
      },
      '&>span': {
        marginLeft: '10px',
      },
    },
    '&>div:last-child': {
      backgroundColor: '#2D4284',
      borderRadius: '20px',
      padding: '5px 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    '@media screen and (max-width:960px)': {
      flexDirection: 'column',
    },
    '@media screen and (min-width:960px)': {
      justifyContent: 'space-between',
      alignItems: 'center',
    },
  },
  detailTable: {
    '&>div:first-child': { fontSize: '20px', fontFamily: 'Gillsans', color: '#fff', margin: '10px 0' },
    '&>div:last-child': {
      '& tr': {
        borderBottom: 'white 1px solid',
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
  infoTable: {
    '@media screen and (max-width:960px)': {
      display: 'none',
    },
    margin: '10px 0',
    '& tr': {
      borderBottom: 'white 1px solid',
    },
    '& th,& td': {
      color: 'white',
      padding: '0',
      border: 'none',
      whiteSpace: 'nowrap',
      fontFamily: 'Gillsans',
      fontSize: '18px',
    },
    '& button': {
      width: '133px',
    },
  },
  infoTableMobile: {
    '@media screen and (min-width:960px)': {
      display: 'none',
    },
    fontFamily: 'Gillsans',
    fontSize: '18px',
    color: 'white',
    '& button': {
      width: '133px',
    },
  },
  buttonGroup: {
    textAlign: 'right',
    margin: '10px 0',
    '@media screen and (max-width:960px)': {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
    },
  },
})
const TableCell = withStyles({ root: { lineHeight: 'unset' } })((props) => <OldTableCell {...props} />)

export default function DetailTable({ pools }) {
  const classes = useStyles()

  const redeem = async (pool) => {
    // const contract = getContract(pool.pool, signer)
    // const account = await getAddress()
    // const call = await getContract(pool.call, signer).balanceOf(account)
    // const coll = await getContract(pool.coll, signer).balanceOf(account)
    // if (parseFloat(call) > parseFloat(coll)) {
    //   alert('COLL must larger than CALL!')
    //   return
    // }
    // const want = await contract.get_dy(call)
    // contract
    //   .swap_coll_to_min_want(call, withLoss(want))
    //   .then((resp) => resp.wait())
    //   .then(async ({ status }) => {
    //     let coll = transform(await getBalance(pool.coll).balanceOf(account))
    //     switch (status) {
    //       case 1:
    //         alert('Success!')
    //         setPools(
    //           pools.map((item) => {
    //             return item.pool === pool.pool ? { ...item, coll } : item
    //           }),
    //         )
    //         break
    //       default:
    //         alert('Failed!')
    //     }
    //   })
    //   .catch(console.log)
  }

  const repay = async (pool) => {
    // const contract = getContract(pool.pool, signer)
    // const account = await getAddress()
    // const call = await getContract(pool.call, signer).balanceOf(account)
    // const coll = await getContract(pool.coll, signer).balanceOf(account)
    // const want = await getContract(pool.want.addr, signer).balanceOf(account)
    // if (parseFloat(call) > parseFloat(want)) {
    //   alert(`${pool.want.symbol} must larger than CALL!`)
    //   return
    // }
    // if (parseFloat(call) > parseFloat(coll)) {
    //   alert('COLL must larger than CALL!')
    //   return
    // }
    // await contract
    //   .burn_dual(call)
    //   .then((resp) => resp.wait())
    //   .then(async ({ status }) => {
    //     let coll = transform(await getBalance(pool.coll).balanceOf(account))
    //     let call = transform(await getBalance(pool.call).balanceOf(account))
    //     switch (status) {
    //       case 1:
    //         alert('Success!')
    //         setPools(
    //           pools.map((item) => {
    //             return item.pool === pool.pool ? { ...item, coll, call } : item
    //           }),
    //         )
    //         break
    //       default:
    //         alert('Failed!')
    //     }
    //   })
    //   .catch(console.log)
  }

  const withdraw = async (pool) => {
    // const contract = getContract(pool.pool, signer)
    // const account = await getAddress()
    // const clpt = await contract.balanceOf(account)
    // await contract
    //   .withdraw_both(clpt)
    //   .then((resp) => resp.wait())
    //   .then(async ({ status }) => {
    //     switch (status) {
    //       case 1:
    //         alert('Success!')
    //         setPools(
    //           pools.map((item) => {
    //             return item.pool === pool.pool ? { ...item, clpt: '0.000' } : item
    //           }),
    //         )
    //         break
    //       default:
    //         alert('Failed!')
    //     }
    //   })
    //   .catch(console.log)
  }

  const claim = async (pool) => {
    // const contract = getContract(pool.pool, signer)
    // await contract
    //   .claim_reward()
    //   .then((resp) => resp.wait())
    //   .then(async ({ status }) => {
    //     switch (status) {
    //       case 1:
    //         alert('Success!')
    //         setPools(
    //           pools.map((item) => {
    //             return item.pool === pool.pool ? { ...item, earned: '0.000' } : item
    //           }),
    //         )
    //         break
    //       default:
    //         alert('Failed!')
    //     }
    //   })
    //   .catch(console.log)
  }

  return (
    <div className={classes.root}>
      {pools.map((val, key) => {
        const pool = poolList[val.pool]
        return (
          <div key={key} style={{ marginBottom: '40px' }}>
            <div className={classes.header}>
              <div>
                <img src={pool.bond.icon} />
                <img src={pool.want.icon} />
                <span>
                  {pool.bond.symbol}/{pool.want.symbol}
                </span>
              </div>
              <div>
                <span>Expiry: {new Date(pool.expiry_time * 1000).toLocaleString()}</span>
              </div>
            </div>
            <div className={classes.detailTable}>
              <div>
                <TableContainer component={Paper} style={{ background: 'none', boxShadow: 'none' }}>
                  <Table className={classes.table}>
                    <TableHead>
                      <TableRow>
                        <TableCell align="left" style={{ paddingBottom: '10px' }}>
                          Token
                        </TableCell>
                        <TableCell align="center" style={{ paddingBottom: '10px' }}>
                          Balance
                        </TableCell>
                        <TableCell align="center" style={{ paddingBottom: '10px' }}>
                          APY
                        </TableCell>
                        <TableCell align="center">{}</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell align="left" component="th">
                          <div style={{ margin: '10px 0', width: '50px' }}>
                            <img
                              style={{ display: 'block', width: '40px', marginBottom: '5px' }}
                              src={pool.coll.icon}
                              alt=""
                            />
                            <span>COLL</span>
                          </div>
                        </TableCell>
                        <TableCell align="center">
                          <div>{val.coll}</div>
                          <div style={{ fontSize: '10px', color: '#99A8C9' }}>~${val.coll * Price['COLL']}</div>
                        </TableCell>
                        <TableCell align="center">0%</TableCell>
                        <TableCell className={classes.buttonGroup}>
                          <MyButtonWhite name="Redeem All" onClick={() => redeem(pool)} />
                          <MyButtonWhite name="Settle" onClick={() => alert('Not support yet!')} />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell align="left" component="th">
                          <div style={{ margin: '10px 0', width: '50px' }}>
                            <img
                              style={{ display: 'block', width: '40px', marginBottom: '5px' }}
                              src={pool.call.icon}
                              alt=""
                            />
                            <span>CALL</span>
                          </div>
                        </TableCell>
                        <TableCell align="center">
                          <div>{val.call}</div>
                          <div style={{ fontSize: '10px', color: '#99A8C9' }}>~${val.call * Price['COLL']}</div>
                        </TableCell>
                        <TableCell align="center">0%</TableCell>
                        <TableCell className={classes.buttonGroup}>
                          <MyButtonWhite name="Repay All" onClick={() => repay(pool)} />
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            </div>

            <div className={classes.infoTable}>
              <TableContainer component={Paper} style={{ background: 'none', boxShadow: 'none', marginTop: '30px' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell align="left" style={{ paddingBottom: '10px' }}>
                        Token
                      </TableCell>
                      <TableCell align="center" style={{ paddingBottom: '10px' }}>
                        Balance
                      </TableCell>
                      <TableCell align="center" style={{ paddingBottom: '10px' }}>
                        Share of
                        <br />
                        Pool
                      </TableCell>
                      <TableCell align="center" style={{ paddingBottom: '10px' }}>
                        Claimable
                        <br />
                        COLLAR
                      </TableCell>
                      <TableCell align="center" style={{ paddingBottom: '10px' }}>
                        APR
                      </TableCell>
                      <TableCell align="center" style={{ paddingBottom: '10px' }}>
                        APY
                      </TableCell>
                      <TableCell align="right" style={{ paddingBottom: '10px' }}>
                        {}
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell align="left">
                        <div style={{ margin: '10px 0' }}>
                          <img style={{ width: '40px', marginBottom: '5px' }} src={pool.coll.icon} alt="" />
                          <br />
                          <span>COLL/{pool.want.symbol}</span>
                        </div>
                      </TableCell>

                      <TableCell align="center">{val.clpt}</TableCell>
                      <TableCell align="center">{val.shareOfPoll}</TableCell>
                      <TableCell align="center">{val.earned}</TableCell>
                      <TableCell align="center">{val.apr}</TableCell>
                      <TableCell align="center">{val.apy}</TableCell>
                      <TableCell className={classes.buttonGroup}>
                        <MyButtonWhite name={'Withdraw All'} onClick={() => withdraw(pool)} />
                        <MyButtonWhite name={'Claim'} onClick={() => claim(pool)} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </div>

            <div className={classes.infoTableMobile}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ margin: '10px 0' }}>
                    <img style={{ width: '40px', marginBottom: '5px' }} src={pool.coll.icon} alt="" />
                    <br />
                    <span>COLL/{pool.want.symbol}</span>
                  </div>
                </div>
                <div>{val.clpt}</div>
                <div>{val.apy}</div>
                <MyButtonWhite name={'Withdraw'} onClick={() => withdraw(pool)} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ width: 'calc(100% - 150px)' }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '10px',
                      backgroundColor: '#2D4284',
                      borderRadius: '15px',
                      margin: '5px 0',
                    }}
                  >
                    <span>Share of Pool</span>
                    <span>{val.shareOfPoll}</span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '10px',
                      backgroundColor: '#2D4284',
                      borderRadius: '15px',
                      margin: '5px 0',
                    }}
                  >
                    <span>Claimable COLLAR</span>
                    <span>{val.earned}</span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '10px',
                      backgroundColor: '#2D4284',
                      borderRadius: '15px',
                      margin: '5px 0',
                    }}
                  >
                    <span>APR</span>
                    <span>{val.apr}</span>
                  </div>
                </div>
                <MyButtonWhite name={'Claim'} onClick={() => claim(pool)} />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
