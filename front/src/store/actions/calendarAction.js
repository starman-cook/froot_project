import axios from "../../axiosApi";

export const GET_ALL_CALENDAR_EVENTS = 'GET_ALL_CALENDAR_EVENTS'



export const getAllEventsSuccess = (value) => ({type: GET_ALL_CALENDAR_EVENTS, value})



export const getAllEvents = (room, fullDate) => {
    return async dispatch => {
        try {
            const response = await axios.get(`/calendarEvents/${room}/${fullDate}/daily`)
            console.log(response.data)
            dispatch(getAllEventsSuccess(response.data))
        } catch(err) {
            console.log(err)
        }
    }
}