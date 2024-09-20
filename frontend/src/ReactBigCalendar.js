import React, { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
// import Toolbar from 'react-big-calendar';
import moment from "moment";
import events from "./events";
import 'react-big-calendar/lib/css/react-big-calendar.css';

moment.locale('ko-KR');
const localizer = momentLocalizer(moment);

function ReactBigCalendar() {
  const [eventsData, setEventsData] = useState(events);

  const handleSelect = ({ start, end }) => {
    console.log(start);
    console.log(end);
    const title = window.prompt("Add card title");
    if (title)
      setEventsData([
        ...eventsData,
        {
          start,
          end,
          title
        }
      ]);
  };
  return (
    <div className="App">
      <Calendar
        views={{
          day: true,
          week: true,
          month: true
        }}
        selectable
        localizer={localizer}
        defaultDate={new Date()}
        defaultView="month"
        events={eventsData}
        style={{ width: "90vw", height: "90vh" }}
        onSelectEvent={(event) => alert(event.title)}
        onSelectSlot={handleSelect}
        // components = {{toolbar : CustomToolbar}}
      />
    </div>
  );
}

// class CustomToolbar extends Toolbar {
//   render() {
//     return (
//       <div className='rbc-toolbar'>
//         <span className="rbc-btn-group">
//           <button type="button" onClick={() => this.navigate('TODAY')} >today</button>
//           <button type="button" onClick={() => this.navigate('PREV')}>back</button>
//           <button type="button" onClick={() => this.navigate('NEXT')}>next</button>
//         </span>
//         <span className="rbc-toolbar-label">{this.props.label}</span>
//       </div>
//     );
//   }

//   navigate = action => {
//     console.log(action);
    
//     this.props.onNavigate(action)
//   }
// }

export default ReactBigCalendar;
