// import { push } from "connected-react-router";
import axiosApi from "../../axiosApi";

export const SET_ACTIVE_PAGE = 'SET_ACTIVE_PAGE'
export const GET_CONTENT = 'GET_CONTENT'
export const SET_LOADER = 'SET_LOADER'
export const SET_WORKER = 'SET_WORKER'

export const FETCH_CONTENT_REPORTS='FETCH_CONTENT_REPORTS';
export const fetchContentReportsSuccess= (value) => ({type:FETCH_CONTENT_REPORTS, value});


export const setWorker = (value) => ({type: SET_WORKER, value})

export const setLoader = (value) => ({type: SET_LOADER, value})

export const setActivePage = (value) => ({type: SET_ACTIVE_PAGE, value})

export const getContent = (value) => ({type: GET_CONTENT, value})

export const getAllContent = (page) => {
    return async dispatch => {
        try {
            const response = await axiosApi.get(`/bigBrother/all?page=${page}`)
            await dispatch(getContent(response.data))
            dispatch(setLoader(false))
        } catch(err) {
            console.log(err)
        }
    }
}


export const getContentByUser = (id, page) => {
    return async dispatch => {
        try {
            const response = await axiosApi.get(`/bigBrother/single?userId=${id}&page=${page}`)
            await dispatch(getContent(response.data))
            dispatch(setLoader(false))
            console.log("CONTENT RESPONSE BY USER *********  ",response.data)
        } catch(err) {
            console.log(err)
        }
    }
}


// Excel
export const fetchContentReports=()=>{
    return async dispatch=>{
        try{
            const resp=await axiosApi.get('/bigBrother/excel');
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
        catch(err){
            console.log(err)
        }
    }
}




























//
// export const FETCH_CONTENT_LINKS_FOR_TODAY='FETCH_CONTENT_LINKS_FOR_TODAY';
// export const FETCH_CONTENT_LINKS_ERRORS='FETCH_CONTENT_LINKS_ERRORS'
//
// export const CHANGE_BUTTON_NAME='CHANGE_BUTTON_NAME';
//
// export const SET_LOADING_TRUE='SET_LOADING_TRUE';
// export const SET_LOADING_FALSE='SET_LOADING_FALSE';
//
// export const SET_NEW_LINK_FOR_COUNT='SET_NEW_LINK_FOR_COUNT';
//
//
// export const SET_NEW_MERCHENT_FOR_CONTENTLINKS='SET_NEW_MERCHENT_FOR_CONTENTLINKS';
//
// export const fetchContentLinksSuccess=value=>({type:FETCH_CONTENT_LINKS_FOR_TODAY,value});
// export const fetchContentLinksFail= (error) =>({type:FETCH_CONTENT_LINKS_ERRORS,error});
//
// export const fetchContentLinks=()=>{
//     return async dispatch=>{
//         try{
//             const res=await axiosApi.get('/contentlinks');
//             dispatch(fetchContentLinksSuccess(res.data));
//         }
//         catch(e){
//             dispatch(fetchContentLinksFail(e));
//         }
//     }
// }
//
// export const addContentLink=object=>{
//     return async dispatch=>{
//         try{
//             await axiosApi.post('/contentlinks',object);
//             dispatch(push("/"));
//             dispatch(push('/content-manager'));
//         }
//         catch(e){
//             dispatch(fetchContentLinksFail(e));
//         }
//     }
// }
//
// export const changeButtonName=value=>({type:CHANGE_BUTTON_NAME,value});
//
// export const setLoadingTrue=()=>({type:SET_LOADING_TRUE});
// export const setLoadingFalse=()=>({type:SET_LOADING_FALSE});
//
// export const setNewLinkForCount=value=>({type:SET_NEW_LINK_FOR_COUNT,value});
//
//

//
// export const setNewMerchentForContent=value=>({type:SET_NEW_MERCHENT_FOR_CONTENTLINKS,value});