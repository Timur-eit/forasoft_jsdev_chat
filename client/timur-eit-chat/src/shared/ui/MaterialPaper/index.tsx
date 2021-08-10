import React from 'react'
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper'

const useStyles = makeStyles((_theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'column',
      textAlign: 'center',
    width: '70%',
      '& > *': {
        margin: '1em',
      },
    },
  }),
);


const MaterialPaperWraper: React.FC<{ children: any}> = ({children}) => {    
    const classes = useStyles()
    return (
        <Paper elevation={2} className={classes.root}>
            {children}
        </Paper>
        
    )
}

export default MaterialPaperWraper