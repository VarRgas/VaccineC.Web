import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import {
  CalendarOptions,
  DateSelectArg,
  EventClickArg,
  EventApi,
  defineFullCalendarElement,
  Duration,
  DurationInput,
  FullCalendarElement,
  EventInput,
  DateInput,
} from '@fullcalendar/web-component';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import { INITIAL_EVENTS } from './event-utils';
import brLocale from '@fullcalendar/core/locales/pt-br';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { CompaniesDispatcherService } from 'src/app/services/company-dispatcher.service';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { EventsDispatcherService } from 'src/app/services/events-dispatcher.service';
import { FullCalendarEventModel } from 'src/app/models/full-calendar-event-model';
import { debounceTime, distinctUntilChanged, map, Observable, startWith, switchMap } from 'rxjs';
import { PersonAutocompleteService } from 'src/app/services/person-autocomplete.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { BudgetsDispatcherService } from 'src/app/services/budgets-dispatcher.service';
import { MatSidenav } from '@angular/material/sidenav';

defineFullCalendarElement()

@Component({
  selector: 'app-agendamento',
  templateUrl: './agendamento.component.html',
  styleUrls: ['./agendamento.component.scss']
})
export class AgendamentoComponent implements OnInit {
  @ViewChild('sidenav') sidenav!: MatSidenav;

  reason = '';

  close(reason: string) {
    this.reason = reason;
    this.sidenav.close();
  }

  @ViewChild('calendar') calendarRef!: ElementRef<FullCalendarElement>;

  public dialogRef?: MatDialogRef<any>;
  public informationField!: string;
  public slotMinTime!: Duration | DurationInput;
  public slotMaxTime!: Duration | DurationInput;
  public slotDuration!: Duration | DurationInput;
  public slotLabelInterval!: Duration | DurationInput;
  public events: EventInput[] = [];
  ngOnInit(): void {

    this.eventsDispatcherService.getAllEvents().subscribe(
      events => {
        events.forEach((event: any) => {

          let fullCalendarEvent = {
            id: event.ID,
            title: 'teste',
            start: this.formatDate(event.StartDate, event.StartTime),
            end: this.formatDate(event.EndDate, event.EndTime)
          }
          this.events.push(fullCalendarEvent);
        });
      },
      error => {
        this.errorHandler.handleError(error);
        console.log(error);
      });


    this.companyDispatcherService.getCompanyConfigAuthorization().subscribe(
      response => {

        this.slotMinTime = response.MinTime;
        this.slotMaxTime = response.MaxTime;
        this.slotDuration = `00:${response.ApplicationTimePerMinute}`;
        this.slotLabelInterval = `00:${response.ApplicationTimePerMinute}`;

        this.handleInfo();
      },
      error => {
        this.errorHandler.handleError(error);
        console.log(error);
        this.calendarVisible = false;
      });
    ;
  }

  constructor(
    private dialog: MatDialog,
    private companyDispatcherService: CompaniesDispatcherService,
    private errorHandler: ErrorHandlerService,
    private eventsDispatcherService: EventsDispatcherService
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
    locale: brLocale,
    allDaySlot: false,
    initialView: 'timeGridWeek',
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    contentHeight: "auto",


    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this)
    /* you can update a remote database when these fire:
    eventAdd:
    eventChange:
    eventRemove:
    */
  };
  currentEvents: EventApi[] = [

  ];

  handleInfo() {
    this.calendarOptions = {
      ...this.calendarOptions,
      slotDuration: this.slotDuration,
      slotLabelInterval: this.slotLabelInterval,
      slotMinTime: this.slotMinTime,
      slotMaxTime: this.slotMaxTime,
      events: this.events
    }
  }

  public getEvents(): any {
    this.eventsDispatcherService.getAllEvents().subscribe(
      events => {
        console.log(events)
        events.forEach((event: any) => {

          let fullCalendarEvent = {
            id: event.ID,
            title: 'teste',
            start: this.formatDate(event.StartDate, event.StartTime),
            end: this.formatDate(event.EndDate, event.EndTime)
          }
          this.events.push(fullCalendarEvent);
        });
      },
      error => {
        this.errorHandler.handleError(error);
        console.log(error);
      });
  }

  public formatDate(date: string, time: string): DateInput {
    const TODAY_STR = new Date(date).toISOString().replace(/T.*$/, '');
    return `${TODAY_STR}T${time}`
  }

  handleDateSelect(selectInfo: DateSelectArg) {
    //console.log(new Date(selectInfo.start))
    //console.log(new Date(selectInfo.end))

    this.dialogRef = this.dialog.open(AddAuthorizationDialog, {
      disableClose: true,
      width: '60vw',
      data: {
        Start: selectInfo.start,
        End: selectInfo.end
      },
    });

    this.dialogRef.afterClosed().subscribe(result => {

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

  public imagePathUrl = 'http://localhost:5000/';
  public imagePathUrlDefault = "../../../assets/img/default-profile-pic.png";

  public authorizationDateFormated!: string;
  public startDate!: Date;
  public endDate!: Date;
  public startTime!: string;
  public endTime!: string;
  public personId!: string;
  public personBorrowerId!: string;
  public profilePicExhibition!: string;
  public personPrincipalPhone!: string;
  public personPrincipalAddress!: string;
  public typeOfService!: string;
  public budgetId!: string;

  public personPrincipalInfoVisible = false;

  //Autocomplete Pessoa
  public myControl = new FormControl();
  public options: string[] = [];
  public filteredOptions: Observable<any[]> | undefined;

  //Autocomplete Orçamento
  public myControlBudget = new FormControl();
  public acBudgets: string[] = [];
  public filteredBudgets: Observable<any[]> | undefined;

  ngOnInit(): void {
    this.authorizationDateFormated = `${this.formatDate(new Date(this.data.Start))} - ${this.formatHour(new Date(this.data.Start))} até ${this.formatHour(new Date(this.data.End))}`;
    this.startDate = this.data.Start;
    this.endDate = this.data.Start;
    this.startTime = this.formatHour(new Date(this.data.Start));
    this.endTime = this.formatHour(new Date(this.data.End));
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private personAutocompleteService: PersonAutocompleteService,
    private budgetsDispatcherService: BudgetsDispatcherService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<AddAuthorizationDialog>
  ) { }

  //Form
  authorizationForm: FormGroup = this.formBuilder.group({
    AuthorizationDateFormated: [null],
    PersonId: [null],
    TypeOfService: [null],
    BudgetId: [null]
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

  public searchBudgetByAutoComplete(): void {
    this.filteredBudgets = this.myControlBudget.valueChanges.pipe(
      startWith(''),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(val => {
        return this.filterBudgets(val || '')
      })
    )
  }

  public filterBudgets(val: string): Observable<any[]> {
    return this.budgetsDispatcherService.getBudgetsByBorrower(this.personBorrowerId)
      .pipe(
        map((response: any[]) => response.filter((option: { ID: string }) => {
          return option.ID.toLowerCase()
        }))
      )
  }

  public searchPersonByAutoComplete(): void {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(val => {
        return this.filterPersons(val || '')
      })
    )
  }

  displayStateBudget(state: any) {
    return state && state.BudgetNumber ? state.BudgetNumber : '';
  }

  public filterPersons(val: string): Observable<any[]> {
    return this.personAutocompleteService.getPersonAuthorizationAutocomplete()
      .pipe(
        map((response: any[]) => response.filter((option: { Name: string; ID: string }) => {
          return option.Name.toLowerCase()
        }))
      )
  }

  displayStatePerson(state: any) {
    return state && state.Name ? state.Name : '';
  }

  onSelectionChanged(event: MatAutocompleteSelectedEvent) {

    this.treatProfilePicExhibition(event.option.value.ProfilePic)
    this.personBorrowerId = event.option.value.ID;
    if (event.option.value.PersonPrincipalPhone != null) {
      this.personPrincipalPhone = `(${event.option.value.PersonPrincipalPhone.CodeArea}) ${event.option.value.PersonPrincipalPhone.NumberPhone}`;
    } else {
      this.personPrincipalPhone = `Não informado`;
    }

    if (event.option.value.PersonPrincipalAddress != null) {
      this.personPrincipalAddress = `${event.option.value.PersonPrincipalAddress.PublicPlace}, ${event.option.value.PersonPrincipalAddress.AddressNumber} - ${event.option.value.PersonPrincipalAddress.District} - ${event.option.value.PersonPrincipalAddress.City}/${event.option.value.PersonPrincipalAddress.State}`
    } else {
      this.personPrincipalAddress = `Não informado`;
    }

    this.personPrincipalInfoVisible = true;
  }

  public treatProfilePicExhibition(profilePic: string): void {

    if (profilePic != null && profilePic != "") {
      this.profilePicExhibition = `${this.imagePathUrl}${profilePic}`;
    } else {
      this.profilePicExhibition = `${this.imagePathUrlDefault}`;
    }

  }
}
