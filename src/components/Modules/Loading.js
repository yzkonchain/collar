import { CircularProgress } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(() => ({
  root: {
    zIndex: '9997 !important',
    position: 'absolute !important',
    top: '0 !important',
    width: '100% !important',
    height: '100% !important',
    textAlign: 'center !important',
    backgroundColor: 'rgba(0,0,0,0.2) !important',
    '&>div': {
      marginTop: '40vh !important',
    },
  },
}))

export default function Loading() {
  const classes = useStyles()
  return (
    <div className={classes.root}>
      <CircularProgress color="primary" size={80} />
    </div>
  )
}
