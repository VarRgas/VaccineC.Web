import { ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
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
import { BudgetsProductsDispatcherService } from 'src/app/services/budgets-products-dispatcher.service';
import { MatTableDataSource } from '@angular/material/table';
import { IBudgetProduct } from 'src/app/interfaces/i-budget-product';
import { SelectionModel } from '@angular/cdk/collections';
import { MessageHandlerService } from 'src/app/services/message-handler.service';
import { EventModel } from 'src/app/models/event-model';
import { AuthorizationModel } from 'src/app/models/authorization-model';
import { AuthorizationsDispatcherService } from 'src/app/services/authorization-dispatcher.service';

defineFullCalendarElement()

@Component({
  selector: 'app-agendamento',
  templateUrl: './agendamento.component.html',
  styleUrls: ['./agendamento.component.scss']
})
export class AgendamentoComponent implements OnInit {

  reason = '';

  @ViewChild('calendar') calendarRef!: ElementRef<FullCalendarElement>;

  public dialogRef?: MatDialogRef<any>;
  public informationField!: string;
  public slotMinTime!: Duration | DurationInput;
  public slotMaxTime!: Duration | DurationInput;
  public slotDuration!: Duration | DurationInput;
  public slotLabelInterval!: Duration | DurationInput;
  public events: EventInput[] = [];
  public eventTitle!: string;

  public formatEventTitle(title: string): string {

    if (title.length > 19) {
      title = `${title.substring(0, 16)}...`;
    }
    return title.toUpperCase();
  }

  ngOnInit(): void {

    this.eventsDispatcherService.getAllEvents().subscribe(
      events => {
        events.forEach((event: any) => {
          this.eventTitle = event.Info;
          let fullCalendarEvent = {
            id: event.ID,
            title: this.formatEventTitle(event.Info),
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
    eventDidMount: function (info) {
      info.el.title = `(${info.timeText}) ${info.event._def.title}`;
    },
    nowIndicator: true,


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
        End: selectInfo.end,
      },
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
  public ApplicationDate!: any;
  public notify!: boolean;

  public personPrincipalInfoVisible = false;

  //Autocomplete Pessoa
  public myControl = new FormControl();
  public options: string[] = [];
  public filteredOptions: Observable<any[]> | undefined;

  //Autocomplete Orçamento
  public myControlBudget = new FormControl();
  public acBudgets: string[] = [];
  public filteredBudgets: Observable<any[]> | undefined;


  //Table Produtos
  public displayedColumnsBudgetProduct: string[] = ['select', 'ProductName', 'ProductDose', 'ApplicationDate', 'toggle', 'ID'];
  public dataSourceBudgetProduct = new MatTableDataSource<IBudgetProduct>();
  selection = new SelectionModel<IBudgetProduct>(true, []);

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
    private budgetsProductsDispatcherService: BudgetsProductsDispatcherService,
    private authorizationDispatcherService: AuthorizationsDispatcherService,
    private cdRef: ChangeDetectorRef,
    private errorHandler: ErrorHandlerService,
    private messageHandler: MessageHandlerService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<AddAuthorizationDialog>
  ) { }

  //Form
  authorizationForm: FormGroup = this.formBuilder.group({
    AuthorizationDateFormated: [null],
    PersonId: [null],
    TypeOfService: [null],
    BudgetId: [null],
    ApplicationDate: [null],
    Notify: [null]
  });

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSourceBudgetProduct.data.length;
    return numSelected === numRows;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSourceBudgetProduct.data);
  }

  checkboxLabel(row?: IBudgetProduct): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.BudgetId + 1}`;
  }


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

    this.budgetId = "";
    this.typeOfService = "";

    this.authorizationForm.clearValidators();
    this.authorizationForm.updateValueAndValidity();
    this.dataSourceBudgetProduct = new MatTableDataSource();

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

  onSelectionBudgetChanged(event: MatAutocompleteSelectedEvent) {
    this.budgetsProductsDispatcherService.GetAllPendingBudgetsProductsByBorrower(event.option.value.ID, this.authorizationForm.value.PersonId.ID).subscribe(
      response => {
        if (response.length > 0) {

          /*
          let tzoffset = (new Date()).getTimezoneOffset() * 60000;
          response[0].ApplicationDate = (new Date(this.startDate.getTime() - tzoffset).toISOString().slice(0, 16));
          this.dataSourceBudgetProduct = new MatTableDataSource(response);
          this.cdRef.detectChanges();
          */

        }
        this.dataSourceBudgetProduct = new MatTableDataSource(response);
      },
      error => {
        console.log(error);
      });
  }

  public resolveExibitionDoseType(doseType: string) {
    if (doseType == "DU") {
      return "DOSE ÚNICA"
    } else if (doseType == "D1") {
      return "DOSE 1"
    } else if (doseType == "D2") {
      return "DOSE 2"
    } else if (doseType == "D3") {
      return "DOSE 3"
    } else if (doseType == "DR") {
      return "DOSE DE REFORÇO"
    } else {
      return ""
    }
  }

  updateActiveStatus(element: any) {
    element.activate = !element.activate;
  }

  public addAuthorization() {

    if (!this.authorizationForm.valid) {
      console.log(this.authorizationForm);
      this.authorizationForm.markAllAsTouched();
      this.messageHandler.showMessage("Campos obrigatórios não preenchidos, verifique!", "warning-snackbar");
      return;
    }

    if (this.selection.selected.length == 0 && this.dataSourceBudgetProduct.data.length != 0) {
      this.messageHandler.showMessage("É necessário selecionar ao menos um Produto para agendar!", "warning-snackbar")
      return;
    }

    let listAuthorizationModel = new Array<AuthorizationModel>();

    this.selection.selected.forEach((register: any) => {
      console.log(register);
      let startTime = this.formatHour(new Date(register.ApplicationDate));
      let startDate = new Date(register.ApplicationDate);
      startDate.setHours(0, 0, 0, 0);

      let eventModel = new EventModel();
      eventModel.StartDate = startDate;
      eventModel.StartTime = startTime;
      eventModel.Concluded = "N";
      eventModel.Situation = "A";
      eventModel.UserId = localStorage.getItem('userId')!;

      let authorizationModel = new AuthorizationModel();
      authorizationModel.UserId = localStorage.getItem('userId')!;
      authorizationModel.AuthorizationDate = new Date();
      authorizationModel.BorrowerPersonId = this.authorizationForm.value.PersonId.ID;
      authorizationModel.Situation = "C";
      authorizationModel.TypeOfService = this.typeOfService;
      authorizationModel.Notify = register.Notify == true ? "S" : "N"
      authorizationModel.BudgetProductId = register.ID;
      authorizationModel.Event = eventModel;
      listAuthorizationModel.push(authorizationModel);
    });

    console.log(listAuthorizationModel);

    this.authorizationDispatcherService.createOnDemand(listAuthorizationModel).subscribe(
      response => {
        setTimeout(() => {
          window.location.reload();
        }, 300);
      }, error => {
        console.log(error);
        this.errorHandler.handleError(error);
      });

  }
}
