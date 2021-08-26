import { Box } from '@material-ui/core'

export default function Pro() {
  return (
    <Box
      display="flex"
      flexDirection="column"
      height="80vh"
      width="100vw"
      textAlign="center"
      justifyContent="center"
      color="white"
      fontSize="50px"
      fontFamily="Frutiger"
    >
      TODO
    </Box>
  )
}

// import { ethers } from 'ethers'
// import { useContext } from 'react'
// import { context, pools, proContext, poolConfig } from '@/config'

// export default function Pro() {
//   const {
//     state: { signer, controller },
//   } = useContext(context)

//   const format = (n) => parseFloat(ethers.utils.formatEther(n))
//   const handleClick = async () => {
//     const me = await signer.getAddress()
//     const pool = pools[0].r1
//     const token = pool.want.addr

//     // const amount = ethers.utils.parseEther('100')
//     // const bond = amount
//     // const coll = amount
//     // const want = amount
//     // const clpt = await controller.ct(pool.addr).get_dk(coll, want)
//     // await controller
//     //   .mint(bond, pool)
//     //   .then((resp) => resp && controller.deposit(coll, want, clpt, pool))
//     //   .catch(() => false)
//     // const [coll, call] = await Promise.all([
//     //   controller.ct(pool.coll.addr, ['function totalSupply() public view returns (uint256)']).totalSupply(),
//     //   controller.ct(pool.call.addr, ['function totalSupply() public view returns (uint256)']).totalSupply(),
//     // ])
//   }

//   return (
//     <proContext.Provider value={{}}>
//       <div>
//         <button onClick={handleClick}>MINT</button>
//       </div>
//     </proContext.Provider>
//   )
// }
