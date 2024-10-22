import React, { useState, useEffect } from 'react';
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from "@fullcalendar/interaction"; 
import axios from 'axios';

import "./FullCalendar.css";

const FullCalendarPage = () => {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    start: '',
    end: '',
    backgroundColor: '',
    label: '',
    completed: false
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('https://wet-luisa-yang-yang-253f1741.koyeb.app/events?limit=7');
      console.log(response.data);

      const formattedEvents = response.data.map(event => ({
        id: event._id,
        title: event.title,
        description: event.description,
        // ISO 문자열을 그대로 사용
        start: event.start,
        end: event.end,
        backgroundColor: event.backgroundColor,
        label: event.label,
        completed: event.completed,
      }));
      setEvents(formattedEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const onDateClick = (arg) => {
    // 클릭한 날짜의 시작과 끝 시간 설정
    const clickedDate = new Date(arg.date);
    const startDate = new Date(clickedDate);
    startDate.setHours(0, 0, 0);
    const endDate = new Date(clickedDate);
    endDate.setHours(23, 59, 59);

    setNewEvent({
      title: '',
      description: '',
      start: startDate.toISOString().split('T')[0],
      end: endDate.toISOString().split('T')[0],
      backgroundColor: '',
      label: '',
      completed: false
    });
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
      풀샵: '#e6f6e3',
      올가: '#fff5d0',
      상세: '#ffeeab',
      퍼블: '#efdef6',
      외부몰: '#bde1f5',
      운영: '#d2f7f0',
      프론트: '#ffddd9',
      기타: '#eee',
    };
    setNewEvent({ ...newEvent, label: value, backgroundColor: labelColors[value] });
  };

  const handleEventClick = (clickInfo) => {
    const event = clickInfo.event;
    setSelectedEvent(event);
    
    // 시작 날짜와 종료 날짜를 YYYY-MM-DD 형식으로 변환
    const startDate = new Date(event.start).toISOString().split('T')[0];
    const endDate = new Date(event.end || event.start).toISOString().split('T')[0];

    setNewEvent({
      title: event.title,
      description: event.extendedProps.description,
      start: startDate,
      end: endDate,
      backgroundColor: event.backgroundColor,
      label: event.extendedProps.label,
      completed: event.extendedProps.completed || false
    });
    setIsEditing(true);
    setShowModal(true);
  };

  const handleAddEvent = async () => {
    if (!newEvent.title) {
      alert('제목은 꼭 입력해주세요');
      return;
    }

    try {
      // 시작 시간과 종료 시간 설정
      const startDateTime = new Date(newEvent.start);
      startDateTime.setHours(0, 0, 0);
      const endDateTime = new Date(newEvent.end);
      endDateTime.setHours(23, 59, 59);

      const eventData = {
        ...newEvent,
        start: startDateTime.toISOString(),
        end: endDateTime.toISOString()
      };

      const response = await axios.post('https://wet-luisa-yang-yang-253f1741.koyeb.app/events', eventData);
      setEvents([...events, { id: response.data._id, ...response.data }]);
      setShowModal(false);
      setNewEvent({ title: '', description: '', start: '', end: '', backgroundColor: '', label: '', completed: false });
    } catch (error) {
      console.error('Error adding event:', error);
    }
  };

  const handleEditEvent = async () => {
    if (!newEvent.title) {
      alert('제목은 꼭 입력해주세요');
      return;
    }

    try {
      // 시작 시간과 종료 시간 설정
      const startDateTime = new Date(newEvent.start);
      startDateTime.setHours(0, 0, 0);
      const endDateTime = new Date(newEvent.end);
      endDateTime.setHours(23, 59, 59);

      const eventData = {
        ...newEvent,
        start: startDateTime.toISOString(),
        end: endDateTime.toISOString()
      };

      const response = await axios.put(`https://wet-luisa-yang-yang-253f1741.koyeb.app/events/${selectedEvent.id}`, eventData);
      setEvents(events.map(event => event.id === selectedEvent.id ? { id: response.data._id, ...response.data } : event));
      setShowModal(false);
      setNewEvent({ title: '', description: '', start: '', end: '', backgroundColor: '', label: '', completed: false });
      setSelectedEvent(null);
    } catch (error) {
      console.error('Error editing event:', error);
    }
  };

  const handleDeleteEvent = async () => {
    try {
      await axios.delete(`https://wet-luisa-yang-yang-253f1741.koyeb.app/events/${selectedEvent.id}`);
      setEvents(events.filter(event => event.id !== selectedEvent.id));
      setShowModal(false);
      setNewEvent({ title: '', description: '', start: '', end: '', backgroundColor: '', label: '', completed: false });
      setSelectedEvent(null);
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const handleEventChange = async (changeInfo) => {
    const event = changeInfo.event;
    const updatedEvent = {
      id: event.id,
      title: event.title,
      start: event.start.toISOString(),
      end: event.end.toISOString(),
      backgroundColor: event.backgroundColor,
      label: event.extendedProps.label,
      completed: event.extendedProps.completed || false,
    };

    try {
      await axios.put(`https://wet-luisa-yang-yang-253f1741.koyeb.app/events/${updatedEvent.id}`, updatedEvent);
      setEvents(events.map(evt => evt.id === updatedEvent.id ? updatedEvent : evt));
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  const handleEventDrop = async (info) => {
    const event = info.event;
    const updatedEvent = {
      id: event.id,
      title: event.title,
      start: event.start.toISOString(),
      end: event.end.toISOString(),
      backgroundColor: event.backgroundColor,
      label: event.extendedProps.label,
      completed: event.extendedProps.completed || false,
    };

    try {
      await axios.put(`https://wet-luisa-yang-yang-253f1741.koyeb.app/events/${updatedEvent.id}`, updatedEvent);
      setEvents(events.map(evt => evt.id === updatedEvent.id ? updatedEvent : evt));
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  const handleCompletedChange = (e) => {
    setNewEvent({ ...newEvent, completed: e.target.checked });
  };

  const eventContent = (eventInfo) => {
    const isCompleted = eventInfo.event.extendedProps.completed;
    const startTime = new Date(eventInfo.event.start).toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
    const endTime = new Date(eventInfo.event.end).toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });

    return (
      <div style={{ textDecoration: isCompleted ? 'line-through' : 'none' }}>
        [{eventInfo.event.extendedProps.label}] 
        {eventInfo.event.title} 
        --{startTime}~{endTime}
      </div>
    );
  };

  const dayCellContent = (dayCellInfo) => {
    return dayCellInfo.dayNumberText.replace('일', '');
  };

  return (
    <div>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        height="100vh"
        locale="ko"
        timeZone="Asia/Seoul"
        // timeZone="UTC"
        // allDay={true}
        weekends={true}
        headerToolbar={{
          left: 'prevYear,prev,next,nextYear today',
          center: 'title',
          right: "dayGridMonth,dayGridWeek,dayGridDay, timeGridWeek,timeGridDay"
        }}        
        views={{
          dayGridMonth: { 
            dayMaxEventRows: 16,
            buttonText: '월간'
          },
          dayGridWeek: { 
            buttonText: '주간'
          },
          dayGridDay: { 
            buttonText: '일간'
          },
        }}
        buttonText={{
          // prev: "이전",
          // next: "다음",
          // prevYear: "이전 년도",
          // nextYear: "다음 년도",
          today: "오늘",
          timeGridWeek: "주별시간",
          timeGridDay: "일별시간",
          list: "리스트"
        }}

        // titleFormat={{ year: "numeric", month: "short", day: "numeric" }}
        eventColor="rgba(0, 0, 0, 0.8)"
        eventTextColor="rgba(0, 0, 0, 0.8)"
        eventBackgroundColor="#e6f6e3"
        dateClick={onDateClick}
        eventClick={handleEventClick}
        eventChange={handleEventChange}// 이벤트 drop 혹은 resize 될 때
        eventContent={eventContent}
        editable={true} //사용자의 수정 가능 여부 (이벤트 추가/수정, 드래그 앤 드롭 활성화)
        eventDrop={handleEventDrop} // 드래그 앤 드롭 이벤트 처리기 추가
        selectable={true} // 사용자의 날짜 선택 여부
        droppable={true} //드래그 앤 드롭 기능을 활성화하여 외부 이벤트를 캘린더에 추가
        selectMirror={true} // 사용자의 시간 선택시 time 표시 여부
        nowIndicator={true}
        navLinks={true}
        // navLinkHint={"클릭시 해당 날짜로 이동합니다."} // 날짜에 호버시 힌트 문구
        eventResizableFromStart={true}        
        dayCellContent={dayCellContent}
        eventDisplay="block"
        displayEventEnd={true}
        eventAdd={handleAddEvent} // 이벤트 추가 핸들러
        eventRemove={handleDeleteEvent} // 이벤트 삭제 핸들러   
      />

      {showModal && (
        <div className="modal show">
          <div className="modal-content">
            <h2>{isEditing ? '일정 수정' : '일정 추가'} <span><input type="checkbox" name="completed" checked={newEvent.completed} onChange={handleCompletedChange} /> 완료</span></h2>
            <label>
              <span>제목</span>
              <input type="text" name="title" value={newEvent.title} onChange={handleInputChange} style={isEditing ? { border: '0', fontSize: '1.4rem', fontWeight: '700' } : {}} />
            </label>
            <label>
              <span>설명</span>
              <input type="text" name="description" value={newEvent.description} onChange={handleInputChange} />
            </label>
            <label>
              <span>날짜</span>
              <input type="date" name="start" value={newEvent.start} onChange={handleInputChange} />
              ~
              <input type="date" name="end" value={newEvent.end} onChange={handleInputChange} />
            </label>
            <label>
              <span>라벨</span>
              <select name="label" value={newEvent.label} onChange={handleLabelChange}>
                <option value="풀샵" style={{ backgroundColor: '#e6f6e3'}}>풀샵</option>
                <option value="올가" style={{ backgroundColor: '#fff5d0'}}>올가</option>
                <option value="상세" style={{ backgroundColor: '#ffeeab'}}>상세</option>
                <option value="퍼블" style={{ backgroundColor: '#efdef6'}}>퍼블</option>
                <option value="외부몰" style={{ backgroundColor: '#bde1f5'}}>외부몰</option>
                <option value="운영" style={{ backgroundColor: '#d2f7f0'}}>운영</option>
                <option value="프론트" style={{ backgroundColor: '#ffddd9'}}>프론트</option>
                <option value="기타" style={{ backgroundColor: '#eee'}}>기타</option>
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
