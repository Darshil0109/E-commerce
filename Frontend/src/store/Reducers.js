import {
  FETCH_USER_FAILURE,
  FETCH_USER_REQUEST,
  FETCH_USER_SUCCESS,
  FETCH_CART_FAILURE,
  FETCH_CART_REQUEST,
  FETCH_CART_SUCCESS,
  ADD_CART_FAILURE,
  ADD_CART_REQUEST,
  ADD_CART_SUCCESS,
  DELETE_CART_REQUEST,
  DELETE_CART_SUCCESS,
  DELETE_CART_FAILURE,
  USER_AUTHENTICATION_REQUEST,
  USER_AUTHENTICATION_FAILURE,
  USER_AUTHENTICATION_SUCCESS,
} from "./Actions";

const userInitialState = {
  loading: false,
  users: [],
  error: null,
};
const cartInitialState = {
  loading: false,
  cart: [],
  error: null,
};

export const userReducer = (state = userInitialState, action) => {
  switch (action.type) {
    case FETCH_USER_REQUEST:
      return { ...state, loading: true };
    case FETCH_USER_SUCCESS:
      return { loading: false, users: action.payload, error: null };
    case FETCH_USER_FAILURE:
      return { loading: false, users: [], error: action.payload };
    default:
      return state;
  }
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
    default:
      return state;
  }
};

const userDataInitialState = {
  loading : false,
  userData : null,
  isLoggedIn : false,
  error : ''
}
export const UserAuthenticationReducer = (state = userDataInitialState , action) =>{
  switch (action.type) {
    case USER_AUTHENTICATION_REQUEST:
      return {loading:true,userData:null,isLoggedIn:false,error:''}
    case USER_AUTHENTICATION_SUCCESS:
      return {loading:false,userData:action.payload,isLoggedIn:true,error:''}
    case USER_AUTHENTICATION_FAILURE:
      return {loading:false,userData:null,isLoggedIn:false,error:action.payload}
    default:
      return state
  }
}