import { all } from "redux-saga/effects";
import { watchAddCartRequest, watchCartRequest, watchUserRequest,watchDeleteCartRequest, watchUserAuthenticationRequest } from "./Saga";

export default function* watcherSaga() {
    yield all([
      watchCartRequest(),
      watchUserRequest(),
      watchAddCartRequest(),
      watchDeleteCartRequest(),
      watchUserAuthenticationRequest(),
    ]);
  }