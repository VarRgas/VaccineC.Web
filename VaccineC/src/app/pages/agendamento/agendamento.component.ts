import { Component, OnInit } from '@angular/core';
import {
  CalendarOptions,
  DateSelectArg,
  EventClickArg,
  EventApi,
  defineFullCalendarElement,
} from '@fullcalendar/web-component';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import { INITIAL_EVENTS, createEventId } from './event-utils';
import brLocale from '@fullcalendar/core/locales/pt-br';

defineFullCalendarElement()

@Component({
  selector: 'app-agendamento',
  templateUrl: './agendamento.component.html',
  styleUrls: ['./agendamento.component.scss']
})
export class AgendamentoComponent implements OnInit {
  
  ngOnInit(): void {
   
  }

  public informationField!: string;

  calendarVisible = true;
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    eventTimeFormat: { 
      hour: 'numeric',
      minute: '2-digit',
      meridiem: false
    },
    slotLabelFormat: {
      hour: 'numeric', 
      minute: '2-digit', 
      hour12: false
    },
    slotDuration: '00:10',
    locale: brLocale,
    timeZone: 'America/Sao_Paulo',
    allDaySlot: false,
    initialView: 'timeGridWeek',
    initialEvents: INITIAL_EVENTS,
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this)
    /* you can update a remote database when these fire:
    eventAdd:
    eventChange:
    eventRemove:
    */
  };
  currentEvents: EventApi[] = [];

  handleCalendarToggle() {
    this.calendarVisible = !this.calendarVisible;
  }

  handleWeekendsToggle() {
    this.calendarOptions = {
      ...this.calendarOptions,
      weekends: !this.calendarOptions.weekends
    }
  }

  handleDateSelect(selectInfo: DateSelectArg) {
    console.log(selectInfo)
    const title = prompt('Adicionar Evento:');
    const calendarApi = selectInfo.view.calendar;

    calendarApi.unselect(); // clear date selection

    if (title) {
      calendarApi.addEvent({
        id: createEventId(),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr
      });
    }
  }

  handleEventClick(clickInfo: EventClickArg) {
    if (confirm(`Remover evento? '${clickInfo.event.title}'`)) {
      clickInfo.event.remove();
    }
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
  }
  

}
