import {connect} from 'react-redux'
import Intro from './Intro'
import {IStore} from 'ducks/interfaces'

import {
    usersNamesSelector,    
    IReducerRecord,
    setUserName    
} from 'ducks/chat'

export default connect((state: IStore<IReducerRecord>) => ({
    usersNamesList: usersNamesSelector(state),    
}), {
    setUserName
})(Intro)