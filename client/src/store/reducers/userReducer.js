import {
  SIGNUP_LOADING,
  SIGNUP_ERROR,
  SIGNUP_SUCCESS,
  DELETE_ERROR,
  LOGIN_LOADING,
  LOGIN_SUCCESS,
  LOGIN_ERROR,
  SET_CURRENT_USER,
  SET_CURRENT_USER_ERROR,
  SET_CURRENT_USER_LOADING
} from '../types/userTypes';

const initialState = {
  isAuthenticated: false,
  userData: null,
  error: null,
  loading: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SIGNUP_ERROR:
      return {
        ...state,
        loading: false,
        error: action.errormsg
      };
    case SIGNUP_SUCCESS:
      return {
        ...state,
        error: null,
        loading: false,
        userData: action.payload,
        isAuthenticated: true
      };
    case SIGNUP_LOADING:
      return {
        ...state,
        loading: true,
        error: null
      };
    case DELETE_ERROR:
      return {
        ...state,
        error: null
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        error: null,
        loading: false,
        isAuthenticated: true,
        userData: action.payload
      };
    case LOGIN_ERROR:
      return {
        ...state,
        error: action.errormsg,
        loading: false
      };
    case LOGIN_LOADING:
      return {
        ...state,
        error: null,
        loading: true
      };
    case SET_CURRENT_USER:
      return {
        ...state,
        userData: action.payload,
        error: null,
        loading: false,
        isAuthenticated: true
      };
    case SET_CURRENT_USER_ERROR:
      return {
        ...state,
        error: action.errormsg,
        loading: false
      };
    case SET_CURRENT_USER_LOADING:
      return {
        ...state,
        loading: true,
        error: null
      };
    default:
      return state;
  }
};
