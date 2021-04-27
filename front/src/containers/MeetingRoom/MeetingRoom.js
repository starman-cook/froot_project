// import React, { useEffect, useState } from 'react';
// import Paper from "@material-ui/core/Paper";
// import { ViewState, EditingState, IntegratedEditing } from "@devexpress/dx-react-scheduler";
// import {
//   Scheduler,
//   WeekView,
//   Appointments,
//   Toolbar,
//   ViewSwitcher,
//   MonthView,
//   DateNavigator,
//   DayView,
//   TodayButton,
//   AppointmentTooltip,
//   AppointmentForm,
//   ConfirmationDialog,
//   AllDayPanel,
//   EditRecurrenceMenu,
//   DragDropProvider
// } from "@devexpress/dx-react-scheduler-material-ui";
// import moment from 'moment';
// import { useDispatch, useSelector } from 'react-redux';
// import allDayLocalizationMessages from '../../config';
// import { addMeeting, deleteMeeting, editMeeting, fetchMeetings } from '../../store/actions/meetingAction';

// const getAllDayMessages = (locale) => allDayLocalizationMessages[locale];

// const MeetingRoom =()=>{

//     const dispatch=useDispatch();
//     useEffect(()=>{
//         dispatch(fetchMeetings());
//     },[dispatch]);
//     const appointments=useSelector(state=>state.meetings.appointments);

//     const commitChanges=async ({ added, changed, deleted })=> {
//         let  data  = appointments;
//         if (added) {
//             await dispatch(addMeeting(added));
//         }
//         if (changed) {
//             let newData=null;
//             data.map((appointment) => {
//             if(changed[appointment.id])
//                 newData={ ...appointment, ...changed[appointment.id] };
//             });
//             if(newData!==null){
//                 await dispatch(editMeeting(newData._id,newData));
//                 newData=null;
//             }
//         }
//         if (deleted !== undefined) {
//           const newDatla = await data.filter(appointment => appointment.id === deleted)
//             await dispatch(deleteMeeting(newDatla[0]._id));
//         }
//     }
  
//       return (
//         <Paper>
//           <Scheduler data={appointments} height={660} locale={"ru-RU"}>
//             <ViewState
//               defaultCurrentDate={moment().format('YYYY-MM-DD')}/>
//             <EditingState
//                 onCommitChanges={commitChanges}
//             />
//             <IntegratedEditing />
//             <EditRecurrenceMenu/>
//             <WeekView startDayHour={9} endDayHour={18} />
//             {/* <WeekView
//               name="work-week"
//               displayName="Work Week"
//               excludedDays={[0, 6]}
//               startDayHour={9}
//               endDayHour={19}
//             /> */}
//             <MonthView />
            
//             <DayView startDayHour={9} endDayHour={18} />
  
//             <Toolbar />
//             <ViewSwitcher />
//             <DateNavigator/>
//             <TodayButton />
//             <ConfirmationDialog />
//             <Appointments />
//             <AppointmentTooltip
//                 showCloseButton
//                 showOpenButton
//             />
//             <AppointmentForm />
//             <AllDayPanel messages={getAllDayMessages("ru-RU")} />
//             <DragDropProvider/>
//           </Scheduler>
//         </Paper>
//       );
//   }
//   export default MeetingRoom;