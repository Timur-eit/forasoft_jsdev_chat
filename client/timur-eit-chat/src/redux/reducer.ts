import {combineReducers} from 'redux'
import chatReducer, {moduleName as chatModule} from '../ducks/chat'

export default combineReducers({[chatModule] : chatReducer})