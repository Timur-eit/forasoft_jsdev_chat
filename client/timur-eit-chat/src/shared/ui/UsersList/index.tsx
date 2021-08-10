import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import AccountCircle from '@material-ui/icons/AccountCircle';
import './style.scss';
interface IUsersListProps {
    [prop: string]: any,
    users: string[],
}

const UsersList: React.FC<IUsersListProps> = ({users}) => {
    return (
        <div className='users-list'>        
        Online users {users.length}
        <List >
          {users.map((user, i) =>
            <ListItem key={user + i}>
              <ListItemIcon>
                <AccountCircle />
              </ListItemIcon>
              <ListItemText primary={user}/>
            </ListItem>
          )}
        </List>
      </div>
    )
}

export default UsersList;