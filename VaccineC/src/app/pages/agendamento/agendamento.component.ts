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
import { PersonsPhonesDispatcherService } from 'src/app/services/person-phone-dispatcher.service';
import { AuthorizationSuggestionModel } from 'src/app/models/authorization-suggestion-model';

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

    /*
    let fullCalendarEvent = {
      id: '28eb8764-1184-4448-a7bd-bb605070764z',
      title: '',
      start: '2022-10-11T08:00:00',
      end: '2022-10-11T18:00:00',
      description: '',
      display: 'background'
    }
    this.events.push(fullCalendarEvent);
    */
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
        hint: "Buscar Agendamentos",
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
        selectable: false,
        eventDidMount: function (info) {

          if (info.event._def.extendedProps.authSituation == 'P') {
            info.el.style.color = '#37d89d';
          }

          info.el.title = `(${info.timeText}) ${info.event._def.extendedProps.description}`;
        }
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
    setTimeout(() => {
      this.calendarOptions = {
        ...this.calendarOptions,
        slotDuration: this.slotDuration,
        slotLabelInterval: this.slotLabelInterval,
        slotMinTime: this.slotMinTime,
        slotMaxTime: this.slotMaxTime,
        events: this.events
      }
    }, 200);

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

  //Variaveis PF
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
  public notify!: boolean;
  public personBirthday!: string;
  public personPhone!: string;
  public cellphonesList!: any;
  public personType!: string;
  public ApplicationDates: any = {};

  //Variáveis PJ
  public budgetJuridicalId!: string;
  public typeOfServiceJuridical!: string;

  //Controle de exibição
  public dataInfoVisible = false;
  public personPrincipalInfoVisible = false;
  public personPrincipalJuridicalInfoVisible = false;
  public tableBudgetProductPhysicalVisible = false;
  public tableBudgetProductJuridicalVisible = false;
  public isSuggestDosesVisible = false;
  public isNotifyChecked = false;
  public personBirthdayTitle!: string;
  public personBirthdayIcon!: string;

  //Autocomplete Pessoa
  public myControl = new FormControl();
  public options: string[] = [];
  public filteredOptions: Observable<any[]> | undefined;

  //Autocomplete Orçamento PF
  public myControlBudget = new FormControl();
  public acBudgets: string[] = [];
  public filteredBudgets: Observable<any[]> | undefined;

  //Autocomplete Orçamento PJ
  public myControlBudgetJuridical = new FormControl();
  public acBudgetsJuridical: string[] = [];
  public filteredBudgetsJ: Observable<any[]> | undefined;

  //Table Produtos PF
  public displayedColumnsBudgetProduct: string[] = ['select', 'ProductName', 'ProductDose', 'ApplicationDate', 'toggle', 'ID'];
  public dataSourceBudgetProduct = new MatTableDataSource<IBudgetProduct>();
  selection = new SelectionModel<IBudgetProduct>(true, []);

  //Table Produtos PJ
  public displayedColumnsBudgetProductJuridical: string[] = ['select', 'ProductName', 'Borrower', 'ApplicationDate', 'ID'];
  public dataSourceBudgetProductJuridical = new MatTableDataSource<IBudgetProduct>();
  selectionJuridical = new SelectionModel<IBudgetProduct>(true, []);

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
    private personsPhonesDispatcherService: PersonsPhonesDispatcherService,
    private errorHandler: ErrorHandlerService,
    private messageHandler: MessageHandlerService,
    private formBuilder: FormBuilder,
    private cd: ChangeDetectorRef,
    public dialogRef: MatDialogRef<AddAuthorizationDialog>
  ) { }

  //Form
  authorizationForm: FormGroup = this.formBuilder.group({
    AuthorizationDateFormated: [null],
    PersonId: [null],
    TypeOfService: [null],
    BudgetId: [null],
    ApplicationDate: [null],
    Notify: [null],
    PersonPhone: [null]
  });

  //Form Juridical
  authorizationJuridicalForm: FormGroup = this.formBuilder.group({
    BudgetJuridicalId: [null],
    TypeOfServiceJuridical: [null],
    ApplicationDateJ: [null]
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


  isAllSelectedJuridical() {
    const numSelected = this.selectionJuridical.selected.length;
    const numRows = this.dataSourceBudgetProductJuridical.data.length;
    return numSelected === numRows;
  }

  toggleAllRowsJuridical() {
    if (this.isAllSelectedJuridical()) {
      this.selectionJuridical.clear();
      return;
    }

    this.selectionJuridical.select(...this.dataSourceBudgetProductJuridical.data);
  }

  checkboxLabelJuridical(row?: IBudgetProduct): string {
    if (!row) {
      return `${this.isAllSelectedJuridical() ? 'deselect' : 'select'} all`;
    }
    return `${this.selectionJuridical.isSelected(row) ? 'deselect' : 'select'} row ${row.BudgetId + 1}`;
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

  public searchBudgetJuridicalByAutoComplete(): void {
    this.filteredBudgetsJ = this.myControlBudgetJuridical.valueChanges.pipe(
      startWith(''),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(val => {
        return this.filterBudgetsJ(val || '')
      })
    )
  }

  public filterBudgetsJ(val: string): Observable<any[]> {
    return this.budgetsDispatcherService.getBudgetsByResponsible(this.personBorrowerId)
      .pipe(
        map((response: any[]) => response.filter((option: { ID: string }) => {
          return option.ID.toLowerCase()
        }))
      )
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

  displayStateBudgetJuridical(state: any) {
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

    this.personType = event.option.value.PersonType;
    this.personPrincipalInfoVisible = false;
    this.profilePicExhibition = `${this.imagePathUrlDefault}`;
    this.budgetId = "";
    this.budgetJuridicalId = "";
    this.typeOfServiceJuridical = "";
    this.typeOfService = "";
    this.personPhone = "";
    this.cellphonesList = "";
    this.isNotifyChecked = false;
    this.isSuggestDosesVisible = false;

    this.authorizationForm.clearValidators();
    this.authorizationForm.updateValueAndValidity();

    this.authorizationJuridicalForm.clearValidators();
    this.authorizationJuridicalForm.updateValueAndValidity();

    this.dataSourceBudgetProduct = new MatTableDataSource();
    this.dataSourceBudgetProductJuridical = new MatTableDataSource();

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
    this.dataInfoVisible = true;

    if (event.option.value.PersonType == "F") {
      this.personPrincipalInfoVisible = true;
      this.personPrincipalJuridicalInfoVisible = false;
    } else {
      this.personPrincipalJuridicalInfoVisible = true;
      this.personPrincipalInfoVisible = false;
    }

  }

  public treatProfilePicExhibition(profilePic: string): void {

    if (profilePic != null && profilePic != "") {
      this.profilePicExhibition = `${this.imagePathUrl}${profilePic}`;
    } else {
      this.profilePicExhibition = `${this.imagePathUrlDefault}`;
    }

  }

  public budgetSearchId!: string;

  onSelectionBudgetChanged(event: MatAutocompleteSelectedEvent) {
    this.budgetSearchId = event.option.value.ID;
    this.budgetsProductsDispatcherService.GetAllPendingBudgetsProductsByBorrower(event.option.value.ID, this.authorizationForm.value.PersonId.ID, new Date(this.data.Start).toUTCString()).subscribe(
      response => {

        this.dataSourceBudgetProduct = new MatTableDataSource(response);
        this.tableBudgetProductPhysicalVisible = true;
        this.isSuggestDosesVisible = true;
        this.cd.detectChanges();

      },
      error => {
        console.log(error);
      });
  }

  formateApplicationDate(date: string) {
    if (date != null) {
      let data = "";
      let lastChar = date.substr(date.length - 1);
      if (lastChar == 'Z') {
        data = date.substring(0, date.length - 1);
      } else {
        data = date;
      }

      let dataFormatada = new Date(data)
      let tzoffset = (new Date()).getTimezoneOffset() * 60000;
      let dataOk = new Date(dataFormatada.getTime() - tzoffset);

      return date = (new Date(dataOk.getTime()).toISOString().slice(0, 16));
    } else {
      return "";
    }

  }

  onSelectionBudgetJuridicalChanged(event: MatAutocompleteSelectedEvent) {
    this.budgetSearchId = event.option.value.ID;
    this.budgetsProductsDispatcherService.GetAllPendingBudgetsProductsByResponsible(event.option.value.ID, new Date(this.data.Start).toUTCString()).subscribe(
      response => {
        this.isSuggestDosesVisible = true;
        this.tableBudgetProductJuridicalVisible = true;
        this.dataSourceBudgetProductJuridical = new MatTableDataSource(response);
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

    let isAnyNotifyActivated = 0;

    this.dataSourceBudgetProduct.data.forEach((budgetProduct: any) => {
      if (budgetProduct.Notify == true) {
        isAnyNotifyActivated++;
      }
    });

    if (isAnyNotifyActivated > 0) {

      this.cellphonesList = "";

      this.personsPhonesDispatcherService.getAllPersonsPhonesCelByPersonId(this.authorizationForm.value.PersonId.ID).subscribe(
        response => {
          this.cellphonesList = response;
        }, error => {
          this.cellphonesList = "";
          console.log(error);
          this.errorHandler.handleError(error);
        });

      this.personPhone = "";
      this.isNotifyChecked = true;
    } else {
      this.personPhone = "";
      this.isNotifyChecked = false;
      this.cellphonesList = "";
    }

  }

  public addAuthorization() {
    if (this.personType == "F") {
      this.addAuthorizationPhysical();
    } else {
      this.addAuthorizationJuridical();
    }
  }

  public addAuthorizationJuridical() {

    if (!this.authorizationJuridicalForm.valid) {
      console.log(this.authorizationJuridicalForm);
      this.authorizationJuridicalForm.markAllAsTouched();
      this.messageHandler.showMessage("Campos obrigatórios não preenchidos, verifique!", "warning-snackbar");
      return;
    }

    if (this.selectionJuridical.selected.length == 0 && this.dataSourceBudgetProductJuridical.data.length != 0) {
      this.messageHandler.showMessage("É necessário selecionar ao menos um Produto para agendar!", "warning-snackbar")
      return;
    }

    if (this.dataSourceBudgetProductJuridical.data.length == 0) {
      this.messageHandler.showMessage("É necessário selecionar ao menos um Produto para agendar!", "warning-snackbar")
      return;
    }

    let listAuthorizationModel = new Array<AuthorizationModel>();

    this.selectionJuridical.selected.forEach((register: any) => {
      console.log(register)
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
      authorizationModel.BorrowerPersonId = register.BorrowerPersonId;
      authorizationModel.Situation = "C";
      authorizationModel.TypeOfService = this.typeOfServiceJuridical;
      authorizationModel.Notify = "N"
      authorizationModel.BudgetProductId = register.ID;
      authorizationModel.Event = eventModel;


      listAuthorizationModel.push(authorizationModel);
    });
    console.log(listAuthorizationModel)

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

  public addAuthorizationPhysical() {

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

    if (this.isNotifyChecked == true && this.cellphonesList.length > 0 && this.personPhone == "") {
      this.messageHandler.showMessage("É necessário informar um telefone para notificar!", "warning-snackbar")
      return;
    }

    if (this.isNotifyChecked == true && this.cellphonesList.length > 0 && this.personPhone == undefined) {
      this.messageHandler.showMessage("É necessário informar um telefone para notificar!", "warning-snackbar")
      return;
    }

    let listAuthorizationModel = new Array<AuthorizationModel>();

    this.selection.selected.forEach((register: any) => {

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

      if (authorizationModel.Notify == 'S') {
        authorizationModel.PersonPhone = `${this.authorizationForm.value.PersonPhone.CodeArea}${this.authorizationForm.value.PersonPhone.NumberPhone}`;
      }
      console.log(authorizationModel)
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

  public suggestDoses() {
    if (this.personType == 'F') {
      this.suggestDosesPhysical();
    } else {
      this.suggestDosesJuridical();
    }
  }

  public suggestDosesPhysical() {

    if (this.selection.selected.length <= 1 && this.dataSourceBudgetProduct.data.length != 0) {
      this.messageHandler.showMessage("Selecione 2 ou mais produtos!", "warning-snackbar")
      return;
    }

    if (this.dataSourceBudgetProduct.data.length <= 1) {
      this.messageHandler.showMessage("Selecione 2 ou mais produtos!", "warning-snackbar")
      return;
    }

    let listAuthorizationSuggestionModel = new Array<AuthorizationSuggestionModel>();

    this.selection.selected.forEach((register: any) => {

      let authorizationSuggestionModel = new AuthorizationSuggestionModel();
      authorizationSuggestionModel.BudgetId = this.budgetSearchId;
      authorizationSuggestionModel.BudgetProductId = register.ID;
      authorizationSuggestionModel.BorrowerId = register.BorrowerPersonId;

      if (register.ProductDose == null) {
        authorizationSuggestionModel.DoseType = "";
      } else {
        authorizationSuggestionModel.DoseType = register.ProductDose;
      }

      authorizationSuggestionModel.ProductId = register.Product.ID;

      if (register.ApplicationDate != null) {
        authorizationSuggestionModel.StartDate = new Date(register.ApplicationDate);
        authorizationSuggestionModel.StartTime = this.formatHour(new Date(register.ApplicationDate));
      }

      listAuthorizationSuggestionModel.push(authorizationSuggestionModel);
    });

    this.authorizationDispatcherService.suggestDoses(listAuthorizationSuggestionModel).subscribe(
      response => {
        this.selection.clear();

        this.dataSourceBudgetProduct.data.forEach((budgetProduct: any) => {


          response.forEach((budgetProductResponse: any) => {
            if (budgetProduct.ID == budgetProductResponse.ID) {
              console.log(budgetProduct)
              console.log(budgetProductResponse)
              console.log(true)

              if (budgetProductResponse.ApplicationDate != null) {
                budgetProduct.ApplicationDate = budgetProductResponse.ApplicationDate;
              }
            }
          });

        });
        console.log(response)
        //this.dataSourceBudgetProduct = new MatTableDataSource(response);

      }, error => {
        console.log(error);
        this.errorHandler.handleError(error);
      });

  }

  public suggestDosesJuridical() {

    if (this.selectionJuridical.selected.length <= 1 && this.dataSourceBudgetProductJuridical.data.length != 0) {
      this.messageHandler.showMessage("Selecione 2 ou mais produtos!", "warning-snackbar")
      return;
    }

    if (this.dataSourceBudgetProductJuridical.data.length <= 1) {
      this.messageHandler.showMessage("Selecione 2 ou mais produtos!", "warning-snackbar")
      return;
    }

    let listAuthorizationSuggestionModel = new Array<AuthorizationSuggestionModel>();

    this.selectionJuridical.selected.forEach((register: any) => {

      let authorizationSuggestionModel = new AuthorizationSuggestionModel();
      authorizationSuggestionModel.BudgetId = this.budgetSearchId;
      authorizationSuggestionModel.BudgetProductId = register.ID;
      authorizationSuggestionModel.BorrowerId = register.BorrowerPersonId;

      if (register.ProductDose == null) {
        authorizationSuggestionModel.DoseType = "";
      } else {
        authorizationSuggestionModel.DoseType = register.ProductDose;
      }

      authorizationSuggestionModel.ProductId = register.Product.ID;

      if (register.ApplicationDate != null) {
        authorizationSuggestionModel.StartDate = new Date(register.ApplicationDate);
        authorizationSuggestionModel.StartTime = this.formatHour(new Date(register.ApplicationDate));
      }

      listAuthorizationSuggestionModel.push(authorizationSuggestionModel);
    });

    this.authorizationDispatcherService.suggestJuridicalDoses(listAuthorizationSuggestionModel).subscribe(
      response => {
        this.selectionJuridical.clear();
        this.dataSourceBudgetProductJuridical = new MatTableDataSource(response);

      }, error => {
        console.log(error);
        this.errorHandler.handleError(error);
      });

  }

  public treatBirthdayExhibition(commemorativeDate: Date, personType: string) {
    if (personType == "J") {
      this.personBirthdayTitle = `Fundação`;
      this.personBirthdayIcon = `person-digging`;
      this.personBirthday = `${this.formatDate(new Date(commemorativeDate))}`;
    } else {
      this.personBirthdayTitle = `Aniversário`;
      this.personBirthdayIcon = `cake-candles`;
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

        if (authorization.BudgetProduct.ProductDose == null || authorization.BudgetProduct.ProductDose == '' || authorization.BudgetProduct.ProductDose == undefined) {
          this.product = `${authorization.BudgetProduct.Product.Name}`
        } else {
          this.product = `${authorization.BudgetProduct.Product.Name} (${this.resolveExibitionDoseType(authorization.BudgetProduct.ProductDose)})`
        }

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
    private messageHandler: MessageHandlerService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {

  }

  public loadAuthData() {
    this.searchButtonLoading = true;

    if (this.searchAuth == undefined || this.searchAuth == null || this.searchAuth == "") {
      this.messageHandler.showMessage("É necessário informar no mínimo 3 caracteres para realizar a busca!", "danger-snackbar");
      this.searchButtonLoading = false;
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
  public sendDateHour!: string;
  public personPhone!: string;
  public message!: string;
  public status!: string;

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

  //Form
  authorizationNotificationForm: FormGroup = this.formBuilder.group({
    SendDateHour: [null],
    PersonPhone: [null],
    Message: [null],
    Status: [null]
  });

  public getAuthNotificationByAuth() {
    this.authorizationsNotificationsDispatcherService.getAuthorizationNotificationByAuthorizationId(this.authorizationId).subscribe(
      response => {
        console.log(response)
        this.personPhone = response.PersonPhone;
        this.message = response.Message;
        this.status = response.ReturnMessage;
        this.sendDateHour = `${this.formatDate(new Date(response.SendDate))} - ${this.formatHour(response.SendHour)}`;
      },
      error => {
        this.errorHandler.handleError(error);
        console.log(error);
      });
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

  public formatHour(hour: string) {
    return `${hour.substring(0, hour.length - 3)}`
  }

}