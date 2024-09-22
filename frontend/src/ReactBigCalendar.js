import React, { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
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
          id: Date.now(), // 고유 ID 추가
          start,
          end,
          title
        }
      ]);
  };

  const handleEventSelect = (event) => {
    const action = window.prompt("What would you like to do? (edit/delete)");
    if (action === "edit") {
      const newTitle = window.prompt("Enter new title", event.title);
      if (newTitle) {
        setEventsData(eventsData.map(e => 
          e.id === event.id ? { ...e, title: newTitle } : e
        ));
      }
    } else if (action === "delete") {
      if (window.confirm("Are you sure you want to delete this event?")) {
        setEventsData(eventsData.filter(e => e.id !== event.id));
      }
    }
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
        // onSelectEvent={(event) => alert(event.title)}
        onSelectEvent={handleEventSelect}
        onSelectSlot={handleSelect}
        // components={{
        //   toolbar: CustomToolbar
        // }}
      />
    </div>
  );
}



export default ReactBigCalendar;
