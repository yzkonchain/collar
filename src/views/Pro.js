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
      fontFamily="Gillsans"
    >
      TODO
    </Box>
  )
}

// import { ethers } from 'ethers'
// import { useContext } from 'react'
// import { context, pools } from '@/config'
// import { contract } from '@/hooks'
// export default function Pro() {
//   const CT = contract()
//   const {
//     state: { signer },
//   } = useContext(context)
//   const handleClick = async () => {
//     const ct = CT(signer)
//     const pool = pools[0].r1
//     const amount = ethers.utils.parseEther('10000')
//     const bond = amount
//     const coll = amount
//     const want = amount
//     const clpt = await ct.ct(pool.addr).get_dk(coll, want)
//     await ct
//       .mint(bond, pool)
//       .then((resp) => resp && ct.deposit(coll, want, clpt, pool))
//       .catch(() => false)
//   }
//   return (
//     <div>
//       <button onClick={handleClick}>MINT</button>
//     </div>
//   )
// }
