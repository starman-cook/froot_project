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
                array.map((item, i)=>{
                    const userContentlinks=item.userContentlinks;
                    return(
                        <div key={i}>
                            <h3>{item.userData.name}, {item.userData.workEmail}</h3>
                            {
                                userContentlinks.map((n,i)=>{
                                    const dif = new Date(n.stopdate).valueOf() - new Date(n.startdate).valueOf()

                                    const hour=Math.floor(dif / 3600000)
                                    const minute=Math.floor(dif / 60000)
                                    const seconds = dif % 60000 / 1000
                                    // console.log(new Date(i.startdate).valueOf())
                                    // console.log(new Date(i.stopdate).valueOf())
                                    // const dif = new Date(i.stopdate).valueOf() - new Date(i.startdate).valueOf()
                                    // console.log())



                                    // const seconds = i.stopdate.slice(17,19)-i.startdate.slice(17,19)
                                    return(
                                        <div key={i}>
                                            <h4>{i+1}</h4>
                                            <div>
                                                <a href={n.url}>{n.url}</a>
                                                <p>Время: {hour>0 ? hour+' часов, ' : ' '} {minute>0 ? minute+' минут,':' '} {seconds}  секунд</p>
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
    const src=(apiURL+'/files/ContentReport_' + moment().format('DD-MM-YYYY') + '.xlsx')
    return(
        <>
            <a href={src} download>Download Report</a>
            {reportsDiv}
        </>
    )
}
export default ContenLinksReport;