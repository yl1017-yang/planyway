import React, { useState } from 'react';
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from "@fullcalendar/interaction"; 
// import { compareAsc, format } from "date-fns";

import "./FullCalendar.css";

// https://medium.com/@iamkjw/fullcalendar-with-react-2e22ce4e36ea
// https://velog.io/@hwakyoung/React-fullcalendar-%EC%82%AC%EC%9A%A9%ED%95%98%EA%B8%B0
// https://fullcalendar.io/docs

const FullCalendarPage = () => {

  const [events, setEvents] = useState([
    { id: '1', title: '[메인] Event 1', description: '내용 1', start: '2024-09-01', end: '2024-09-03', backgroundColor: 'green', label: '풀샵' },
    { id: '2', title: '[퍼블] Event 2', description: '내용 2', start: '2024-09-02', end: '2024-09-04', backgroundColor: 'blue', label: 'Personal' },
    { id: '3', title: 'Event 3', description: '내용 3', start: '2024-09-01', end: '2024-09-01', backgroundColor: 'skyblue', label: 'Work' },
    { id: '4', title: 'Event 4', description: '내용 4', start: '2024-09-01', end: '2024-09-01', backgroundColor: 'black', label: 'Other' },
    { id: '5', title: 'Event 5', description: '내용 5', start: '2024-09-07', end: '2024-09-11', backgroundColor: 'red', label: 'Personal' }
  ]);

    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [newEvent, setNewEvent] = useState({ title: '', description: '', start: '', end: '', backgroundColor: 'green', label: 'Work' });

    const onDateClick = (arg) => {
        setNewEvent({ ...newEvent, start: arg.dateStr, end: arg.dateStr });
        setIsEditing(false);
        setShowModal(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewEvent({ ...newEvent, [name]: value });
    };

    const handleLabelChange = (e) => {
      const { value } = e.target;
      const labelColors = {
          풀샵: 'green',
          올가: 'skyblue',
          상세: 'red',
          퍼블: 'yellowgreen',
          외부몰: 'cream',
          기타: 'gray',
      };
      setNewEvent({ ...newEvent, label: value, backgroundColor: labelColors[value] });
    };

    const handleAddEvent = () => {
      if (!newEvent.title) {
          alert('제목은 꼭 입력해주세요');
          return;
      }
      setEvents([...events, { ...newEvent, id: (events.length + 1).toString()}]);
      setShowModal(false);
      setNewEvent({ title: '', description: '', start: '', end: '', backgroundColor: 'green', label: 'Work' });
    };

    const handleEventClick = (clickInfo) => {
      setSelectedEvent(clickInfo.event);
      setNewEvent({
          title: clickInfo.event.title,
          description: clickInfo.event.extendedProps.description,
          start: clickInfo.event.startStr,
          end: clickInfo.event.endStr,
          backgroundColor: clickInfo.event.backgroundColor,
          label: clickInfo.event.extendedProps.label
      });
      setIsEditing(true);
      setShowModal(true);
    };
    
    const handleEditEvent = () => {
      if (!newEvent.title) {
        alert('제목은 꼭 입력해주세요');
        return;
      }

      setEvents(events.map(event => event.id === selectedEvent.id ? { ...newEvent, id: selectedEvent.id } : event));
      setShowModal(false);
      setNewEvent({ title: '', description: '', start: '', end: '', backgroundColor: 'green', label: 'Work' });
      setSelectedEvent(null);
    };

    const handleDeleteEvent = () => {
        setEvents(events.filter(event => event.id !== selectedEvent.id));
        setShowModal(false);
        setNewEvent({ title: '', description: '', start: '', end: '', backgroundColor: 'green', label: 'Work' });
        setSelectedEvent(null);
    };

    const eventContent = (eventInfo) => { 
        return (
            <div>
                {eventInfo.event.title}
                {eventInfo.event.label}
            </div>
        );
    };

    const dayCellContent = (dayCellInfo) => {
      return dayCellInfo.dayNumberText.replace('일', '');
    };

    return (
      <div>
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
          initialView="dayGridMonth"  // 초기 로드 될때 보이는 캘린더 화면(기본 설정: 달)
          events={events}
          height="auto"
          locale={'ko'}

          //initialDate="2024-06-01" // 캘린더가 처음 렌더링될 때 표시할 날짜 설정
          timeZone="Asia/Seoul" // 캘린더의 시간대를 아시아/서울로 설정
          firstDay={1} // 주의 첫 번째 날을 월요일로 설정
          weekends={true} // 주말을 표시하도록 설정

          headerToolbar={{
            start: 'prev,next today',
            center: 'title',
            end: "dayGridMonth dayGridWeek dayGridDay"
          }}

          views={{ // 특정 뷰에 대한 설정을 세부적으로 조정
            dayGridMonth: { 
              dayMaxEventRows: 6, // 하루에 최대 3개의 이벤트 행 표시 (초과되는 건 +more 로 표시됨)
              buttonText: '월간' // 월간 뷰 버튼 텍스트 설정
            },
            dayGridWeek: { 
              buttonText: '주간' // 주간 뷰 버튼 텍스트 설정
            },
            dayGridDay: { 
              buttonText: '일간' // 일간 뷰 버튼 텍스트 설정
            }
          }}

          eventColor="#fff" // 이벤트 기본 색상 설정
          eventTextColor="#fff" // 이벤트 텍스트 색상 설정
          eventBackgroundColor="#089196" // 이벤트 배경 색상 설정

          dateClick={onDateClick}
          eventClick={handleEventClick}
          eventContent={eventContent}

          navLinks={true} // 날짜를 선택하면 Day 캘린더나 Week 캘린더로 링크
          editable={true} //이벤트를 드래그 앤 드롭으로 편집
          selectable={true} // 날짜 및 시간 범위를 선택할 수 있는지 여부
          droppable={true} //외부 요소를 드롭하여 이벤트를 생성할 수 있는지 여부를 설정
          nowIndicator={true} // 현재 시간 마크
          eventResizableFromStart={true} //이벤트 시작 시간을 드래그하여 조정
          dayCellContent={dayCellContent}
        />

        {showModal && (
            <div className="modal">
              <div className="modal-content">
                  <h2>{isEditing ? '일정 수정' : '일정 추가'}</h2>
                  <label>
                      <span>제목</span>
                      <input type="text" name="title" value={newEvent.title} onChange={handleInputChange} />
                  </label>
                  <label>
                      <span>설명</span>
                      <input type="text" name="description" value={newEvent.description} onChange={handleInputChange} />
                  </label>
                  <label>
                      <span>시작 날짜</span>
                      <input type="date" name="start" value={newEvent.start} onChange={handleInputChange} />
                      ~
                      <span>종료 날짜</span>
                      <input type="date" name="end" value={newEvent.end} onChange={handleInputChange} />
                  </label>
                  <label>
                      <span>라벨</span>
                      <select name="label" value={newEvent.label} onChange={handleLabelChange}>
                          <option value="풀샵">풀샵</option>
                          <option value="올가">올가</option>
                          <option value="상세">상세</option>
                          <option value="퍼블">퍼블</option>
                          <option value="외부몰">외부몰</option>
                          <option value="기타">기타</option>
                      </select>
                  </label>
                  <button onClick={isEditing ? handleEditEvent : handleAddEvent}>
                      {isEditing ? '수정' : '추가'}
                  </button>
                  {isEditing && <button onClick={handleDeleteEvent}>삭제</button>}
                  <button onClick={() => setShowModal(false)}>취소</button>
              </div>
          </div>
          )}
      </div>
    );
}
export default FullCalendarPage;
