const textInfo = {
  bond: 'BOND token is the collateral asset deposited by borrower.',
  want: 'WANT token is the debt asset provided by lender.',
  coll: 'COLL token is the lending certificate.',
  clpt: 'CLPT is the Collar LP Token for the current pair.',
  Borrow: `Borrow for a fixed rate with no collateral liquidation risk. 
          Collateral is safely stored and can be withdrawn at any time before the current round ends. 
          A fixed 0.01% fee is charged for each borrow order.`,
  Repay: `Repay your loan at any time before the current round ends to withdraw your collateral. 
          WANT tokens and COLL tokens are both acceptable for repayment. 
          Borrowers reduce the cost of their loan by using the lower priced token for repayment.`,
  Deposit: `There are three ways to provide liquidity in Collar: provide only WANT, only COLL, or both WANT and COLL. 
          The APY earned by a provider is fixed as long as they don't redeem their CLPT before the current round ends.`,
  Withdraw: `Liquidity providers can withdraw their liquidity at any time before the current round ends. 
          Redeem CLPT to collect the corresponding underlying assets, which are possibly not in the same proportion as the original deposit.`,
  Lend: `Earn a fixed interest rate over a fixed term. 
          A nominal 0.01% fee is charged for each lending order.`,
  Exit: `Lenders can exit at any time before the current round ends. 
          The interest earned may differ from the originally quoted APY.`,
}

export default textInfo
