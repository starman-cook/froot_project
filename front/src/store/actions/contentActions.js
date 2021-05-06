import { push } from "connected-react-router";
import axiosApi from "../../axiosApi";

export const FETCH_CONTENT_LINKS_FOR_TODAY='FETCH_CONTENT_LINKS_FOR_TODAY';
export const FETCH_CONTENT_LINKS_ERRORS='FETCH_CONTENT_LINKS_ERRORS'

export const CHANGE_BUTTON_NAME='CHANGE_BUTTON_NAME';

export const SET_LOADING_TRUE='SET_LOADING_TRUE';
export const SET_LOADING_FALSE='SET_LOADING_FALSE';

export const SET_NEW_LINK_FOR_COUNT='SET_NEW_LINK_FOR_COUNT';

export const FETCH_CONTENT_REPORTS='FETCH_CONTENT_REPORTS';

export const SET_NEW_MERCHENT_FOR_CONTENTLINKS='SET_NEW_MERCHENT_FOR_CONTENTLINKS';

export const fetchContentLinksSuccess=value=>({type:FETCH_CONTENT_LINKS_FOR_TODAY,value});
export const fetchContentLinksFail=error=>({type:FETCH_CONTENT_LINKS_ERRORS,error});

export const fetchContentLinks=()=>{
    return async dispatch=>{
        try{
            const res=await axiosApi.get('/contentlinks');
            dispatch(fetchContentLinksSuccess(res.data));
        }
        catch(e){
            dispatch(fetchContentLinksFail(e));
        }
    }
}

export const addContentLink=object=>{
    return async dispatch=>{
        try{
            await axiosApi.post('/contentlinks',object);
            dispatch(push("/"));
            dispatch(push('/content-manager'));
        }
        catch(e){
            dispatch(fetchContentLinksFail(e));
        }
    }
}

export const changeButtonName=value=>({type:CHANGE_BUTTON_NAME,value});

export const setLoadingTrue=()=>({type:SET_LOADING_TRUE});
export const setLoadingFalse=()=>({type:SET_LOADING_FALSE});

export const setNewLinkForCount=value=>({type:SET_NEW_LINK_FOR_COUNT,value});

export const fetchContentReportsSuccess=value=>({type:FETCH_CONTENT_REPORTS,value});

export const fetchContentReports=()=>{
    return async dispatch=>{
        try{
            const resp=await axiosApi.get('/contentlinks/all');
            // const array=[];
            // for (let i in resp.data){
            //     const newReport={
            //         _id:Object.keys(resp.data).find(key =>resp.data[key] === resp.data[i]),
            //         options:resp.data[i]
            //     }
            //     array.push(newReport)
            // }
            dispatch(fetchContentReportsSuccess(resp.data));
        }
        catch(e){
            dispatch(fetchContentLinksFail(e));
        }
    }
}

export const setNewMerchentForContent=value=>({type:SET_NEW_MERCHENT_FOR_CONTENTLINKS,value});