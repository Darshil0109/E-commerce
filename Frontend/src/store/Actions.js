export const FETCH_USER_REQUEST = 'FETCH_USER_REQUEST'
export const FETCH_USER_SUCCESS = 'FETCH_USER_SUCCESS'
export const FETCH_USER_FAILURE = 'FETCH_USER_FAILURE'

export const FETCH_CART_REQUEST = 'FETCH_CART_REQUEST'
export const FETCH_CART_SUCCESS = 'FETCH_CART_SUCCESS' 
export const FETCH_CART_FAILURE = 'FETCH_CART_FAILURE' 
export const ADD_CART_REQUEST = 'ADD_CART_REQUEST'
export const ADD_CART_SUCCESS = 'ADD_CART_SUCCESS' 
export const ADD_CART_FAILURE = 'ADD_CART_FAILURE' 
export const DELETE_CART_REQUEST = 'DELETE_CART_REQUEST'
export const DELETE_CART_SUCCESS = 'DELETE_CART_SUCCESS'
export const DELETE_CART_FAILURE = 'DELETE_CART_FAILURE'

export const fetchUserRequest = () =>({
    type: FETCH_USER_REQUEST
})
export const fetchUserSuccess = (users) =>({
    type: FETCH_USER_SUCCESS,
    payload : users
})
export const fetchUserFailure = (error) =>({
    type: FETCH_USER_FAILURE,
    payload : error
})


// Check User is Authenticated 
export const USER_AUTHENTICATION_REQUEST = 'USER_AUTHENTICATION_REQUEST';
export const USER_AUTHENTICATION_SUCCESS = 'USER_AUTHENTICATION_SUCCESS';
export const USER_AUTHENTICATION_FAILURE = 'USER_AUTHENTICATION_FAILURE';

export const userAuthenticationRequest = () =>({
    type : USER_AUTHENTICATION_REQUEST,
})
export const userAuthenticationSuccess = (userData) =>({
    type : USER_AUTHENTICATION_SUCCESS,
    payload : userData,
})
export const userAuthenticationFailure = (error) =>({
    type : USER_AUTHENTICATION_FAILURE,
    payload : error,
})

//cart 
export const fetchCartRequest = (userID) =>({
    type: FETCH_CART_REQUEST,
    payload:userID
})
export const fetchCartSuccess = (cart) =>({
    type: FETCH_CART_SUCCESS,
    payload : cart
})
export const fetchCartFailure = (error) =>({
    type: FETCH_CART_FAILURE,
    payload : error
})
export const addCartRequest = (product) =>({
    type: ADD_CART_REQUEST,
    payload:product
})
export const addCartSuccess = (product) =>({
    type: ADD_CART_SUCCESS,
    payload : product
})
export const addCartFailure = (error) =>({
    type: ADD_CART_FAILURE,
    payload : error
})

export const deleteCartRequest = (product) =>({
    type:DELETE_CART_REQUEST,
    payload:product,
})
export const deleteCartSuccess = (product) =>({
    type:DELETE_CART_SUCCESS,
    payload:product,
})
export const deleteCartFailure = (error) =>({
    type:DELETE_CART_FAILURE,
    payload:error
})