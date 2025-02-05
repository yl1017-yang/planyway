import React, { useState, useEffect } from 'react';
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from "@fullcalendar/interaction"; 
import axios from 'axios';

import "./FullCalendar.css";

const FullCalendarPage = () => {
  const [serverTime, setServerTime] = useState(''); // Add state for server time
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [newEvent, setNewEvent] = useState( { title: '', description: '', start: '', end: '', backgroundColor: '', label: '', completed: false }  );

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('https://wet-luisa-yang-yang-253f1741.koyeb.app/events?limit=7');

      console.log(response.data);

      if (Array.isArray(response.data.events)) {
        const formattedEvents = response.data.events.map(event => {
          // UTC에서 로컬 시간으로 변환
          return {
            id: event._id,
            title: event.title,
            description: event.description,
            start: new Date(event.start).toISOString(), // ISO 형식으로 변환
            end: new Date(event.end).toISOString(), // ISO 형식으로 변환
            backgroundColor: event.backgroundColor,
            label: event.label,
            completed: event.completed,
          };
        });
        setEvents(formattedEvents);
        setServerTime(new Date(response.data.serverTime).toLocaleString('ko-KR'));
      } else {
        console.error('이벤트 데이터가 배열이 아닙니다:', response.data);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const onDateClick = (arg) => {
    setNewEvent({ title: '', description: '', start: arg.dateStr, end: arg.dateStr, backgroundColor: '', label: '', completed: false });
    setIsEditing(false);
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'start' || name === 'end') {
        const date = new Date(value);
        setNewEvent({ ...newEvent, [name]: date.toISOString().split('T')[0] }); // yyyy-MM-dd 형식으로 설정
    } else {
        setNewEvent({ ...newEvent, [name]: value });
    }
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
      start: clickInfo.event.startStr.split('T')[0], // yyyy-MM-dd 형식으로 설정
      end: clickInfo.event.endStr ? clickInfo.event.endStr.split('T')[0] : clickInfo.event.startStr.split('T')[0], // 종료 날짜가 없을 경우 시작 날짜로 설정
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
        const response = await axios.post('https://wet-luisa-yang-yang-253f1741.koyeb.app/events', {
            ...newEvent,
            start: new Date(newEvent.start).toISOString(),
            end: new Date(newEvent.end).setHours(23, 59, 59, 999), // 수정된 부분
        });
        setEvents(prevEvents => [...prevEvents, { id: response.data._id, ...response.data }]);
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
        const response = await axios.put(`https://wet-luisa-yang-yang-253f1741.koyeb.app/events/${selectedEvent.id}`, {
            ...newEvent,
            start: new Date(newEvent.start).toISOString(),
            end: new Date(newEvent.end).setHours(23, 59, 59, 999), // 수정된 부분
        });
        setEvents(events.map(event => event.id === selectedEvent.id ? { id: response.data._id, ...response.data } : event));
        setShowModal(false);
        setNewEvent({ title: '', description: '', start: '', end: '', backgroundColor: '', label: '', completed: false });
        setSelectedEvent(null);
    } catch (error) {
        console.error('Error editing event:', error);
    }
  };

  const handleDeleteEvent = async () => {
    if (!selectedEvent) {
      alert('삭제할 이벤트를 선택해주세요.');
      return;
    }
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
    const updatedEvent = {
      id: changeInfo.event.id,
      title: changeInfo.event.title,
      start: new Date(changeInfo.event.start).toISOString(), // 수정된 부분: UTC로 변환
      end: new Date(changeInfo.event.end).toISOString(), // 수정된 부분: UTC로 변환
      backgroundColor: changeInfo.event.backgroundColor,
      label: changeInfo.event.extendedProps.label,
      completed: changeInfo.event.extendedProps.completed || false,
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
      start: new Date(info.event.start).toISOString(), // 수정된 부분: UTC로 변환
      end: new Date(info.event.end).toISOString(), // 수정된 부분: UTC로 변환
      backgroundColor: info.event.backgroundColor,
      label: info.event.extendedProps.label,
      completed: info.event.extendedProps.completed || false,
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
        {/* {new Date(eventInfo.event.start).toISOString()} - {new Date(eventInfo.event.end).toISOString()} */}
      </div>
    );
  };

  const dayCellContent = (dayCellInfo) => {
    return dayCellInfo.dayNumberText.replace('일', '');
  };

  return (
    <div>
      <FullCalendar
        //key={events.length} // events의 길이를 key로 사용하여 리렌더링
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        height="100vh"
        locale='ko'
        timeZone="Asia/Seoul"
        weekends={true}
        headerToolbar={{
          left: `prevYear,prev,next,nextYear today, ${serverTime}`,
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
        eventContent={eventContent}
        eventResizableFromStart={true} // 이벤트 크기 조정 가능 여부
        eventDrop={handleEventDrop} // 드래그 앤 드롭 이벤트 처리기 추가
        eventChange={handleEventChange}// 이벤트 drop 혹은 resize 될 때
        editable={true} // 사용자의 수정 가능 여부
        selectable={true} // 사용자의 날짜 선택 여부
        droppable={true} //드래그 앤 드롭 기능을 활성화하여 외부 이벤트를 캘린더에 추가
        selectMirror={true} // 사용자의 시간 선택시 time 표시 여부
        nowIndicator={true}
        navLinks={true}
        // navLinkHint={"클릭시 해당 날짜로 이동합니다."} // 날짜에 호버시 힌트 문구
        dayCellContent={dayCellContent}
        eventDisplay="block"
        displayEventEnd={{
          month: false,
          basicWeek: true,
          default: true
        }}
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
