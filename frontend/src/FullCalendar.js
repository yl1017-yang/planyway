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
  const [newEvent, setNewEvent] = useState({ title: '', description: '', start: '', end: '', backgroundColor: '', label: '', completed: false });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('https://wet-luisa-yang-yang-253f1741.koyeb.app/events');
      // MongoDB의 _id를 id로 변환
      const formattedEvents = response.data.map(event => ({
        id: event._id, // MongoDB의 _id를 id로 변환
        title: event.title,
        description: event.description,
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
      풀샵: '#3F6C51',
      올가: '#FABC2A',
      상세: '#9395D3',
      퍼블: '#BD93BD',
      외부몰: '#F39A9D',
      기타: '#999',
    };
    setNewEvent({ ...newEvent, label: value, backgroundColor: labelColors[value] });
  };

  const handleAddEvent = async () => {
    if (!newEvent.title) {
      alert('제목은 꼭 입력해주세요');
      return;
    }
    try {
      const response = await axios.post('https://wet-luisa-yang-yang-253f1741.koyeb.app/events', newEvent);
      setEvents([...events, { id: response.data._id, ...response.data }]); // 새로 추가된 이벤트의 _id를 id로 변환
      setShowModal(false);
      setNewEvent({ title: '', description: '', start: '', end: '', backgroundColor: '', label: '', completed: false });
    } catch (error) {
      console.error('Error adding event:', error);
    }
  };

  const handleEventClick = (clickInfo) => {
    setSelectedEvent(clickInfo.event);
    setNewEvent({
      title: clickInfo.event.title,
      description: clickInfo.event.extendedProps.description,
      start: clickInfo.event.startStr,
      end: clickInfo.event.endStr,
      backgroundColor: clickInfo.event.backgroundColor,
      label: clickInfo.event.extendedProps.label,
      completed: clickInfo.event.extendedProps.completed || false,
    });
    setIsEditing(true);
    setShowModal(true);
  };

  const handleEditEvent = async () => {
    if (!newEvent.title) {
      alert('제목은 꼭 입력해주세요');
      return;
    }
    try {
      const response = await axios.put(`https://wet-luisa-yang-yang-253f1741.koyeb.app/events/${selectedEvent.id}`, newEvent);
      setEvents(events.map(event => event.id === selectedEvent.id ? { id: response.data._id, ...response.data } : event)); // 수정된 이벤트의 _id를 id로 변환
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

  const handleCompletedChange = (e) => {
    setNewEvent({ ...newEvent, completed: e.target.checked });
  };

  const eventContent = (eventInfo) => {
    const isCompleted = eventInfo.event.extendedProps.completed;
    return (
      <div style={{ textDecoration: isCompleted ? 'line-through' : 'none' }}>
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
        plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
        initialView="dayGridMonth"
        events={events}
        height="100vh"
        locale={'ko'}
        timeZone="Asia/Seoul"
        weekends={true}
        headerToolbar={{
          start: 'prevYear,prev,next,nextYear today',
          center: 'title',
          end: "dayGridMonth dayGridWeek dayGridDay"
        }}
        views={{
          dayGridMonth: { 
            dayMaxEventRows: 6,
            buttonText: '월간'
          },
          dayGridWeek: { 
            buttonText: '주간'
          },
          dayGridDay: { 
            buttonText: '일간'
          }
        }}
        eventColor="#fff"
        eventTextColor="#fff"
        eventBackgroundColor="#089196"
        dateClick={onDateClick}
        eventClick={handleEventClick}
        eventContent={eventContent}
        navLinks={true}
        editable={true}
        selectable={true}
        droppable={true}
        nowIndicator={true}
        eventResizableFromStart={true}
        dayCellContent={dayCellContent}
      />

      {showModal && (
        <div className="modal">
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
                <option value="풀샵" style={{ backgroundColor: '#3F6C51'}}>풀샵</option>
                <option value="올가" style={{ backgroundColor: '#FABC2A'}}>올가</option>
                <option value="상세" style={{ backgroundColor: '#9395D3'}}>상세</option>
                <option value="퍼블" style={{ backgroundColor: '#BD93BD'}}>퍼블</option>
                <option value="외부몰" style={{ backgroundColor: '#F39A9D'}}>외부몰</option>
                <option value="기타" style={{ backgroundColor: '#999'}}>기타</option>
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
