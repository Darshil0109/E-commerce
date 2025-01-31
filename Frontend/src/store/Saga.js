import axios from "axios";
import Cookies from "js-cookie";
import {jwtDecode} from "jwt-decode";
import { call, put, takeLatest,takeEvery } from "redux-saga/effects";
import { ADD_CART_REQUEST, addCartFailure, addCartSuccess, deleteCartSuccess,deleteCartFailure,DELETE_CART_REQUEST, USER_AUTHENTICATION_REQUEST,  userAuthenticationFailure, userAuthenticationSuccess, FETCH_ORDER_REQUEST, fetchOrderFailure, fetchOrderSuccess, ADD_ORDER_REQUEST, addOrderFailure, addOrderSuccess, clearCartSuccess, clearCartFailure, CLEAR_CART_REQUEST, clearCartRequest } from "./Actions";
import { FETCH_CART_REQUEST, fetchCartFailure, fetchCartRequest, fetchCartSuccess } from "./Actions";
import { toast } from 'react-toastify';

//Cart
const getCart = async (userId) => {
  const cart = await axios.get(
    `${import.meta.env.VITE_API_URL}/api/cart/${userId}`
  );
  return cart.data[0];
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

const clearCart =async(userId) =>{
  try {
    const cart = await axios.put(`${import.meta.env.VITE_API_URL}/api/users/clearcart`,{
      userId:userId,
    })
    return cart
  } catch (error) {
    console.log(error); 
  }
}

function* clearCartData(action){
    try {
      const cart = yield call(clearCart,action.payload)
      toast.warn('Items Ordered', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      yield put(clearCartSuccess(cart))
      
    } catch (error) {
      yield put(clearCartFailure(error.message))
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
export function* watchClearCartRequest(){
  yield takeEvery(CLEAR_CART_REQUEST,clearCartData)
}


//UserData

export function* validateUser(){
  const token = Cookies.get("token");
  if (token){
    try {
      // Decode the token
      const decoded = jwtDecode(token);
      yield put(userAuthenticationSuccess(decoded));
      yield put(fetchCartRequest(decoded.id))
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


const getOrders = async(userId) =>{
  const order = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/orders/${userId}`)
  return order.data;
}

export function* getOrderData(action){
  try {
    const orders = yield call(getOrders,action.payload)
    yield put(fetchOrderSuccess(orders))
  } catch (error) {
    yield put(fetchOrderFailure(error.message))
  }

}

export function* watchFetchOrderRequest(){
  yield takeLatest(FETCH_ORDER_REQUEST,getOrderData)
}
const addOrders = async(payload) =>{
  const order = await axios.post(`${import.meta.env.VITE_API_URL}/api/users/orders`,{
    userid : payload.userid,
    items: payload.items,
    price : payload.price,
  })
  return order.data;
}

export function* addOrderData(action){
  try {
    const orders = yield call(addOrders,action.payload)
    
    yield put(addOrderSuccess(orders))
    yield put(clearCartRequest(orders.userId))
  } catch (error) {
    console.log("error",error);
    
    yield put(addOrderFailure(error.message))
  }

}

export function* watchAddOrderRequest(){
  yield takeLatest(ADD_ORDER_REQUEST,addOrderData)
}

