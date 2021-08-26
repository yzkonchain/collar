import { ethers } from 'ethers'
import { useContext, useMemo } from 'react'
import { makeStyles } from '@material-ui/core'
import { liteContext } from '@/config'
import { InfoCard1, InfoCard2, InfoCard3 } from '@/components/Modules'

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: '-10px',
    display: 'flex',
    background: 'none !important',
    flexDirection: 'column',
    '&>div': {
      display: 'flex',
      justifyContent: 'space-between',
      '&>div': {
        width: 'calc(50% - 10px)',
      },
    },
  },
}))

const format = (num, n) => ethers.utils.formatUnits(num, n || 18)

export default function Info() {
  const classes = useStyles()
  const {
    liteState: { pool, bond, want, data },
  } = useContext(liteContext)

  return useMemo(
    () => (
      <div className={classes.root}>
        <div>
          <InfoCard1
            token={bond.symbol}
            status={data.allowance.bond.gt('100000000000000000000000000000000') ? 'APPROVED' : 'NOT APPROVED'}
            amount={format(data.balance.bond, bond.decimals)}
          />
          <InfoCard1
            token={want.symbol}
            status={data.allowance.want.gt('100000000000000000000000000000000') ? 'APPROVED' : 'NOT APPROVED'}
            amount={format(data.balance.want, want.decimals)}
          />
        </div>
        <div>
          <InfoCard1 token={'CALL'} status="TOTAL BORROWED" amount={format(data.balance.call)} />

          <InfoCard1 token={'COLL'} status="TOTAL LENT" amount={format(data.balance.coll)} />
        </div>
        <div>
          <InfoCard1 token={'CLPT'} status="LP TOKEN" amount={format(data.balance.clpt)} />

          <InfoCard1
            token={'COLLAR'}
            status={`${parseFloat(format(data.earned.collar)).toFixed(3)} EARNED`}
            amount={format(data.balance.collar)}
          />
        </div>
        <div>
          <InfoCard2
            title="Interest Rate"
            data={`${parseFloat(data.apy).toFixed(2)} %`}
            info="FOR BOTH LENDING AND BORROWING"
          />
          <InfoCard2 title="Farm APY" data={`${parseFloat(data.farm_apy).toFixed(3)} %`} info="CLPT'S farming APY" />
        </div>
        <div>
          <InfoCard2
            title="Expiry"
            data={new Date(pool.expiry_time * 1000).toLocaleString()}
            info="REPAY BEFORE THIS TIME"
            styles={{ color: '#FF5C5C' }}
            noHr={true}
          />
          <InfoCard3
            title="Nominal swap fee"
            data1="0.01% for Borrow, Withdraw, Lend and Redeem"
            data2="0% for Repay and Deposit"
            noHr={true}
          />
        </div>
      </div>
    ),
    [data],
  )
}
