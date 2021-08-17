import {combineReducers} from "redux";
import projectReducer, {moduleName as projectModule} from '../ducks/project'


// declare module 'react-redux' {
//     interface DefaultRootState extends IStore {}
// }

export default combineReducers({[projectModule] : projectReducer})