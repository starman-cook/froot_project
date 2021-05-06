import { CHANGE_BUTTON_NAME, FETCH_CONTENT_LINKS_ERRORS, FETCH_CONTENT_LINKS_FOR_TODAY, FETCH_CONTENT_REPORTS, SET_LOADING_FALSE, SET_LOADING_TRUE, SET_NEW_LINK_FOR_COUNT, SET_NEW_MERCHENT_FOR_CONTENTLINKS } from "../actions/contentActions"

const initialState = {
    contentLinks:[],
    contentErrors:null,
    button:'Старт',
    loading:false,
    url:'',
    merchent:'',
    contentReports:{}
}


const contentReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_CONTENT_LINKS_FOR_TODAY:
            return {...state, contentLinks:action.value,contentErrors:null}
        case FETCH_CONTENT_LINKS_ERRORS:
            return {...state, contentErrors:action.error}
        case CHANGE_BUTTON_NAME:
            return {...state, button:action.value}
        case SET_LOADING_TRUE:
            return {...state,loading:true};
        case SET_LOADING_FALSE:
            return {...state, loading:false};
        case SET_NEW_LINK_FOR_COUNT:
            return {...state, url:action.value};
        case FETCH_CONTENT_REPORTS:
            return{...state,contentReports:action.value, contentErrors:null}
        case SET_NEW_MERCHENT_FOR_CONTENTLINKS:
            return {...state, merchent:action.value}

        default:
            return state
    }
}

export default contentReducer