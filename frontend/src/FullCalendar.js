import React, { useState, useEffect } from 'react';
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from "@fullcalendar/interaction"; 
import axios from 'axios';
import moment from 'moment-timezone';

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
  
  // ISO 8601 형식으로 날짜 변환
  const toKSTDate = (date) => {
    if (!date) return '';
    return moment.tz(date, 'Asia/Seoul').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
  };

  const formatDateForInput = (date) => {
    if (!date) return '';
    return moment.tz(date, 'Asia/Seoul').format('YYYY-MM-DD');
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('https://wet-luisa-yang-yang-253f1741.koyeb.app/events?limit=7');

      console.log(response);
      console.log(response.data);

      const formattedEvents = response.data.map(event => ({
        id: event._id,
        title: event.title,
        description: event.description,
        start: toKSTDate(event.start),
        end: toKSTDate(event.end),
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
    const clickedDate = moment(arg.date).tz('Asia/Seoul');
    setNewEvent({ 
      title: '', 
      description: '', 
      start: clickedDate.format('YYYY-MM-DD'),
      end: clickedDate.format('YYYY-MM-DD'),
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
    setSelectedEvent(clickInfo.event);
    setNewEvent({
      title: clickInfo.event.title,
      description: clickInfo.event.extendedProps.description,
      start: formatDateForInput(clickInfo.event.start),
      end: formatDateForInput(clickInfo.event.end || clickInfo.event.start),
      backgroundColor: clickInfo.event.backgroundColor,
      label: clickInfo.event.extendedProps.label,
      completed: clickInfo.event.extendedProps.completed || false
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
      // KST에서 UTC로 변환하여 서버에 전송
      const eventData = {
        ...newEvent,
        start: moment.tz(`${newEvent.start} 00:00:00`, 'Asia/Seoul').utc().toISOString(),
        end: moment.tz(`${newEvent.end} 23:59:59`, 'Asia/Seoul').utc().toISOString(),
      };
      
      const response = await axios.post('https://wet-luisa-yang-yang-253f1741.koyeb.app/events', eventData);
      const addedEvent = {
        id: response.data._id,
        ...response.data,
        start: toKSTDate(response.data.start),
        end: toKSTDate(response.data.end),
      };
      
      setEvents([...events, addedEvent]);
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
      const eventData = {
        ...newEvent,
        start: moment.tz(`${newEvent.start} 00:00:00`, 'Asia/Seoul').utc().toISOString(),
        end: moment.tz(`${newEvent.end} 23:59:59`, 'Asia/Seoul').utc().toISOString(),
      };
      
      const response = await axios.put(
        `https://wet-luisa-yang-yang-253f1741.koyeb.app/events/${selectedEvent.id}`, 
        eventData
      );
      
      const updatedEvent = {
        id: response.data._id,
        ...response.data,
        start: toKSTDate(response.data.start),
        end: toKSTDate(response.data.end),
      };
      
      setEvents(events.map(event => 
        event.id === selectedEvent.id ? updatedEvent : event
      ));
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
    try {
      const updatedEvent = {
        ...changeInfo.event.toPlainObject(),
        start: toKSTDate(changeInfo.event.start),
        end: toKSTDate(changeInfo.event.end),
      };

      await axios.put(
        `https://wet-luisa-yang-yang-253f1741.koyeb.app/events/${changeInfo.event.id}`, 
        updatedEvent
      );
      
      setEvents(events.map(event => 
        event.id === changeInfo.event.id ? updatedEvent : event
      ));
    } catch (error) {
      console.error('Error updating event:', error);
      changeInfo.revert();
    }
  };

  const handleEventDrop = async (info) => {
    try {
      const updatedEvent = {
        ...info.event.toPlainObject(),
        start: toKSTDate(info.event.start),
        end: toKSTDate(info.event.end),
      };

      await axios.put(
        `https://wet-luisa-yang-yang-253f1741.koyeb.app/events/${info.event.id}`, 
        updatedEvent
      );
      
      setEvents(events.map(event => 
        event.id === info.event.id ? updatedEvent : event
      ));
    } catch (error) {
      console.error('Error updating event:', error);
      info.revert();
    }
  };

  const handleCompletedChange = (e) => {
    setNewEvent({ ...newEvent, completed: e.target.checked });
  };

  const eventContent = (eventInfo) => {
    const isCompleted = eventInfo.event.extendedProps.completed;
    return (
      <div style={{ textDecoration: isCompleted ? 'line-through' : 'none' }}>
        [{eventInfo.event.extendedProps.label}] 
        {eventInfo.event.title} 
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
        locale='ko'
        timeZone="Asia/Seoul"
        slotMinTime="00:00:00"
        slotMaxTime="24:00:00"
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
          today: "오늘",
          timeGridWeek: "주별시간",
          timeGridDay: "일별시간",
          list: "리스트"
        }}
        eventColor="rgba(0, 0, 0, 0.8)"
        eventTextColor="rgba(0, 0, 0, 0.8)"
        eventBackgroundColor="#e6f6e3"
        dateClick={onDateClick}
        eventClick={handleEventClick}
        eventChange={handleEventChange} // 이벤트 drop 혹은 resize 될 때
        eventContent={eventContent}
        editable={true} // 사용자의 수정 가능 여부 (이벤트 추가/수정, 드래그 앤 드롭 활성화)
        eventDrop={handleEventDrop} // 드래그 앤 드롭 이벤트 처리기 추가
        selectable={true} // 사용자의 날짜 선택 여부
        droppable={true} // 드래그 앤 드롭 기능을 활성화하여 외부 이벤트를 캘린더에 추가
        selectMirror={true} // 사용자의 시간 선택시 time 표시 여부
        nowIndicator={true}
        navLinks={true}
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
