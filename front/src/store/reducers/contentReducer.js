import {FETCH_CONTENT_REPORTS, GET_CONTENT, SET_ACTIVE_PAGE, SET_LOADER, SET_WORKER} from "../actions/contentActions";

const initialState = {
    content: {},
    activePage: 1,
    loader: false,
    worker: null,
    excel: null
}


const contentReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_CONTENT_REPORTS:
            return {...state, excel: action.value}
        case SET_WORKER:
            return {...state, worker: action.value}
        case SET_LOADER:
            return {...state, loader: action.value}
        case SET_ACTIVE_PAGE:
            return {...state, activePage: action.value}
        case GET_CONTENT:
            return {...state, content: action.value}
        default:
            return state
    }
}

export default contentReducer