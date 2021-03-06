import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  root: {
    fontFamily: 'Frutiger',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    paddingBottom: '20px',
    marginBottom: '10px',
    '&>div>hr': {
      position: 'absolute',
      width: '100%',
      bottom: 0,
      border: 'none',
      borderTop: 'white 1px solid',
    },
  },
  title: {
    fontSize: '0.9em',
    color: 'white',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: '5px 0',
  },
  data: {
    alignSelf: 'flex-start',
    color: 'white',
    fontSize: '0.8em',
    overflow: 'hidden',
    maxWidth: 'calc(50vw - 40px)',
    marginBottom: '10px',
  },
}))

export default function InfoCard2(props) {
  const classes = useStyles()
  const { title, data1, data2, noHr } = props
  return (
    <div className={classes.root}>
      <div>
        <div className={classes.title}>
          <span>{title}</span>
        </div>
        {data1 && <div className={classes.data}>{data1}</div>}
        {data2 && <div className={classes.data}>{data2}</div>}
      </div>
      {noHr || (
        <div>
          <hr />
        </div>
      )}
    </div>
  )
}
