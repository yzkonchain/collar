import { makeStyles, CircularProgress, Dialog } from '@material-ui/core'

const useStyles = makeStyles(() => ({
  root: {
    '&>div:first-child': {
      backgroundColor: 'rgba(30,44,87,0.69)',
    },
  },
  wrap: {
    border: 'none',
    background: 'none',
    boxShadow: 'none',
    padding: '100px',
  },
  content: {},
}))

export default function Loading({ open }) {
  const classes = useStyles()
  return (
    <Dialog open={open} className={classes.root} classes={{ paper: classes.wrap }}>
      <CircularProgress color="primary" size={80} />
    </Dialog>
  )
}
