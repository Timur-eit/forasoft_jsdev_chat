import React from "react"

import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import Divider from '@material-ui/core/Divider'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import AccountCircle from '@material-ui/icons/AccountCircle'
import TextareaAutosize from '@material-ui/core/TextareaAutosize'
import Button from "@material-ui/core/Button"

import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';

import './style.scss'

interface IMessagesProps {
    [prop: string]: any,
    messages: Array<{
        userName: string;
        text: string;
    }>
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      // width: '100%',
      // maxWidth: '36ch',
      // backgroundColor: theme.palette.background.paper,
    },
    inline: {
      // display: 'inline',
    },
  }),
);


const Messages: React.FC<IMessagesProps> = ({messages}) => {
    
    const classes = useStyles()

    return (
        <List className={classes.root}>
        {messages.map((message, i) => {
          console.log(message)
          return (
            <div key={message.userName + i}>
              <ListItem alignItems="flex-start">
                <ListItemText
                  primary={message.userName}
                  secondary={message.text}
                />
              </ListItem>
              <Divider variant="inset" component="li"/>
            </div>

          )
        })}
      </List> 
    )
}

export default Messages
