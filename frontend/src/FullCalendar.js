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
  const [newEvent, setNewEvent] = useState({ title: '', description: '', start: '', end: '', backgroundColor: '', label: '', completed: false, allDay: false });

  useEffect(() => {
    fetchEvents();
  }, []);

  const formatDateTimeLocal = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16);
  };

  const fetchEvents = async () => {
    try {
      const response = await axios.get('https://wet-luisa-yang-yang-253f1741.koyeb.app/events?limit=7');
      console.log(response);
      console.log(response.data);

      const formattedEvents = response.data.map(event => ({
        id: event._id,
        title: event.title,
        description: event.description,
        start: event.start,
        end: event.end,
        backgroundColor: event.backgroundColor,
        label: event.label,
        completed: event.completed,
        allDay: event.allDay || false,
      }));
      setEvents(formattedEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const onDateClick = (arg) => {
    const endDate = new Date(arg.date);
    endDate.setHours(endDate.getHours() + 1);
    setNewEvent({ 
      title: '', 
      description: '', 
      start: formatDateTimeLocal(arg.date), 
      end: formatDateTimeLocal(arg.date), 
      // end: formatDateTimeLocal(endDate), 1시간 추가
      backgroundColor: '', 
      label: '', 
      completed: false, 
      allDay: arg.allDay 
    });
    setIsEditing(false);
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewEvent({ ...newEvent, [name]: type === 'checkbox' ? checked : value });
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
      start: formatDateTimeLocal(clickInfo.event.start),
      end: formatDateTimeLocal(clickInfo.event.end || clickInfo.event.start),
      backgroundColor: clickInfo.event.backgroundColor,
      label: clickInfo.event.extendedProps.label,
      completed: clickInfo.event.extendedProps.completed || false,
      allDay: clickInfo.event.allDay
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
      const response = await axios.post('https://wet-luisa-yang-yang-253f1741.koyeb.app/events', {
        ...newEvent,
      });
      setEvents([...events, { id: response.data._id, ...response.data }]);
      setShowModal(false);
      setNewEvent({ title: '', description: '', start: '', end: '', backgroundColor: '', label: '', completed: false, allDay: false });
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
      const response = await axios.put(`https://wet-luisa-yang-yang-253f1741.koyeb.app/events/${selectedEvent.id}`, {
        ...newEvent,
      });
      setEvents(events.map(event => event.id === selectedEvent.id ? { id: response.data._id, ...response.data } : event));
      setShowModal(false);
      setNewEvent({ title: '', description: '', start: '', end: '', backgroundColor: '', label: '', completed: false, allDay: false });
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
      setNewEvent({ title: '', description: '', start: '', end: '', backgroundColor: '', label: '', completed: false, allDay: false });
      setSelectedEvent(null);
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const handleEventChange = async (changeInfo) => {
    const updatedEvent = {
      id: changeInfo.event.id,
      title: changeInfo.event.title,
      start: formatDateTimeLocal(changeInfo.event.start), 
      end: formatDateTimeLocal(changeInfo.event.end),
      backgroundColor: changeInfo.event.backgroundColor,
      label: changeInfo.event.extendedProps.label,
      completed: changeInfo.event.extendedProps.completed || false,
      allDay: changeInfo.event.allDay,
    };

    try {
      await axios.put(`https://wet-luisa-yang-yang-253f1741.koyeb.app/events/${updatedEvent.id}`, updatedEvent);
      setEvents(events.map(event => event.id === updatedEvent.id ? updatedEvent : event));
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  const handleEventDrop = async (info) => {
    const updatedEvent = {
      id: info.event.id,
      title: info.event.title,
      start: formatDateTimeLocal(info.event.start),
      end: formatDateTimeLocal(info.event.end),
      backgroundColor: info.event.backgroundColor,
      label: info.event.extendedProps.label,
      completed: info.event.extendedProps.completed || false,
      allDay: info.event.allDay,
    };

    try {
      await axios.put(`https://wet-luisa-yang-yang-253f1741.koyeb.app/events/${updatedEvent.id}`, updatedEvent);
      setEvents(events.map(event => event.id === updatedEvent.id ? updatedEvent : event));
    } catch (error) {
      console.error('Error updating event:', error);
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
        {!eventInfo.event.allDay && ` (${new Date(eventInfo.event.start).toLocaleTimeString()} - ${new Date(eventInfo.event.end).toLocaleTimeString()})`}
      </div>
    );
  };

  const dayCellContent = (dayCellInfo) => {
    return dayCellInfo.dayNumberText.replace('일', '');
  };

  const plugin = [
    dayGridPlugin,
    timeGridPlugin,
    interactionPlugin
  ];

  return (
    <div>
      <FullCalendar
        plugins={plugin}
        initialView="dayGridMonth"
        events={events}
        height="100vh"
        locale={'ko'}
        timeZone="Asia/Seoul"
        weekends={true}
        headerToolbar={{
          left: 'prevYear,prev,next,nextYear today',
          center: 'title',
          right: "dayGridMonth,dayGridWeek,dayGridDay,timeGridWeek,timeGridDay"
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
        eventChange={handleEventChange}
        eventContent={eventContent}
        editable={true}
        eventDrop={handleEventDrop}
        selectable={true}
        droppable={true}
        selectMirror={true}
        nowIndicator={true}
        navLinks={true}
        eventResizableFromStart={true}        
        dayCellContent={dayCellContent}
        eventDisplay="block"
        displayEventEnd={true}
        eventAdd={handleAddEvent}
        eventRemove={handleDeleteEvent}
        allDaySlot={true}
        allDayText="종일"
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
              <span>시작</span>
              <input type="datetime-local" name="start" value={newEvent.start} onChange={handleInputChange} />
            </label>
            <label>
              <span>종료</span>
              <input type="datetime-local" name="end" value={newEvent.end} onChange={handleInputChange} />
            </label>
            <label>
              <span>종일</span>
              <input type="checkbox" name="allDay" checked={newEvent.allDay} onChange={handleInputChange} />
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