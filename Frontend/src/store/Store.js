import { applyMiddleware, combineReducers, createStore } from "redux";
import createSagaMiddleware from "redux-saga";
import { cartReducer, OrderReducer, UserAuthenticationReducer } from "./Reducers";
import watcherSaga from "./watcherSaga";

const rootReducer = combineReducers({
    cart:cartReducer,
    userData : UserAuthenticationReducer,
    orders: OrderReducer,
})
const sagaMiddleware = createSagaMiddleware();
const Store = createStore(rootReducer,applyMiddleware(sagaMiddleware))
sagaMiddleware.run(watcherSaga)

export default Store;