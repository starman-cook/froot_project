import { FETCH_MEETINGS_ERROR, FETCH_MEETINGS_SUCCESS } from "../actions/meetingAction";

const initialState = {
    appointments:[
        // {
        //     title: 'Plan',
        //     startDate: new Date(2021, 2, 28, 9, 35),
        //     endDate: new Date(2021, 2, 28, 11, 30),
        //     id: 0,
        //     _id: 0,
        //     location: 'Room 1',
        //   }, 
        //  {
    
        //   title: 'Approve New Online Marketing Strategy',
        //   startDate: new Date(2021, 2, 23, 12, 35),
        //   endDate: new Date(2021, 2, 23, 14, 15),
        //   id: 23,
        //   _id: 23,
        //   location: 'Room 3',
        // }, 
        // {
    
        //     title: 'Appy',
        //     startDate: new Date(2021, 2, 23, 12, 35),
        //     endDate: new Date(2021, 2, 23, 14, 15),
        //     id: 22,
        //     _id: 22,
        //     location: 'Room 2',
        //   },
        //   {
    
        //     title: 'Appyljblj',
        //     startDate: new Date(2021, 2, 25,9,0),
        //     endDate: new Date(2021, 2, 25,18,0),
        //     id: 21,
        //     _id: 21,
        //     location: 'Room 1',
        //   },
    ],
    meetingError:null
  };
  
  const meetingReducer = (state = initialState, action) => {
    switch (action.type) {
      case FETCH_MEETINGS_SUCCESS:
          return {...state, meetingError:null,appointments:action.value};
      case FETCH_MEETINGS_ERROR:
          return {...state,meetingError:action.error };

      default:
        return state ;
    }
  };
  
  export default meetingReducer;