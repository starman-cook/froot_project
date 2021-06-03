import {
    GET_ALL_CALENDAR_EVENTS,
    GET_ALL_ROOMS,
    GET_BUSY_MONTH,
    GET_USER_EVENTS,
    SET_LOADER
} from "../actions/calendarAction";


const initialState = {
    events: null,
    busyMonth: null,
    rooms: [],
    userEvents: null,
    loader: null
}


const calendarReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_LOADER:
            return {...state, loader: action.value}
        case GET_USER_EVENTS:
            return {...state, userEvents: action.value}
        case GET_ALL_CALENDAR_EVENTS:
            return {...state, events: action.value}
        case GET_BUSY_MONTH:
            return {...state, busyMonth: action.value}
        case GET_ALL_ROOMS:
            return {...state, rooms: action.value}
        default:
            return state
    }
}

export default calendarReducer