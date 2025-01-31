import { all } from "redux-saga/effects";
import { watchAddCartRequest, watchAddOrderRequest, watchCartRequest,watchClearCartRequest,watchDeleteCartRequest, watchFetchOrderRequest, watchUserAuthenticationRequest } from "./Saga";

export default function* watcherSaga() {
    yield all([
      watchCartRequest(),
      watchAddCartRequest(),
      watchDeleteCartRequest(),
      watchUserAuthenticationRequest(),
      watchFetchOrderRequest(),
      watchAddOrderRequest(),
      watchClearCartRequest(),
    ]);
  }