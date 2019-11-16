import { createStore, combineReducers } from 'redux'
import ioReducer from './ioReducer'
import cartReducer from './cartReducer'


const reducer = combineReducers({cartReducer, ioReducer})
const store = createStore(reducer)

export default store