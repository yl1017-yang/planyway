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
      const response = await axios.get('http://localhost:5000/events');
      setEvents(response.data);
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

  const handleAddEvent = () => {
    if (!newEvent.title) {
      alert('제목은 꼭 입력해주세요');
      return;
    }
    setEvents([...events, { ...newEvent, id: (events.length + 1).toString()}]);
    setShowModal(false);
    setNewEvent({ title: '', description: '', start: '', end: '', backgroundColor: '', label: '' });
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

  const handleEditEvent = () => {
    if (!newEvent.title) {
      alert('제목은 꼭 입력해주세요');
      return;
    }
    setEvents(events.map(event => event.id === selectedEvent.id ? { ...newEvent, id: selectedEvent.id } : event));
    setShowModal(false);
    setNewEvent({ title: '', description: '', start: '', end: '', backgroundColor: '', label: '' });
    setSelectedEvent(null);
  };

  const handleDeleteEvent = () => {
    setEvents(events.filter(event => event.id !== selectedEvent.id));
    setShowModal(false);
    setNewEvent({ title: '', description: '', start: '', end: '', backgroundColor: '', label: '' });
    setSelectedEvent(null);
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
        height="auto"
        locale={'ko'}
        timeZone="Asia/Seoul"
        firstDay={1}
        weekends={true}
        headerToolbar={{
          start: 'prev,next today',
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
