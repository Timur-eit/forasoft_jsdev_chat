import {createStore, applyMiddleware} from "redux";
import logger from 'redux-logger'
import thunk from 'redux-thunk'
import reducer from 'redux/reducer'
import {persistMessages} from './middlewares'
const enhancer = applyMiddleware(thunk, logger)

const store = createStore(reducer, enhancer)


export default store