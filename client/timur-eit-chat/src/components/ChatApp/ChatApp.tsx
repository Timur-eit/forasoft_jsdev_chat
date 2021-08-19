import React from 'react'
import {Switch, Route} from 'react-router-dom'
import GreetingBlock from 'components/GreetingBlock'
import ChatRoom from 'components/ChatRoom'

import 'App.scss'

interface IAppProps {
  [property: string]: any
}

const ChatApp: React.FC<IAppProps> = (props) => {
    const {
        roomId,
        userName,
        users,
        messages,
        onLogin,
        addMessage,
        initialChat
    } = props;

  React.useEffect(() => {
      initialChat()
  }, [initialChat])

  console.log(messages)

  return (
    <div className="App">
      <Switch>
        <Route exact path="/">
          <GreetingBlock onLogin={onLogin} />
        </Route>
        <Route path="/:chat_id">
          <ChatRoom
            onLogin={onLogin}
            users={users}
            messages={messages}
            userName={userName}
            roomId={roomId}
            onAddMessage={addMessage}
          />
        </Route>
      </Switch>
    </div>
  )
}

export default ChatApp;