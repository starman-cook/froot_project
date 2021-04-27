import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchContentReports } from '../../store/actions/contentActions';
import moment from 'moment';
import {apiURL} from '../../config';

const ContenLinksReport=()=>{
    const dispatch=useDispatch();
    const {contentReports}=useSelector(state=>state.contentLinks);
    useEffect(()=>{ 
        dispatch(fetchContentReports());
    },[dispatch]);
    const array=[];
    for(let i in contentReports){
        array.push(contentReports[i]);
    }
    console.log(array)

    const reportsDiv=(
        <div>
            {
                array.map(item=>{
                    const userContentlinks=item.userContentlinks;
                    return(
                        <div key={Math.random()}>
                            <h3>{item.userData.name}, {item.userData.workEmail}</h3>
                            {
                                userContentlinks.map((i,n)=>{
                                    const hour=i.stopdate.slice(11,13)-i.startdate.slice(11,13);
                                    const minute=i.stopdate.slice(14,16)-i.startdate.slice(14,16);

                                    return(
                                        <div>
                                            <h4>{n+1}</h4>
                                            <div>
                                                <a href={i.url}>{i.url}</a>
                                                <p>Время: {hour>0 ? hour+' часов, ' : ' '} {minute>0 ? minute+' минут,':' '} {i.stopdate.slice(17,19)-i.startdate.slice(17,19)} секунд</p>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    )
                })
               
            }
        </div>
    )
    const src=(apiURL+'/files/ContentReport_' + moment().format('DD-MM-YYYY-HH-mm-ss') + '.xlsx')
    return(
        <>
            <a href={src} download>Download Report</a>
            {reportsDiv}
        </>
    )
}
export default ContenLinksReport;