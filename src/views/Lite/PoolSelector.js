import { useContext, useMemo } from 'react'
import { makeStyles, Icon, FormControl, Select, MenuItem } from '@material-ui/core'
import { liteContext, bondList, wantList, poolSelect } from '@/config'

const useStyles = makeStyles({
  root: {},
  formControlTitle: {
    fontFamily: 'Helvetica',
    fontSize: '14px',
    display: 'block',
    margin: '15px 0 5px',
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
    '& span': { fontFamily: 'Frutiger' },
  },
  icon: {
    margin: '0 10px',
  },
  icon_arrow: {
    fontFamily: 'Material Icons',
    fontSize: '24px',
    display: 'flex',
    alignItems: 'center',
  },
  select: {
    '&>div': {
      '& span,& img': {
        verticalAlign: 'middle',
      },
    },
  },
})

export default function PoolSelector() {
  const classes = useStyles()
  const {
    liteState: { bond, want, round },
    setLiteState,
  } = useContext(liteContext)

  const setPool = (b, w) => {
    const _pool = poolSelect[`${b}-${w}-${round[0]}`]
    const [pool, _round] = _pool ? [_pool, round] : [poolSelect[`${b}-${w}-0`], [0, true]]
    const { bond, want, coll } = pool
    setLiteState({ pool, bond, want, coll, round: _round })
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
            >
              {bondList.map(({ addr, icon, symbol }) => (
                <MenuItem value={addr} key={addr}>
                  <img alt="" src={icon} className={classes.icon} style={{ width: '20px' }} />
                  <span style={{ fontFamily: 'Frutiger' }}>{symbol}</span>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <span className={classes.icon_arrow}>navigate_next</span>

          <FormControl className={classes.formControl}>
            <Select
              value={want.addr}
              onChange={({ target: { value } }) => setPool(bond.addr, value)}
              className={classes.select}
            >
              {wantList[bond.addr].map(({ addr, icon, symbol }) => (
                <MenuItem value={addr} key={addr}>
                  <img alt="" src={icon} className={classes.icon} style={{ width: '20px' }} />
                  <span style={{ fontFamily: 'Frutiger' }}>{symbol}</span>
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
