import { all } from "redux-saga/effects";
import { watchAddCartRequest, watchAddOrderRequest, watchAddProductsRequest, watchCartRequest,watchClearCartRequest,watchDeleteCartRequest, watchFetchOrderRequest, watchFetchProductsRequest, watchUserAuthenticationRequest } from "./Saga";

export default function* watcherSaga() {
    yield all([
      watchCartRequest(),
      watchAddCartRequest(),
      watchDeleteCartRequest(),
      watchUserAuthenticationRequest(),
      watchFetchOrderRequest(),
      watchAddOrderRequest(),
      watchClearCartRequest(),
      watchFetchProductsRequest(),
      watchAddProductsRequest(),
    ]);
  }