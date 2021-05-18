import React, { useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addContentLink, changeButtonName, fetchContentLinks, setLoadingFalse, setLoadingTrue, setNewLinkForCount, setNewMerchentForContent } from '../../store/actions/contentActions';
import './ContentManagerForm.css';
import {apiURL} from '../../config';
import CircularProgress from '@material-ui/core/CircularProgress';
import {Route, Switch} from "react-router-dom";
import BigBrother from "../../components/BigBrother/BigBrother";

const ContentManagerForm=()=>{
    // const dispatch=useDispatch();
    // const amountLinks=useSelector(state=>state.contentLinks.contentLinks);
    // const {button,loading,url,merchent}=useSelector(state=>state.contentLinks);
    //
    // useEffect(()=>{
    //     dispatch(fetchContentLinks());
    // },[dispatch]);
    // useEffect(()=>{
    //     if(amountLinks.length && amountLinks[0].stopscreen){
    //         dispatch(changeButtonName('Старт'));
    //     }
    //     else if(!amountLinks.length){
    //         dispatch(changeButtonName('Старт'));
    //     }
    //     else{
    //         dispatch(changeButtonName('Стоп'));
    //     }
    // },[amountLinks]);
    //
    // const inputHandler = e => {
    //     const { name, value } = e.target;
    //     if(name==='url'){
    //         dispatch(setNewLinkForCount(value));
    //     }
    //     else if(name==='merchent'){
    //         dispatch(setNewMerchentForContent(value));
    //     }
    //
    // };
    //
    // const formSubmitHandler = async event => {
    //
    //     event.preventDefault();
    //     dispatch(setLoadingTrue());
    //     await dispatch(addContentLink({url,merchent}));
    //
    //     if(button==='Стоп'){
    //         dispatch(setNewLinkForCount(''));
    //     }
    //     dispatch(setLoadingFalse());
    // };
    //
    // const linkOfProductActive=(link)=>{
    //     return(
    //         <a href={link}>{link}</a>
    //     )
    // }
    //
    // let linksDiv=(
    //     <div>
    //         {
    //             amountLinks.map((item,i)=>{
    //                 let stopdate='В процессе';
    //                 if(item.stopdate){
    //                     stopdate=`${item.stopdate.slice(0,10)}, ${item.stopdate.slice(11,13)}:${item.stopdate.slice(14,16)}:${item.stopdate.slice(17,19)}`;
    //                 }
    //                 if(i===0){
    //                     return(
    //                         <div key={item._id} className='screen-outside'>
    //                             {linkOfProductActive(item.url)}
    //                             <div className='screen-flex'>
    //                                 <h4 className='screen-number'>{amountLinks.length-i}</h4>
    //                                 <div>
    //                                     <h4>
    //                                         First Screen
    //                                     </h4>
    //                                     {item.startscreen ?  <img src={`${apiURL}/uploads/${item.startscreen}`} alt='first screen' className='screen-shoot'/> : <img src='./no-image.jpeg' alt='first screen' className='screen-shoot'/> }
    //                                 </div>
    //                                 <div>
    //                                     <h4>
    //                                         Second Screen
    //                                     </h4>
    //                                     {item.stopscreen ? <img src={`${apiURL}/uploads/${item.stopscreen}`} alt='second screen' className='screen-shoot'/>: <img src='./no-image.jpeg' alt='second screen' className='screen-shoot'/>}
    //
    //                                 </div>
    //                                 <div>
    //                                     <p> Время начала: <b>{item.startdate.slice(0, 10)}, {item.startdate.slice(11, 13)}:{item.startdate.slice(14, 16)}:{item.startdate.slice(17,19)}</b></p>
    //                                     <p> Время окончания: <b>{stopdate}</b></p>
    //                                     <p>Мерчент: <b>{item.merchent}</b> </p>
    //                                 </div>
    //                             </div>
    //                         </div>
    //                     )
    //                 }
    //                 return(
    //                     <div key={item._id} className='screen-outside'>
    //                         {linkOfProductActive(item.url)}
    //                         <div className='screen-flex'>
    //                             <h4 className='screen-number'>{amountLinks.length-i}</h4>
    //                             <div>
    //                                 <p> Время начала: <b>{item.startdate.slice(0, 10)}, {item.startdate.slice(11, 13)}:{item.startdate.slice(14, 16)}:{item.startdate.slice(17,19)}</b></p>
    //                                 <p> Время окончания: <b>{stopdate}</b></p>
    //                                 <p>Мерчент: <b>{item.merchent}</b> </p>
    //                             </div>
    //                         </div>
    //                     </div>
    //                 )
    //             })
    //         }
    //     </div>
    // )
    const openBigBrother = (event) => {
        event.preventDefault()
        window.open("/bigbrother",'targetWindow',
            `toolbar=no,
                                    location=1,
                                    status=no,
                                    menubar=no,
                                    scrollbars=no,
                                    width=240,
                                    height=220`)}


    return(
        <>
            <div>
                <a className='btn BigBrother__btn--pushDown'  onClick={(event)=> {openBigBrother(event)}}>START DOING JOB</a>
            </div>

            {/*<form onSubmit={formSubmitHandler}>*/}
            {/*    <input type='text'value={url} className='screen-input' placeholder='Введите ссылку на редактируемый продукт' name='url' onChange={(e)=>inputHandler(e)}/>*/}
            {/*    <input type='text'value={merchent} className='screen-input' placeholder='Введите Мерчента' name='merchent' onChange={(e)=>inputHandler(e)}/>*/}
            {/*    <div className='counter-form-inside'>*/}
            {/*        <button type='submit' className='btn'>{button}</button>*/}
            {/*        {loading ? <CircularProgress/> :<div></div>}*/}
            {/*    </div>*/}
            {/*</form>*/}
            {/*{linksDiv}*/}
        </>
    )
};
export default ContentManagerForm;