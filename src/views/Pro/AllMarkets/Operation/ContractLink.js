import { poolConfig } from '@/config/poolsTest'

export default function ContractLink({ token, contract }) {
  return (
    <div
      style={{
        paddingLeft: '55px',
        color: '#99A8C9',
        fontFamily: 'Gillsans',
        fontSize: '18px',
        display: 'flex',
        alignItems: 'center',
        margin: '10px 0',
      }}
    >
      <span>{token}</span>
      <span style={{ margin: '0 10px' }}>Contract Link</span>
      <a
        style={{
          color: '#99A8C9',
          fontSize: '14px',
          width: '100px',
          textDecoration: 'none',
          textOverflow: 'ellipsis',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          marginLeft: '20px',
          borderRadius: '10px',
          padding: '0 15px',
          boxShadow: `0px 5px 5px -3px rgb(38 111 239 / 10%), 
        0px 8px 10px 1px rgb(38 111 239 / 8%), 
        0px 1px 5px 2px rgb(38 111 239 / 30%)`,
        }}
        href={`${poolConfig.browser}/address/${contract}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        {contract}
      </a>
    </div>
  )
}
