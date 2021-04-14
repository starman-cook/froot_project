import {GET_ALL_CALENDAR_EVENTS} from "../actions/calendarAction";


const initialState = {
    events: null
}


const calendarReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ALL_CALENDAR_EVENTS:
            return {...state, events: action.value}
        default:
            return state
    }
}

export default calendarReducer