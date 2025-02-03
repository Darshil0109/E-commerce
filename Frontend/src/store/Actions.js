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






export const FETCH_CART_REQUEST = 'FETCH_CART_REQUEST'
export const FETCH_CART_SUCCESS = 'FETCH_CART_SUCCESS' 
export const FETCH_CART_FAILURE = 'FETCH_CART_FAILURE' 
export const ADD_CART_REQUEST = 'ADD_CART_REQUEST'
export const ADD_CART_SUCCESS = 'ADD_CART_SUCCESS' 
export const ADD_CART_FAILURE = 'ADD_CART_FAILURE' 
export const DELETE_CART_REQUEST = 'DELETE_CART_REQUEST'
export const DELETE_CART_SUCCESS = 'DELETE_CART_SUCCESS'
export const DELETE_CART_FAILURE = 'DELETE_CART_FAILURE'
export const CLEAR_CART_REQUEST = 'CLEAR_CART_REQUEST'
export const CLEAR_CART_SUCCESS = 'CLEAR_CART_SUCCESS'
export const CLEAR_CART_FAILURE = 'CLEAR_CART_FAILURE'
export const UPDATE_QUANTITY = 'UPDATE_QUANTITY'

export const updateProductQuantity = (id, quantity)=>({
    type:UPDATE_QUANTITY,
    payload:{id,quantity}
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


export const clearCartRequest = (payload) =>({
    type:CLEAR_CART_REQUEST,
    payload:payload
})
export const clearCartSuccess = (cart) =>({
    type:CLEAR_CART_SUCCESS,
    payload:cart
})
export const clearCartFailure = (error) =>({
    type:CLEAR_CART_FAILURE,
    payload:error
})




export const FETCH_ORDER_REQUEST = 'FETCH_ORDER_REQUEST'
export const FETCH_ORDER_SUCCESS = 'FETCH_ORDER_SUCCESS'
export const FETCH_ORDER_FAILURE = 'FETCH_ORDER_FAILURE'

export const fetchOrderRequest=(userId)=>({
    type:FETCH_ORDER_REQUEST,
    payload:userId,
})
export const fetchOrderSuccess=(order)=>({
    type:FETCH_ORDER_SUCCESS,
    payload:order,
})
export const fetchOrderFailure=(error)=>({
    type:FETCH_ORDER_FAILURE,
    payload:error,
})


export const ADD_ORDER_REQUEST = 'ADD_ORDER_REQUEST'
export const ADD_ORDER_SUCCESS = 'ADD_ORDER_SUCCESS'
export const ADD_ORDER_FAILURE = 'ADD_ORDER_FAILURE'

export const addOrderRequest=(cart)=>({
    type:ADD_ORDER_REQUEST,
    payload:cart,
})
export const addOrderSuccess=(order)=>({
    type:ADD_ORDER_SUCCESS,
    payload:order,
})
export const addOrderFailure=(error)=>({
    type:ADD_ORDER_FAILURE,
    payload:error,
})


export const FETCH_PRODUCTS_REQUEST = 'FETCH_PRODUCTS_REQUEST'
export const FETCH_PRODUCTS_SUCCESS = 'FETCH_PRODUCTS_SUCCESS'
export const FETCH_PRODUCTS_FAILURE = 'FETCH_PRODUCTS_FAILURE'
export const ADD_PRODUCTS_REQUEST = 'ADD_PRODUCTS_REQUEST'
export const ADD_PRODUCTS_SUCCESS = 'ADD_PRODUCTS_SUCCESS'
export const ADD_PRODUCTS_FAILURE = 'ADD_PRODUCTS_FAILURE'
export const fetchProductsRequest=()=>({
    type:FETCH_PRODUCTS_REQUEST,
})
export const fetchProductsSuccess=(products)=>({
    type:FETCH_PRODUCTS_SUCCESS,
    payload:products,
})
export const fetchProductsFailure=(error)=>({
    type:FETCH_PRODUCTS_FAILURE,
    payload:error,
})
export const addProductsRequest=(product)=>({
    type:ADD_PRODUCTS_REQUEST,
    payload:product
})
export const addProductsSuccess=(products)=>({
    type:ADD_PRODUCTS_SUCCESS,
    payload:products,
})
export const addProductsFailure=(error)=>({
    type:ADD_PRODUCTS_FAILURE,
    payload:error,
})