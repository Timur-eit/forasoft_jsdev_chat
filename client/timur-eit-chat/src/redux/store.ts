import {createStore, applyMiddleware} from 'redux'
import logger from 'redux-logger'
import thunk from 'redux-thunk'
import reducer from './reducer'
const enhancer = applyMiddleware(thunk, logger)

const store = createStore(reducer, enhancer)

export default store


// interface customWindow extends Window {
//     [property: string]: any
// }
// const extendedWindow: customWindow = window
// extendedWindow.store = store.getState()
