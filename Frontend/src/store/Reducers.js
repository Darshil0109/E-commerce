import {
  FETCH_CART_FAILURE,
  FETCH_CART_REQUEST,
  FETCH_CART_SUCCESS,
  ADD_CART_FAILURE,
  ADD_CART_REQUEST,
  ADD_CART_SUCCESS,
  DELETE_CART_REQUEST,
  DELETE_CART_SUCCESS,
  DELETE_CART_FAILURE,
  FETCH_ORDER_REQUEST,
  FETCH_ORDER_SUCCESS,
  FETCH_ORDER_FAILURE,
  ADD_ORDER_REQUEST,
  ADD_ORDER_SUCCESS,
  ADD_ORDER_FAILURE,
  CLEAR_CART_REQUEST,
  CLEAR_CART_SUCCESS,
  CLEAR_CART_FAILURE,
} from "./Actions";

import {USER_AUTHENTICATION_REQUEST,USER_AUTHENTICATION_FAILURE,USER_AUTHENTICATION_SUCCESS,} from './Actions'


const cartInitialState = {
  loading: false,
  cart: [],
  error: null,
};

export const cartReducer = (state = cartInitialState, action) => {
  switch (action.type) {
    case FETCH_CART_REQUEST:
      return { ...state, loading: true };
    case FETCH_CART_SUCCESS:
      return { loading: false, cart: action.payload.products, error: null };
    case FETCH_CART_FAILURE:
      return { loading: false, cart: [], error: action.payload };
    case ADD_CART_REQUEST:
      return state;
    case ADD_CART_SUCCESS:
      return {loading: false,cart: action.payload.cart.products,error: null};
    case ADD_CART_FAILURE:
      return { loading: false, cart: [], error: action.payload };
    case DELETE_CART_REQUEST:
      return state;
    case DELETE_CART_SUCCESS:
        return {
            loading:false,
            cart: action.payload,
            error:null
          };
          
    case DELETE_CART_FAILURE:
      return { loading: false, cart: [], error: action.payload };
      
    case CLEAR_CART_REQUEST:
      return state;
    case CLEAR_CART_SUCCESS:
        return {loading:false,cart: [],error:null};
    case CLEAR_CART_FAILURE:
      return { loading: false, cart: null, error: action.payload };
    default:
      return state;
  }
};
const orderInitialState = {
  loading : false,
  orders : null,
  error : ''
}
export const OrderReducer = (state = orderInitialState,action) =>{
  switch (action.type) {
    case FETCH_ORDER_REQUEST:
      return {...state,loading:true} 
    case FETCH_ORDER_SUCCESS:
      return {loading:false,orders:action.payload,error:''}
    case FETCH_ORDER_FAILURE:
      return {loading:false,orders:null,error:action.payload}
    case ADD_ORDER_REQUEST:
      return state 
    case ADD_ORDER_SUCCESS:
      return {loading:false,orders:action.payload,error:''}
    case ADD_ORDER_FAILURE:
      return {loading:false,orders:null,error:action.payload}
    default:
      return state;
  }
}

const userDataInitialState = {
  loading : false,
  userData : null,
  isLoggedIn : false,
  error : ''
}
export const UserAuthenticationReducer = (state = userDataInitialState , action) =>{
  switch (action.type) {
    case USER_AUTHENTICATION_REQUEST:
      return state
    case USER_AUTHENTICATION_SUCCESS:
      return {loading:false,userData:action.payload,isLoggedIn:true,error:''}
    case USER_AUTHENTICATION_FAILURE:
      return {loading:false,userData:null,isLoggedIn:false,error:action.payload}
    default:
      return state
  }
}