import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles({
  root: {
    backgroundColor: '#fff',
    marginTop: '20px',
    marginBottom: '40px',
    height: '100px',
  },
})

export default function Operation() {
  const classes = useStyles()

  return <div className={classes.root}></div>
}
