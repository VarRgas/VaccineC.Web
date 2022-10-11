import { ChangeDetectorRef, Component, ElementRef, Inject, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
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
import interactionPlugin, { ThirdPartyDraggable } from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import { INITIAL_EVENTS } from './event-utils';
import brLocale from '@fullcalendar/core/locales/pt-br';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
import { AuthorizationUpdateModel } from 'src/app/models/authorization-update-model';
import { IAuthorization } from 'src/app/interfaces/i-authorization';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AuthorizationsNotificationsDispatcherService } from 'src/app/services/authorization-notification-dispatcher.service';

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
      title = `${title.substring(0, 18)}...`;
    }
    return title.toUpperCase();
  }

  ngOnInit(): void {

    setTimeout(() => {
      const button = document.getElementsByClassName('fc-myCustomButton-button')[0];

      button?.addEventListener('click', (event) => {
        this.openSearchAuthorizationDialog();
      });
    }, 500);

    this.eventsDispatcherService.getAllEventsActive().subscribe(
      events => {

        events.forEach((event: any) => {
          this.eventTitle = event.Info;
          let fullCalendarEvent = {
            id: event.ID,
            title: this.formatEventTitle(event.Info),
            start: this.formatDate(event.StartDate, event.StartTime),
            end: this.formatDate(event.EndDate, event.EndTime),
            description: event.CompleteInfo,
            authSituation: event.AuthSituation
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
      left: 'prev,next today myCustomButton',
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
    customButtons: {
      myCustomButton: {

        text: 'Buscar',
        click: function () {

        }
      }
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

      if (info.event._def.extendedProps.authSituation == 'C') {
        info.el.style.backgroundColor = '#3788d8';
        info.el.style.borderColor = '#3788d8';
      } else if (info.event._def.extendedProps.authSituation == 'P') {
        info.el.style.backgroundColor = '#37d89d';
        info.el.style.borderColor = '#37d89d';
      }

      info.el.title = `(${info.timeText}) ${info.event._def.extendedProps.description}`;
    },
    views: {
      dayGridMonth: {
        selectable: false
      },
      timeGrid: {
        selectable: true
      }
    },
    nowIndicator: true,
    eventStartEditable: false,
    expandRows: true,
    eventDurationEditable: false,
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this),
    /* you can update a remote database when these fire:
    eventAdd:
    eventChange:
    eventRemove:
    */

  };
  currentEvents: EventApi[] = [

  ];

  public openSearchAuthorizationDialog() {
    this.dialogRef = this.dialog.open(SearchAuthorizationDialog, {
      disableClose: true,
      width: '80vw',
    });
  }

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
    this.eventsDispatcherService.getAllEventsActive().subscribe(
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

    this.dialogRef = this.dialog.open(UpdateAuthorizationDialog, {
      disableClose: true,
      width: '60vw',
      data: {
        Id: clickInfo.event._def.publicId
      },
    });
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
  public personBirthday!: string;

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
    console.log(event.option.value)
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
    this.treatBirthdayExhibition(event.option.value.CommemorativeDate, event.option.value.PersonType);
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

    if (this.dataSourceBudgetProduct.data.length == 0) {
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

    this.authorizationDispatcherService.createOnDemand(listAuthorizationModel).subscribe(
      response => {
        setTimeout(() => {
          window.location.reload();
        }, 200);
      }, error => {
        console.log(error);
        this.errorHandler.handleError(error);
      });

  }

  public treatBirthdayExhibition(commemorativeDate: Date, personType: string) {
    if (personType == "J") {
      this.personBirthday = `${this.formatDate(new Date(commemorativeDate))}`;
    } else {
      this.personBirthday = `${this.formatDate(new Date(commemorativeDate))} - ${this.getPersonAge(commemorativeDate)} anos`;
    }
  }

  public getPersonAge(commemorativeDate: Date) {
    const bdate = new Date(commemorativeDate);
    const timeDiff = Math.abs(Date.now() - bdate.getTime());
    return Math.floor((timeDiff / (1000 * 3600 * 24)) / 365);
  }
}


//DIALOG UPDATE AUTHORIZATION
@Component({
  selector: 'update-authorization-dialog',
  templateUrl: 'update-authorization-dialog.html',
})
export class UpdateAuthorizationDialog implements OnInit {

  public imagePathUrl = 'http://localhost:5000/';
  public imagePathUrlDefault = "../../../assets/img/default-profile-pic.png";

  public eventId!: string;
  public authorizationId!: string;
  public profilePicExhibition!: string;
  public personName!: string;
  public personPrincipalAddress!: string;
  public personPrincipalPhone!: string;
  public personBirthday!: string;
  public budgetNumber!: number;
  public typeOfService!: string;
  public product!: string;
  public notify!: string;
  public authorizationNumber!: number;
  public applicationDate!: string;
  public notifyInformation!: string;

  public isDisabled = false;

  constructor(
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<UpdateAuthorizationDialog>,
    public dialogNotRef: MatDialogRef<AuthorizationNotificationDialog>,
    private authorizationsDispatcherService: AuthorizationsDispatcherService,
    private errorHandler: ErrorHandlerService,
    private messageHandler: MessageHandlerService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.eventId = this.data.Id;
    this.getAuthorizationByEventId();
  }

  //Form
  authorizationForm: FormGroup = this.formBuilder.group({
    AuthorizationDateFormated: [null],
    PersonName: [null],
    PersonId: [null],
    TypeOfService: [null],
    BudgetId: [null],
    ApplicationDate: [null, [Validators.required]],
    Notify: [null],
    BudgetNumber: [null],
    Product: [null]
  });

  public getAuthorizationByEventId() {
    this.authorizationsDispatcherService.getAuthorizationByEventId(this.eventId).subscribe(
      authorization => {
        console.log(authorization);
        this.authorizationId = authorization.ID;
        this.treatSituationAuth(authorization.Situation);
        this.treatProfilePicExhibition(authorization.Person.ProfilePic);
        this.treatPersonInfoExhibition(authorization.Person);
        this.personName = authorization.Person.Name;
        this.typeOfService = authorization.TypeOfService;
        this.product = `${authorization.BudgetProduct.Product.Name} (${this.resolveExibitionDoseType(authorization.BudgetProduct.ProductDose)})`
        this.notify = authorization.Notify;
        this.notifyInformation = authorization.Notify == "S" ? "Notificação por SMS ativada" : "Notificação por SMS desativada";
        this.authorizationNumber = authorization.AuthorizationNumber;
        this.budgetNumber = authorization.BudgetProduct.Budget.BudgetNumber;
        this.treatBirthdayExhibition(authorization.Person.CommemorativeDate)
        this.treatAuthDateExhibition(authorization.Event.StartDate, authorization.Event.StartTime);

      },
      error => {
        console.log(error);
      });
  }

  public updateAuthorization() {

    if (!this.authorizationForm.valid) {
      console.log(this.authorizationForm);
      this.authorizationForm.markAllAsTouched();
      this.messageHandler.showMessage("Campos obrigatórios não preenchidos, verifique!", "warning-snackbar");
      return;
    }

    let authorizationUpdate = new AuthorizationUpdateModel();
    authorizationUpdate.ID = this.authorizationId;
    authorizationUpdate.UserId = localStorage.getItem('userId')!;
    authorizationUpdate.EventId = this.eventId;
    authorizationUpdate.StartDateEvent = new Date(this.applicationDate);
    authorizationUpdate.StartTimeEvent = this.formatHour(new Date(this.applicationDate));

    this.authorizationsDispatcherService.update(authorizationUpdate.ID, authorizationUpdate).subscribe(
      response => {
        setTimeout(() => {
          window.location.reload();
        }, 200);
      },
      error => {
        this.errorHandler.handleError(error);
        console.log(error);
      });

  }

  public cancelAuthorization() {

    const dialogRef = this.dialog.open(ConfirmCancelAuthorizationDialog);

    dialogRef.afterClosed()
      .subscribe(result => {
        if (!!result) {
          this.authorizationsDispatcherService.delete(this.authorizationId, localStorage.getItem('userId')!).subscribe(
            response => {
              setTimeout(() => {
                window.location.reload();
              }, 200);
            },
            error => {
              this.errorHandler.handleError(error);
              console.log(error);
            });
        }
      });

  }

  public treatProfilePicExhibition(profilePic: string): void {
    if (profilePic != null && profilePic != "") {
      this.profilePicExhibition = `${this.imagePathUrl}${profilePic}`;
    } else {
      this.profilePicExhibition = `${this.imagePathUrlDefault}`;
    }
  }

  public treatPersonInfoExhibition(person: any): void {

    if (person.PersonPrincipalAddress != null) {
      this.personPrincipalAddress = `${person.PersonPrincipalAddress.PublicPlace}, ${person.PersonPrincipalAddress.AddressNumber} - ${person.PersonPrincipalAddress.District} - ${person.PersonPrincipalAddress.City}/${person.PersonPrincipalAddress.State}`
    } else {
      this.personPrincipalAddress = `Não informado`;
    }

    if (person.PersonPrincipalPhone != null) {
      this.personPrincipalPhone = `(${person.PersonPrincipalPhone.CodeArea}) ${person.PersonPrincipalPhone.NumberPhone}`;
    } else {
      this.personPrincipalPhone = `Não informado`;
    }
  }

  public treatAuthDateExhibition(startDate: any, startTime: any) {

    let startDateFormat = new Date(startDate);
    startDateFormat.setHours(parseInt(startTime.split(":")[0]), parseInt(startTime.split(":")[1]));
    let tzoffset = (new Date()).getTimezoneOffset() * 60000;
    this.applicationDate = (new Date(startDateFormat.getTime() - tzoffset).toISOString().slice(0, 16));

  }

  public treatSituationAuth(situation: string) {
    if (situation == 'P') {
      this.isDisabled = true;
    } else if (situation == 'X') {
      this.isDisabled = true;
    } else {
      this.isDisabled = false;
    }
  }

  public treatBirthdayExhibition(commemorativeDate: Date) {
    this.personBirthday = `${this.formatDate(new Date(commemorativeDate))} - ${this.getPersonAge(commemorativeDate)} anos`;
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

  public getPersonAge(commemorativeDate: Date) {
    const bdate = new Date(commemorativeDate);
    const timeDiff = Math.abs(Date.now() - bdate.getTime());
    return Math.floor((timeDiff / (1000 * 3600 * 24)) / 365);
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

  public formatHour(date: Date) {
    return `${this.padStr(date.getHours())}:${this.padStr(date.getMinutes())}`
  }

  public padStr(i: any) {
    return (i < 10) ? "0" + i : "" + i;
  }

  public loadNotifications(event: any) {
    if (this.notify == "N") {
      event.stopPropagation();
    } else {
      this.dialogNotRef = this.dialog.open(AuthorizationNotificationDialog, {
        disableClose: true,
        width: '40vw',
        data: {
          Id: this.authorizationId
        },
      });
    }

  }
}

//DIALOG CONFIRM CANCEL AUTHORIZATION
@Component({
  selector: 'confirm-cancel-authorization-dialog',
  templateUrl: 'confirm-cancel-authorization-dialog.html',
})
export class ConfirmCancelAuthorizationDialog implements OnInit {
  ngOnInit(): void {

  }
}

//DIALOG SEARCH AUTHORIZATION
@Component({
  selector: 'search-authorization-dialog',
  templateUrl: 'search-authorization-dialog.html',
})
export class SearchAuthorizationDialog implements OnInit {

  //Table
  public value = '';
  public displayedColumns: string[] = ['AuthorizationNumber', 'Date', 'Borrower', 'Product', 'ID', 'Options'];
  public dataSource = new MatTableDataSource<IAuthorization>();

  public authSituation!: string;
  public authSituationTitle!: string;

  //Controle para o spinner do button
  public searchButtonLoading = false;

  //Variáveis dos inputs
  public searchAuth!: string;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<UpdateAuthorizationDialog>,
    private authorizationsDispatcherService: AuthorizationsDispatcherService,
    private eventsDispatcherService: EventsDispatcherService,
    private errorHandler: ErrorHandlerService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {

  }

  public loadAuthData() {
    this.searchButtonLoading = true;

    if (this.searchAuth == "" || this.searchAuth == null || this.searchAuth == undefined) {
      this.getAllAuth();
    } else {
      this.getAuthByParameter();
    }
  }

  public getAllAuth() {
    this.authorizationsDispatcherService.getAllAuthorizations().subscribe(
      response => {
        console.log(response)
        this.dataSource = new MatTableDataSource(response);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        this.searchButtonLoading = false;
      },
      error => {
        this.errorHandler.handleError(error);
        console.log(error);

        this.searchButtonLoading = false;
      });
  }

  public getAuthByParameter() {
    this.authorizationsDispatcherService.getAuthorizationByParameter(this.searchAuth).subscribe(
      response => {
        console.log(response)
        this.dataSource = new MatTableDataSource(response);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        this.searchButtonLoading = false;
      },
      error => {
        this.errorHandler.handleError(error);
        console.log(error);

        this.searchButtonLoading = false;
      });
  }

  public treatAuthSituation(situation: string) {

    if (situation == "C") {
      this.authSituation = 'situation-pending'
      this.authSituationTitle = 'Confirmado'
    } else if (situation == "P") {
      this.authSituation = 'situation-finalized'
      this.authSituationTitle = 'Aplicado'
    } else if (situation == "X") {
      this.authSituation = 'situation-canceled'
      this.authSituationTitle = 'Cancelado'
    } else {
      this.authSituation = ''
      this.authSituationTitle = ''
    }
  }

  public openUpdateAuthorizationDialog(eventId: string) {
    this.dialogRef = this.dialog.open(UpdateAuthorizationDialog, {
      disableClose: true,
      width: '60vw',
      data: {
        Id: eventId
      },
    });
  }

}

//DIALOG AUTHORIZATION NOTIFICATION
@Component({
  selector: 'authorization-notification-dialog',
  templateUrl: 'authorization-notification-dialog.html',
})
export class AuthorizationNotificationDialog implements OnInit {

  public authorizationId!: string;

  constructor(
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<UpdateAuthorizationDialog>,
    private authorizationsNotificationsDispatcherService: AuthorizationsNotificationsDispatcherService,
    private eventsDispatcherService: EventsDispatcherService,
    private errorHandler: ErrorHandlerService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.authorizationId = this.data.Id;
    this.getAuthNotificationByAuth();
  }

  public getAuthNotificationByAuth() {
    this.authorizationsNotificationsDispatcherService.getAuthorizationNotificationByAuthorizationId(this.authorizationId).subscribe(
      response => {
        console.log(response)
      },
      error => {
        this.errorHandler.handleError(error);
        console.log(error);
      });
  }
}