import React from "react";

import Calendar from '@toast-ui/react-calendar';
import '@toast-ui/calendar/dist/toastui-calendar.min.css';
import 'tui-time-picker/dist/tui-time-picker.css';
import 'tui-date-picker/dist/tui-date-picker.css';

const myTheme = {
  common: {
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    gridSelection: {
      backgroundColor: 'rgba(81, 230, 92, 0.1)',
      border: '1px solid #515ce6',
    },
    dayName: {
      color: '#222',
    },
    holiday: {
      color: 'rgba(255, 64, 64, 0.8)',
    },
    saturday: {
      color: 'rgba(64, 64, 255, 0.8)',
    },
    today: {
      color: '#fff',
    },
  },
  week: {
    dayGrid: {
      borderRight: 'none',
      backgroundColor: 'rgba(81, 92, 230, 0.1)',
    },
    dayGridLeft: {
      borderRight: 'none',
      backgroundColor: 'rgba(81, 92, 230, 0.05)',
      width: '144px',
    },
    weekend: {
      backgroundColor: 'rgba(255, 64, 64, 0.05)',
    },
    today: {
      color: '#e5e5e5',
      backgroundColor: 'rgba(229, 229, 229, 0.05)',
    },
    gridSelection: {
      color: 'grey',
    },
  },
  month: {
    dayExceptThisMonth: {
      color: '#aaa',
    },
    holidayExceptThisMonth: {
      color: 'oringe',
    },
    dayName: {
      borderLeft: 'none',
      backgroundColor: '#eee',
    },
    moreView: {
      border: '1px solid grey',
      boxShadow: '0 2px 6px 0 grey',
      backgroundColor: 'white',
      width: 320,
      height: 200,
    },
    moreViewTitle: {
      backgroundColor: 'grey',
    },
    weekend: {
      backgroundColor: '#f9f9f9',
    },
    gridCell: {
      footerHeight: 31,
    },
  },
  
}

const start = new Date();
const end = new Date(new Date().setMinutes(start.getMinutes() + 30));
const schedules = [
  {
    id: "1",
    calendarId: "1",
    title: 'TOAST UI Calendar Study',
    category: "time", //일정 카테고리. milestone, task, allday, time
    isVisible: true, //종일 일정여부
    body: "Test", //일정 내용
    dueDateClass: '', //task 일정 카테고리. 어떤 문자열도 가능
    start,
    end,
    state: 'Busy', //일정 상태. 바쁨(Busy), 한가함(Free) 중 하나
    isReadOnly: true, //수정 가능한 일정 여부
    color: '#fff', //일정 요소의 텍스트 색상
    backgroundColor: '#ccc', //일정 요소의 배경 색상
    customStyle: {
      fontStyle: 'italic',
      fontSize: '15px',
    },
    raw: null  //실제 일정 데이터
  },
  {
    id: "2",
    calendarId: "2",
    title: 'Practice',
    category: "milestone",
    isVisible: true,
    body: "Description",
    dueDateClass: '',
    start: new Date(new Date().setHours(start.getHours() + 1)),
    end: new Date(new Date().setHours(start.getHours() + 2)),
    state: 'Free',
    isReadOnly: true,
    color: '#fff',
    backgroundColor: '#9e5fff',
    customStyle: {
      fontStyle: 'bold',
      fontSize: '15px',
    },
  },
  {
    id: "2",
    calendarId: "3",
    title: 'FE Workshop',
    category: "allday",
    isVisible: true,
    body: "Description",
    dueDateClass: '',
    start,
    end,
    state: 'Free',
    isReadOnly: true,
    color: '#fff',
    backgroundColor: '#00a9ff',
    customStyle: {
      fontStyle: 'italic',
      fontSize: '15px',
    },
  }
];

const calendars = [
  {
    id: "1",
    name: "My Calendar",
    color: "#ffffff",
    bgColor: "#9e5fff",
    dragBgColor: "#9e5fff",
    borderColor: "#9e5fff"
  },
  {
    id: "2",
    name: "디자인",
    color: "#ffffff",
    bgColor: "#00a9ff",
    dragBgColor: "#00a9ff",
    borderColor: "#00a9ff"
  }
  ,
  {
    id: "3",
    name: "퍼블",
    color: "#ffffff",
    bgColor: "#00a9ff",
    dragBgColor: "#00a9ff",
    borderColor: "#00a9ff"
  }
];

const template = {
  milestone(schedule) {
    return `<span style="color:#fff;background-color: ${schedule.bgColor};">${
            schedule.title
    }</span>`;
  },
  milestoneTitle() {
    return 'Milestone';
  },
  task: function(schedule) {
    return '&nbsp;&nbsp;#' + schedule.title;
  },
  taskTitle: function() {
      return '<label><input type="checkbox" />Task</label>';
  },
  allday(schedule) {
    return `${schedule.title}<i class="fa fa-refresh"></i>`;
  },
  alldayTitle() {
    return 'All Day';
  },
  time: function(schedule) {
    return schedule.title + ' <i class="fa fa-refresh"></i>' + schedule.start;
  },
  
  monthMoreTitleDate(moreTitle) {
    const { date } = moreTitle;

    return `<span>${date}</span>`;  //더 보기 팝업의 날짜를 커스터마이징
  },
  monthMoreClose() {
    return ''; // 더 보기 팝업 닫기 버튼 커스텀 마이징
  },
  // monthGridHeader(model) {
  //   const date = parseInt(model.date.split('-')[2], 10);

  //   return `<span style='background:#ddd'>${date}</span>`; //월간뷰 셀의 헤더 영역을 커스터마이징할 수 있다. TemplateMonthGrid 객체를 파라미터로 받는다.
  // },
  monthGridHeaderExceed(hiddenEvents) {
    return `<span>${hiddenEvents} more</span>`; //월간뷰 셀의 헤더 영역의 초과되는 이벤트의 갯수를 표시
  },
  monthDayName(model) {
    return model.label;
  },
  weekDayName(model) {
    return `<span style='background:#ddd'>${model.date}</span>&nbsp;&nbsp;<span>${model.dayName}</span>`; //주간/일간뷰의 요일을 커스터마이징
  },
  weekGridFooterExceed(hiddenEvents) {
    return `+${hiddenEvents}`; //주간/일간뷰의 allday 패널의 초과된 이벤트 표시 컴포넌트를 커스터마이징
  },
  popupIsAllday() {
    return '하루종일'; //이벤트 폼 팝업에서 all day 텍스트를 커스터마이징
  },
  popupStateFree() {
    return 'Free'; //이벤트의 한가함(free) 상태를 커스터마이징
  },
  popupStateBusy() {
    return 'Busy';
  },
  popupDetailState({ state }) {
    return state || 'Busy';
  },
  titlePlaceholder() {
    return '제목 추가'; //이벤트 폼 팝업에서 이벤트명의 placeholder를 커스터마이징
  },
  locationPlaceholder() {
    return '위치 추가';
  },
  popupSave: function() {
    return '저장'
  },
  popupUpdate: function() {
    return '수정'
  },
  popupEdit: function() {
    return '편집'
  },
  popupDelete: function() {
    return '삭제'
  },
  popupDetailTitle: function() {
    return 'https://github.com/nhn/tui.calendar/blob/calendar%402.1.3/docs/ko/apis/template.md 이벤트 상세 팝업에서 이벤트명'
  },
  popupDetailAttendees({ attendees = [] }) {
    return attendees.join(', '); //이벤트 상세 팝업에서 이벤트의 참석자를 커스터마이징
  },
  popupDetailBody({ body }) {
    return body; //이벤트 상세 팝업에서 이벤트의 내용을 커스터마이징
  },
};


class TestCal extends React.Component {
    constructor(props) {
        super(props);
        this.calendarRef = React.createRef();
    }
  
    // ---------- Instance method ---------- //

    // 이전 달로 이동하는 버튼
    handleClickPrevButton = () => {
      const calendarInstance = this.calendarRef.current.getInstance();
      calendarInstance.prev();
    };

    // 다음 달로 이동하는 버튼
    handleClickNextButton = () => {
      const calendarInstance = this.calendarRef.current.getInstance();
      calendarInstance.next();
    };

    // 주간뷰 보기    ( defaultView = month 로 수정해놓았습니다 )
    weekChangeButton = () => {
      const calendarInstance = this.calendarRef.current.getInstance();
      calendarInstance.changeView('week', true);
    }

    // 월간뷰 보기
    momthChangeButton = () => {
      const calendarInstance = this.calendarRef.current.getInstance();
      calendarInstance.changeView('month', true);
    }

    // 일간뷰 보기
    handleClickDayButton = () => {
      const calendarInstance = this.calendarRef.current.getInstance();
      calendarInstance.changeView('day', true);
    }

    // ---------- Event ---------- //

    // week 상태에서 요일 클릭
    handleClickDayname = (ev) => {
        console.group('onClickDayname');
        console.log(ev.date);
        console.groupEnd();
    };

    beforeCreateSchedule = (ev) => {
        console.group('onbeforeCreateSchedule');
        console.log(ev.date);
        console.groupEnd();
    };
    

    render() {
        const selectedView = 'month';     // default view
          
        return (
          <>
            <button onClick={this.handleClickDayButton}>오늘</button>
            <button onClick={this.weekChangeButton}>Week</button>
            <button onClick={this.momthChangeButton}>momth</button>
            <button onClick={this.handleClickPrevButton}>이전달</button>
            <button onClick={this.handleClickNextButton}>다음달</button>
            

            <Calendar
                ref={this.calendarRef}
                onClickDayname={this.handleClickDayname}
                onbeforeCreateSchedule={this.beforeCreateSchedule}
                height="90vh"
                calendars={calendars}
                disableDblClick={true}
                disableClick={false}
                isReadOnly={false}
                schedules={schedules}
                scheduleView={true}
                taskView={false}
                template={template}
                theme={myTheme} // 어두운 테마 사용가능
                timezones={[
                  {
                    timezoneOffset: 540,
                    displayLabel: 'GMT+09:00',
                    tooltip: 'Seoul'
                  }
                ]}
                useFormPopup={true}
                useDetailPopup={true}
                useCreationPopup={true}
                view={selectedView} // `defaultView` 옵션을 설정할 수도 있습니다.
                week={{
                    dayNames: ['일', '월', '화', '수', '목', '금', '토'],
                    showTimezoneCollapseButton: true,
                    timezonesCollapsed: true,
                    startDayOfWeek: 0,
                    showNowIndicator: true,
                    taskView: false,
                    collapseDuplicateEvents: { //일정 겹침 가능
                      getDuplicateEvents: (targetEvent, events) =>
                        events
                          .filter((event) =>
                            event.title === targetEvent.title &&
                            event.start.getTime() === targetEvent.start.getTime() &&
                            event.end.getTime() === targetEvent.end.getTime()
                          )
                          .sort((a, b) => (a.calendarId > b.calendarId ? 1 : -1)),
                      getMainEvent: (events) => events[events.length - 1], // events는 getDuplicateEvents()의 리턴값이다.
                    }
                }}
                month={{
                  dayNames: ['일', '월', '화', '수', '목', '금', '토'],
                  visibleWeeksCount: 0,
                  workweek: false, //주말제거
                  narrowWeekend: false, //주말 작게
                  startDayOfWeek: 0,
                  isAlways6Weeks: true,
                  visibleEventCount: 6, // 각 날짜 최대치 보여주는 갯수
                }}
            />
            

        </>
        );
    }
}

export default TestCal;

