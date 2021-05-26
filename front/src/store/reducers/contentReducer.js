import {GET_CONTENT} from "../actions/contentActions";

const initialState = {
    content:[]
}


const contentReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_CONTENT:
            return {...state, content: action.value}
        default:
            return state
    }
}

export default contentReducer