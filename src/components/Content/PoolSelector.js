import { useContext, useMemo } from 'react'
import { liteContext, bondList, wantList, poolSelect } from '@/config'
import { makeStyles } from '@material-ui/core/styles'
import { FormControl, Select, MenuItem } from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { ArrowForwardIosIcon } from '@/assets/svg'

const useStyles = makeStyles((theme) => ({
  root: {},
  formControlTitle: {
    fontFamily: 'Helvetica',
    fontSize: '0.8em',
    display: 'block',
    margin: '10px 0',
    color: '#30384B',
  },
  formControlList: {
    display: 'flex',
    justifyContent: 'space-between',
    '&>div': {
      backgroundColor: '#F4F4F4',
      '&>div': {
        lineHeight: 'unset',
      },
      '&>div::before': {
        border: 'none',
      },
    },
  },
  formControl: {
    width: '50%',
    '& span': {
      fontFamily: 'Gillsans',
    },
  },
  icon: {
    margin: '0 10px',
  },
  select: {
    '&>div': {
      '& span,& img': {
        verticalAlign: 'middle',
      },
    },
  },
}))

export default function PoolSelector() {
  const classes = useStyles()
  const {
    liteState: { bond, want, round },
    setLiteState,
  } = useContext(liteContext)

  const getPool = (bond, want) => poolSelect[`${bond}-${want}-${round[0]}`]

  const setPool = (bond, want) => {
    let pool = poolSelect[`${bond}-${want}-${round[0]}`]
    if (pool) {
      setLiteState({ pool, bond: pool.bond, want: pool.want, coll: pool.coll })
    } else {
      pool = poolSelect[`${bond}-${want}-0`]
      setLiteState({ pool, bond: pool.bond, want: pool.want, coll: pool.coll, round: [0, true] })
    }
  }

  return useMemo(
    () => (
      <div className={classes.root}>
        <span className={classes.formControlTitle}>Selector Pair</span>
        <div className={classes.formControlList}>
          <FormControl className={classes.formControl}>
            <Select
              value={bond.addr}
              onChange={({ target: { value } }) => setPool(value, wantList[value][0].addr)}
              className={classes.select}
              IconComponent={ExpandMoreIcon}
            >
              {bondList.map(({ addr, icon, symbol }) => (
                <MenuItem value={addr} key={addr}>
                  <img alt="" src={icon} className={classes.icon} style={{ width: '20px' }} />
                  <span style={{ fontFamily: 'Gillsans' }}>{symbol}</span>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <img alt="" src={ArrowForwardIosIcon} className={classes.icon} />

          <FormControl className={classes.formControl}>
            <Select
              value={want.addr}
              onChange={({ target: { value } }) => setPool(bond.addr, value)}
              className={classes.select}
              IconComponent={ExpandMoreIcon}
            >
              {wantList[bond.addr].map(({ addr, icon, symbol }) => (
                <MenuItem value={addr} key={addr}>
                  <img alt="" src={icon} className={classes.icon} style={{ width: '20px' }} />
                  <span style={{ fontFamily: 'Gillsans' }}>{symbol}</span>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      </div>
    ),
    [bond, want, round],
  )
}
