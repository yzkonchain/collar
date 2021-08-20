import { ethers } from 'ethers'
import { useContext, useEffect, useState } from 'react'
import { context, liteContext, tokenList } from '@/config'
import { makeStyles } from '@material-ui/core/styles'
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

export default function Info() {
  const classes = useStyles()
  const {
    state: { signer },
  } = useContext(context)
  const {
    liteState: { forceUpdate, pool, poolList, bond, want, data, controller },
    setLiteState,
  } = useContext(liteContext)
  const [update, setUpdate] = useState({})
  useEffect(() => {
    if (!signer) return
    ;(async () => {
      setLiteState({ data: await controller.fetch_state(pool, signer) })
      setUpdate({})
    })()
  }, [forceUpdate])

  return (
    <div className={classes.root}>
      <div>
        <InfoCard1
          token={tokenList[bond].symbol}
          status={data.allowance.bond.gt('100000000000000000000000000000000') ? 'APPROVED' : 'NOT APPROVED'}
          amount={ethers.utils.formatEther(data.balance.bond)}
        />
        <InfoCard1
          token={tokenList[want].symbol}
          status={data.allowance.want.gt('100000000000000000000000000000000') ? 'APPROVED' : 'NOT APPROVED'}
          amount={ethers.utils.formatEther(data.balance.want)}
        />
      </div>
      <div>
        <InfoCard1 token={'CALL'} status="TOTAL BORROWED" amount={ethers.utils.formatEther(data.balance.call)} />

        <InfoCard1 token={'COLL'} status="TOTAL LENT" amount={ethers.utils.formatEther(data.balance.coll)} />
      </div>
      <div>
        <InfoCard1 token={'CLPT'} status="LP TOKEN" amount={ethers.utils.formatEther(data.balance.clpt)} />

        <InfoCard1
          token={'COLLAR'}
          status={`${parseFloat(ethers.utils.formatEther(data.earned.collar)).toFixed(4)} EARNED`}
          amount={ethers.utils.formatEther(data.balance.collar)}
        />
      </div>
      <div>
        <InfoCard2 title="Interest Rate" data={data.apy} info="FOR BOTH LENDING AND BORROWING" />
        <InfoCard2 title="Farm APY" data="---" info="---" />
      </div>
      <div>
        <InfoCard2
          title="Expiry"
          data={new Date(poolList[pool].expiry_time * 1000).toLocaleString()}
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
  )
}
