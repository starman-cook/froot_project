import { push } from "connected-react-router";
import axiosApi from "../../axiosApi";

export const FETCH_MEETINGS_SUCCESS='FETCH_MEETINGS_SUCCESS';
export const FETCH_MEETINGS_ERROR='FETCH_MEETINGS_ERROR';

export const fetchMeetingsSuccess=value=>({type:FETCH_MEETINGS_SUCCESS,value});
export const fetchMeetingsError=error=>({type:FETCH_MEETINGS_ERROR,error});

export const fetchMeetings=()=>{
    return async dispatch=>{
        try{
            const response = await axiosApi.get('/meetings');
            dispatch(fetchMeetingsSuccess(response.data));
        }
        catch(e){
            dispatch(fetchMeetingsError(e));
        }
    }
}

export const addMeeting=(object)=>{
    return async dispatch=>{
        try{
            await axiosApi.post('/meetings',object);
            dispatch(push("/"));
            dispatch(push("/meetings"));
        }
        catch(e){
            dispatch(fetchMeetingsError(e));
        }
    }
}

export const editMeeting=(id,object)=>{
    return async dispatch=>{
        try{
            await axiosApi.put('/meetings/'+id,object);
            dispatch(push("/"));
            dispatch(push("/meetings"));
        }
        catch(e){
            dispatch(fetchMeetingsError(e));
        }
    }
}

export const deleteMeeting=id=>{
    return async dispatch=>{
        try{
            await axiosApi.delete('/meetings/'+id);
            dispatch(push("/"));
            dispatch(push("/meetings"));
        }
        catch(e){
            dispatch(fetchMeetingsError(e));
        }
    }
}