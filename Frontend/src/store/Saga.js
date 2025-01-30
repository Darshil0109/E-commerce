import axios from "axios";
import Cookies from "js-cookie";
import {jwtDecode} from "jwt-decode";
import { call, put, takeLatest,takeEvery } from "redux-saga/effects";
import { ADD_CART_REQUEST, addCartFailure, addCartSuccess, FETCH_USER_REQUEST, fetchUserFailure, fetchUserSuccess,deleteCartSuccess,deleteCartFailure,DELETE_CART_REQUEST, USER_AUTHENTICATION_REQUEST,  userAuthenticationFailure, userAuthenticationSuccess } from "./Actions";
import { FETCH_CART_REQUEST, fetchCartFailure, fetchCartRequest, fetchCartSuccess } from "./Actions";
import { toast } from 'react-toastify';
const loginUser = async () => {
  const user = await axios.post(`${import.meta.env.VITE_API_URL}/api/users/login`,
    {
      email: "darshil01092004@gmail.com",
      password: "Darshil",
    }
  );
  return user;
};
function* getUserData() {
  try {
    const user = yield call(loginUser);
    yield put(fetchUserSuccess(user.data));
    yield put(fetchCartRequest(user.data.userId))
  } catch (error) {
    yield put(fetchUserFailure(error.message));
  }
}
export function* watchUserRequest() {
  yield takeLatest(FETCH_USER_REQUEST, getUserData);
}

//Cart
const getCart = async (userId) => {
  const cart = await axios.get(
    `${import.meta.env.VITE_API_URL}/api/cart/${userId}`
  );
  return cart.data;
};

function* getCartData(action) {
  try {
    const cart = yield call(getCart,action.payload);
    yield put(fetchCartSuccess(cart));
  } catch (error) {
    yield put(fetchCartFailure(error.message));
  }
}

const addCart = async (payload) => {
  const response = await axios.post(
    `${import.meta.env.VITE_API_URL}/api/cart/`,
    {
      userId:payload.userId,
      productId:payload.productId,
      quantity:payload.quantity,
    }
  );
  return response.data;
};
function* addCartData(action) {
  try {
    const cart = yield call(addCart,action.payload)
    toast.success("Added to Cart!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    yield put(addCartSuccess(cart));
  } catch (error) {
    yield put(addCartFailure(error.message));
  }
}

const deleteProduct = async(action) =>{
  const response = await axios.delete(`${import.meta.env.VITE_API_URL}/api/cart/${action.userId}`,{
    data:{
      productId:action._id,
    }
  })
  return response.data.updatedCart.products
}
function* deleteCartData(action){
    try {
      const deletedProduct = yield call(deleteProduct,action.payload)
      toast.warn('Item removed from cart!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      yield put(deleteCartSuccess(deletedProduct))
    } catch (error) {
      yield put(deleteCartFailure(error.message))
    }
}

export function* watchCartRequest() {
  yield takeLatest(FETCH_CART_REQUEST,getCartData);
}
export function* watchAddCartRequest() {
  yield takeLatest(ADD_CART_REQUEST,addCartData);
}
export function* watchDeleteCartRequest(){
  yield takeEvery(DELETE_CART_REQUEST,deleteCartData)
}


//UserData

export function* validateUser(){
  const token = Cookies.get("token");

  if (token){
    try {
      // Decode the token
      const decoded = jwtDecode(token);
      yield put(userAuthenticationSuccess(decoded));
    } catch (error) {
      yield put(userAuthenticationFailure(error.message))
    }
  }
  else{
    yield put(userAuthenticationFailure('Invalid Token or Token not Generated'))
  }
}

export function* watchUserAuthenticationRequest() {
  yield takeLatest(USER_AUTHENTICATION_REQUEST,validateUser);
}