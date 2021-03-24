import { DELETE_USER_SUCCESS, FETCH_ALL_USERS_SUCCESS, FETCH_USER_BY_ID_SUCCESS, LOGIN_USER_FAILURE, LOGIN_USER_SUCCESS, LOGOUT_USER, REGISTER_USER_FAILURE, REGISTER_USER_SUCCESS } from "../actions/usersActions";

const initialState = {
    registerError: null,
    loginError: null,
    user: null,
    users: null,
    userById: null
}
const usersReducer = (state=initialState, action) => {
    switch (action.type) {
        case REGISTER_USER_SUCCESS:
            return {...state, registerError: null};
        case REGISTER_USER_FAILURE:
            return {...state, registerError: action.error};
        case LOGIN_USER_SUCCESS:
            return {...state, user: action.user, loginError: null};
        case LOGIN_USER_FAILURE:
            return {...state, loginError: action.error};
        case LOGOUT_USER:
            return {...state, user: null}
        case FETCH_ALL_USERS_SUCCESS:
            return {...state, users: action.users}
        case FETCH_USER_BY_ID_SUCCESS:
            return {...state, userById: action.user}
        case DELETE_USER_SUCCESS:
            return {...state,users: state.users.filter(element =>(element._id !== action.user._id))}
        default:
            return state;
    }
}
export default usersReducer;