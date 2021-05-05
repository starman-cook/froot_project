import { push } from 'connected-react-router'
import axiosApi from '../../axiosApi'

export const REGISTER_USER_SUCCESS = 'REGISTER_USER_SUCCESS'
export const REGISTER_USER_FAILURE = 'REGISTER_USER_FAILURE'
export const LOGIN_USER_SUCCESS = 'LOGIN_USER_SUCCESS'
export const LOGIN_USER_FAILURE = 'LOGIN_USER_FAILURE'
export const LOGOUT_USER = 'LOGOUT_USER'
export const FETCH_ALL_USERS_SUCCESS = 'FETCH_ALL_USERS_SUCCESS';
export const FETCH_USER_BY_ID_SUCCESS = 'FETCH_USER_BY_ID_SUCCESS';
export const DELETE_USER_SUCCESS = 'DELETE_USER_SUCCESS';

const deleteUserSuccess = user => {
    return { type: DELETE_USER_SUCCESS, user }
}
const fetchUserByIdSuccess = user => {
    return { type: FETCH_USER_BY_ID_SUCCESS, user }
}
const registerUserSuccess = () => {
    return { type: REGISTER_USER_SUCCESS }
}
const registerUserFailure = error => {
    return { type: REGISTER_USER_FAILURE, error }
}
const loginUserSuccess = (user) => {
    return { type: LOGIN_USER_SUCCESS, user }
}
const loginUserFailure = error => {
    return { type: LOGIN_USER_FAILURE, error }
}
const fetchAllUsersSuccess = users => {
    return { type: FETCH_ALL_USERS_SUCCESS, users }
}

export const editUsersData = (id, data) => {
    return async dispatch => {
        try {
            await axiosApi.put('/users/' + id + '/edit', data);
        } catch (e) {
            console.error(e);
        }
    }
};
export const deleteUser = id => {
    return async dispatch => {
        try {
            const response = await axiosApi.delete('/users/' + id + '/delete');
            dispatch(deleteUserSuccess(response.data));
        } catch (e) {
            console.error(e);
        }
    }
}
export const fetchUserByID = id => {
    return async dispatch => {
        try {
            const response = await axiosApi.get('/users/' + id);
            dispatch(fetchUserByIdSuccess(response.data));
            return Promise.resolve(response.data)
        } catch (e) {
            console.error(e);
        }
    }
}

export const fetchAllUsers = () => {
    return async dispatch => {
        try {
            const response = await axiosApi.get('/users');
            dispatch(fetchAllUsersSuccess(response.data));
        } catch (e) {
            console.error(e);
        }
    }
}
export const registerUser = userData => {
    return async dispatch => {
        try {
            await axiosApi.post('/users', userData)
            dispatch(registerUserSuccess())
            dispatch(push('/'))
        } catch (e) {
            if (e.response && e.response.data) {
                dispatch(registerUserFailure(e.response.data))
            } else {
                dispatch(registerUserFailure({ global: 'No internet' }))
            }
        }
    }
}

export const loginUser = userData => {
    return async dispatch => {
        try {
            const response = await axiosApi.post('/users/sessions', userData)
            dispatch(loginUserSuccess(response.data.user))
            dispatch(push('/'))
        } catch (e) {
            if (e.response && e.response.data) {
                dispatch(loginUserFailure(e.response.data))
            } else {
                dispatch(loginUserFailure({ global: 'No internet' }))
            }
        }
    }
}
export const logoutUser = () => {
    return async dispatch => {
        try {
            await axiosApi.delete('/users/sessions');
        } catch (error) {
            console.log(error);
        }
        dispatch({ type: LOGOUT_USER })
        dispatch(push('/'))
    }
}