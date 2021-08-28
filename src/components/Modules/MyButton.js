import { makeStyles } from '@material-ui/core'
import buttonImg from '@/assets/svg/button/buttonAble.svg'
import buttonDisabledImg from '@/assets/svg//button/buttonDisabled.svg'

const useStyles = makeStyles((theme) => ({
  button: {
    fontFamily: 'Frutiger',
    padding: '0',
    background: 'none',
    border: 'none',
    position: 'relative',
    '&:hover': {
      opacity: ({ disabled }) => (disabled ? 1 : 0.8),
    },
    '&:active': {
      transform: ({ disabled }) => (disabled ? 'none' : 'translateY(3px)'),
    },
    '&:focus': {},
    '&>img': {
      width: '100%',
      height: '50px',
    },
    '&>div': {
      color: '#fff',
      left: '0',
      width: '100%',
      height: '100%',
      fontWeight: 'bold',
      position: 'absolute',
      display: 'flex',
      '& span': {
        fontSize: '1.1em',
        margin: 'auto',
      },
      transform: 'translateY(-6px)',
    },
  },
}))

export default function Button({ name, onClick, style, disabled }) {
  const classes = useStyles({ disabled })
  return (
    <button className={classes.button} {...{ onClick, style, disabled }}>
      <div>
        <span>{name}</span>
      </div>
      <img alt={name} src={disabled ? buttonDisabledImg : buttonImg} />
    </button>
  )
}
