import { tokenList } from '@/config'
import CoinGecko from 'coingecko-api'
const CoinGeckoClient = new CoinGecko()

const Price = {}
Object.keys(tokenList).forEach((addr) => (Price[addr] = 1))

const coinMap = {
  tether: '0x08f5F253fb2080660e9a4E3882Ef4458daCd52b0',
  'usd-coin': '0x67C9a0830d922C80A96408EEdF606c528836880C',
}
const coinList = Object.keys(coinMap)

async function getPrice() {
  CoinGeckoClient.simple
    .price({ ids: coinList })
    .then(({ code, data }) => {
      if (code === 200) coinList.forEach((coin) => (Price[coinMap[coin]] = data[coin].usd))
      else throw new Error()
    })
    .catch(console.log)
}

getPrice()

export { Price, getPrice }
