import { Component, Inject, OnInit } from '@angular/core';
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
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Time } from '@angular/common';

defineFullCalendarElement()

@Component({
  selector: 'app-agendamento',
  templateUrl: './agendamento.component.html',
  styleUrls: ['./agendamento.component.scss']
})
export class AgendamentoComponent implements OnInit {

  public dialogRef?: MatDialogRef<any>;
  public informationField!: string;

  ngOnInit(): void {

  }

  constructor(
    private dialog: MatDialog,
  ) { }

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
    slotLabelInterval: '00:10',
    locale: brLocale,
    allDaySlot: false,
    initialView: 'timeGridWeek',
    initialEvents: INITIAL_EVENTS,
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    slotMinTime: "08:00:00",
    slotMaxTime: "18:01:00",
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
    //console.log(new Date(selectInfo.start))
    //console.log(new Date(selectInfo.end))

    this.dialogRef = this.dialog.open(AddAuthorizationDialog, {
      disableClose: true,
      width: '80vw',
      data: {
        Start: selectInfo.start,
        End: selectInfo.end
      },
    });

    this.dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });

    /*
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
     */
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


//DIALOG ADD AUTHORIZATION
@Component({
  selector: 'add-authorization-dialog',
  templateUrl: 'add-authorization-dialog.html',
})
export class AddAuthorizationDialog implements OnInit {

  authorizationDateFormated!: string;
  startDate!: Date;
  endDate!: Date;
  startTime!: string;
  endTime!: string;

  ngOnInit(): void {

    this.authorizationDateFormated = `${this.formatDate(new Date(this.data.Start))} - ${this.formatHour(new Date(this.data.Start))} até ${this.formatHour(new Date(this.data.End))}`;
    this.startDate = this.data.Start;
    this.endDate = this.data.Start;
    this.startTime = this.formatHour(new Date(this.data.Start));
    this.endTime = this.formatHour(new Date(this.data.End));
    console.log(this.startTime)
    console.log(this.endTime)
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<AddAuthorizationDialog>
  ) { }

  //Form
  authorizationForm: FormGroup = this.formBuilder.group({
    AuthorizationDateFormated: [null],
  });

  public formatDate(date: Date) {
    return [
      this.padTo2Digits(date.getDate()),
      this.padTo2Digits(date.getMonth() + 1),
      date.getFullYear(),
    ].join('/');
  }

  public padTo2Digits(num: number) {
    return num.toString().padStart(2, '0');
  }

  public formatHour(date: Date) {
    return `${this.padStr(date.getHours())}:${this.padStr(date.getMinutes())}`
  }

  public padStr(i: any) {
    return (i < 10) ? "0" + i : "" + i;
  }

}