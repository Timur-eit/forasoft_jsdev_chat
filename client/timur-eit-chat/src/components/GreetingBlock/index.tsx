import React from 'react';
import axios from 'axios';
import {useHistory} from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import {IUserData} from 'shared/interfaces';
import MaterialPaperWraper from 'shared/ui/MaterialPaper';
import './style.scss';
interface IGreetingBlockProps {
    onLogin: (obj: IUserData) => void
}

const GreetingBlock: React.FC<IGreetingBlockProps> = ({ onLogin }) => {
    const [userName, setUserName] = React.useState('');
    const history = useHistory();
    const onEnter =  React.useCallback(async () => {
        if (!userName) {
            return alert('Please input all fields');
        } else if ( userName.length > 10) {
            return alert('Max length 10 symbols');
        } else {
            const obj: IUserData = {
                userName
            }
            const response = await axios.post('http://localhost:9999/rooms', obj);
            const roomId: string = response.data;
            obj['roomId'] = roomId;
            onLogin(obj);
            history.push('/'+ roomId);
        }
    }, [userName, history, onLogin])

    return (
        <div className='greeting-block-container'>
            <MaterialPaperWraper>
                <h1>Welcome to the chat</h1>
                <p>Please enter your Username, which must be no more than 10 characters.</p>
                <TextField
                  id="standard-basic"
                  label="User name"
                  placeholder='Please enter your Username here'
                  defaultValue={userName}
                  onChange={e => setUserName(e.target.value)}
                />
                <Button variant="contained" color="primary" onClick={() => onEnter()}>
                    create a chat room and enter
                </Button>
            </MaterialPaperWraper>
        </div>
    )
}

export default GreetingBlock;