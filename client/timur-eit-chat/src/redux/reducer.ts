import {combineReducers} from "redux";
import projectReducer, {moduleName as projectModule} from 'ducks/chat';

export default combineReducers({[projectModule] : projectReducer});