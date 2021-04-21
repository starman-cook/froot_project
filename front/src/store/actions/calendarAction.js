import axios from "../../axiosApi";

export const GET_ALL_CALENDAR_EVENTS = 'GET_ALL_CALENDAR_EVENTS'
export const GET_BUSY_MONTH = 'GET_BUSY_MONTH'
export const GET_ALL_ROOMS = 'GET_ALL_ROOMS'


export const getAllEventsSuccess = (value) => ({type: GET_ALL_CALENDAR_EVENTS, value})
export const getBusyMonthSuccess = (value) => ({type: GET_BUSY_MONTH, value})
export const getAllRoomsSuccess = (value) => ({type: GET_ALL_ROOMS, value})

export const getAllEvents = (room, fullDate) => {
    return async dispatch => {
        try {
            const response = await axios.get(`/calendarEvents/${room}/${fullDate}/daily`)
            dispatch(getAllEventsSuccess(response.data))
        } catch(err) {
            console.log(err)
        }
    }
}

export const getBusyMonth = (room, date) => {
    return async dispatch => {
        try {
            const response = await axios.get(`/calendarEvents/${room}/${date}/monthly`)
            dispatch(getBusyMonthSuccess(response.data))
        } catch(err) {
            console.log(err)
        }
    }
}
export const createCalendarEvent = (data) => {
    return async () => {
        try {
            await axios.post(`/calendarEvents`, data)
        } catch(err) {
            console.log(err)
        }
    }
}

export const deleteCalendarEvent = (id) => {
    return async () => {
        try {
            await axios.delete(`/calendarEvents/${id}`)
        } catch(err) {
            console.log(err)
        }
    }
}

export const addNewRoom = (name) => {
    return async () => {
        try {
            await axios.post(`/rooms`, name)
        } catch(err) {
            console.log(err)
        }
    }
}

export const getAllRooms = () => {
    return async dispatch => {
        try {
            const response = await axios.get(`/rooms`)
            dispatch(getAllRoomsSuccess(response.data))
        } catch(err) {
            console.log(err)
        }
    }
}
export const deleteRoom = (id) => {
    return async () => {
        try {
            await axios.delete(`/rooms/${id}`)
        } catch(err) {
            console.log(err)
        }
    }
}