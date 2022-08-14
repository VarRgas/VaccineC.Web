import { Component, OnInit } from '@angular/core';
import { Calendar } from '@fullcalendar/core';
import { CalendarOptions, defineFullCalendarElement } from '@fullcalendar/web-component';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin, { Draggable } from '@fullcalendar/interaction';
import brLocale from '@fullcalendar/core/locales/pt-br';

defineFullCalendarElement();
@Component({
  selector: 'app-agendamento',
  templateUrl: './agendamento.component.html',
  styleUrls: ['./agendamento.component.scss']
})
export class AgendamentoComponent implements OnInit {

  constructor() {
    const name = Calendar.name;
  }

  ngOnInit(): void {
  }

  calendarOptions: CalendarOptions = {
    themeSystem: 'bootstrap5',
    locale: brLocale,
    timeZone: 'America/Sao_Paulo',
    plugins: [dayGridPlugin],
    initialView: 'dayGridWeek',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,dayGridWeek,dayGridDay'
    },
    weekends: true
  };

}
