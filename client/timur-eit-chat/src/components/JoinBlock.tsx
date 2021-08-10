import axios from 'axios'
import React from 'react'
import {useHistory} from 'react-router-dom'
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import {IUserData} from 'shared/interfaces'

interface IJoinBlockProps {
    onLogin: (obj: IUserData) => void
}

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

const JoinBlock: React.FC<IJoinBlockProps> = ({ onLogin }) => {
    const [userName, setUserName] = React.useState('')
    const history = useHistory()
    const onEnter = async () => {
        if (!userName) {
            return alert('Please input all fields')
        } else if ( userName.length > 10) {
            return alert('Max length 10 symbols')
        } else {
            const obj: IUserData = {
                userName
            }
            const response = await axios.post('http://localhost:9999/rooms', obj)
            const roomId: string = response.data
            obj['roomId'] = roomId
            onLogin(obj)
            history.push('/'+ roomId)
        }
    }

    const classes = useStyles()

    return (
        <Paper elevation={2} className={classes.root}>
            <h1>Welcome to the chat</h1>
            <p>Please enter your username, which must be no more than 10 characters.</p>
            <TextField
              id="standard-basic"
              label="user name"
              placeholder='Name max 10 symblos'
              defaultValue={userName}
              onChange={e => setUserName(e.target.value)}
            />

            <Button variant="contained" color="primary" onClick={() => onEnter()}>
                create a chat room and enter
            </Button>
      </Paper>
    )
}

export default JoinBlock