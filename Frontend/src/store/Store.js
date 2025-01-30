import { applyMiddleware, combineReducers, createStore } from "redux";
import createSagaMiddleware from "redux-saga";
import { cartReducer, UserAuthenticationReducer, userReducer } from "./Reducers";
import watcherSaga from "./watcherSaga";

const rootReducer = combineReducers({
    user:userReducer,
    cart:cartReducer,
    userData : UserAuthenticationReducer,
})
const sagaMiddleware = createSagaMiddleware();
const Store = createStore(rootReducer,applyMiddleware(sagaMiddleware))
sagaMiddleware.run(watcherSaga)

export default Store;