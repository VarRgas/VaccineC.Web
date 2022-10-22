import { Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatBottomSheet, MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatTabGroup } from '@angular/material/tabs';
import { IApplication } from 'src/app/interfaces/i-application';
import { ApplicationModel } from 'src/app/models/application-model';
import { PersonPhysicalModel } from 'src/app/models/person-physical-model';
import { ApplicationsDispatcherService } from 'src/app/services/application-dispatcher.service';
import { AuthorizationsDispatcherService } from 'src/app/services/authorization-dispatcher.service';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { MessageHandlerService } from 'src/app/services/message-handler.service';
import { PersonsAddressesDispatcherService } from 'src/app/services/person-address-dispatcher.service';
import { PersonDispatcherService } from 'src/app/services/person-dispatcher.service';
import { PersonsPhonesDispatcherService } from 'src/app/services/person-phone-dispatcher.service';
import { PersonsPhysicalsDispatcherService } from 'src/app/services/person-physical-dispatcher.service';
import { ProductsSummariesBatchesDispatcherService } from 'src/app/services/product-summary-batch-dispatcher.service';

@Component({
  selector: 'app-aplicacao',
  templateUrl: './aplicacao.component.html',
  styleUrls: ['./aplicacao.component.scss']
})

export class AplicacaoComponent implements OnInit {

  @ViewChild("tabGroup2") tabGroup2!: MatTabGroup;

  public imagePathUrl = 'http://localhost:5000/';
  public imagePathUrlDefault = "../../../assets/img/default-profile-pic.png";

  //Controle de habilitação de campos
  public searchButtonLoading = false;

  //Variáveis dos inputs
  public searchApplicationName!: string;
  public isTableApplicationVisible = true;
  public isApplicationTabDisabled = true;

  //Variáveis de exibição
  public personName!: string;
  public personAge!: string;
  public personPrincipalPhone!: string;
  public personPrincipalAddress!: string;
  public personProfilePic!: string;
  public numberOfApplications!: string;

  //Outros
  public informationField!: string;
  public tdColor = '#efefef';
  public profilePicExhibition!: string;
  public applicationsHistory!: any;

  //Table Pesquisa Aplicação
  public displayedSearchApplicationColumns: string[] = ['color', 'borrower', 'date', 'product', 'ID'];
  public dataSourceSearchApplication = new MatTableDataSource<IApplication>();

  //Table Pesquisa Pessoas
  public displayedSearchPersonColumns: string[] = ['color', 'borrower', 'ID'];
  public dataSourceSearchPerson = new MatTableDataSource<IApplication>();

  //Table Aplicações Disponíveis
  public displayedApplicationColumns: string[] = ['product', 'scheduling', 'date', 'action', 'authorizationId'];
  public dataSourceApplication = new MatTableDataSource<IApplication>();

  @ViewChild('paginatorPerson') paginatorPerson!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private applicationsDispatcherService: ApplicationsDispatcherService,
    private authorizationsDispatcherService: AuthorizationsDispatcherService,
    private personsDispatcherService: PersonDispatcherService,
    private personsPhysicalDispatcherService: PersonsPhysicalsDispatcherService,
    private personsPhoneDispatcherService: PersonsPhonesDispatcherService,
    private personsAddressDispatcherService: PersonsAddressesDispatcherService,
    private _bottomSheet: MatBottomSheet,
    private errorHandler: ErrorHandlerService,
    private messageHandler: MessageHandlerService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getAvailableApplications();
  }

  public loadData(): void {
    this.searchButtonLoading = true;

    if (this.searchApplicationName == undefined || this.searchApplicationName == null || this.searchApplicationName == "") {
      this.messageHandler.showMessage("É necessário informar no mínimo 3 caracteres para realizar a busca!", "danger-snackbar");
      this.searchButtonLoading = false;
    }
    else {
      this.getAllPersonsByInfo();
    }
  }

  public getAvailableApplications(): void {

    this.searchApplicationName = "";

    this.authorizationsDispatcherService.getAllAuthorizationsForApplication()
      .subscribe(
        applications => {
          this.dataSourceSearchApplication = new MatTableDataSource(applications);
          this.isTableApplicationVisible = true;
          this.searchButtonLoading = false;
        },
        error => {
          console.log(error);
          this.errorHandler.handleError(error);
          this.searchButtonLoading = false;
        });
  }

  public getAllPersonsByInfo(): void {

    if (this.searchApplicationName.length < 3) {
      this.messageHandler.showMessage("É necessário informar no mínimo 3 caracteres para realizar a busca!", "danger-snackbar");
      this.searchButtonLoading = false;
      return;
    }

    const searchPersonNameFormated = this.searchApplicationName.replace(/[^a-zA-Z0-9 ]/g, '');

    this.personsDispatcherService.getPersonsByName(searchPersonNameFormated).subscribe(
      persons => {
        this.dataSourceSearchPerson = new MatTableDataSource(persons);
        this.dataSourceSearchPerson.paginator = this.paginatorPerson;
        this.dataSourceSearchPerson.sort = this.sort;
        this.isTableApplicationVisible = false;
        this.searchButtonLoading = false;
      },
      error => {
        console.log(error);
        this.errorHandler.handleError(error);
        this.searchButtonLoading = false;
      });
  }

  public formateProfilePicExhibition(profilePic: string) {
    if (profilePic == undefined || profilePic == null || profilePic == "") {
      return `${this.imagePathUrlDefault}`;
    } else {
      return `${this.imagePathUrl}${profilePic}`;
    }
  }

  public getPersonAge(commemorativeDate: Date) {
    const bdate = new Date(commemorativeDate);
    const timeDiff = Math.abs(Date.now() - bdate.getTime());
    return Math.floor((timeDiff / (1000 * 3600 * 24)) / 365);
  }

  public formatTdColor(gender: string) {
    if (gender == "F") {
      return "#f8e3fa";
    } else if (gender == "M") {
      return "#cfe2f7";
    } else {
      return "#efefef";
    }
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

  public formatHour(time: string) {
    const timeArray = time.split(":");
    return `${timeArray[0]}:${timeArray[1]}`
  }

  public formatDateExhibition(startDate: Date, startTime: string) {
    return `${this.formatDate(new Date(startDate))} às ${this.formatHour(startTime)}`;
  }

  openAplicationDialog(authorizationId: string) {
    const dialogRef = this.dialog.open(AplicationDialog, {
      disableClose: true,
      width: '60vw',
      data: {
        AuthorizationId: authorizationId
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == undefined || result == null) {

      }else{
        this.dataSourceApplication = new MatTableDataSource(result);
        this.getApplicationHistory(this.personId);
      }
    });
  }

  openBatchDialog(productSummaryBatchId: string) {
    const bottomSheetRef = this._bottomSheet.open(BatchBottomSheet, {
      data: {
        ProductSummaryBatchId: productSummaryBatchId
      }
    });

    bottomSheetRef.afterDismissed().subscribe(
      (res) => {
        if (res != "") {

        }
      });
  }

  public getPersonApplicationInfoByAuth(authId: string, personId: string) {

    this.cleanPersonInfo();
    this.getPersonInfo(personId);
    this.getPersonPhysicalInfo(personId);
    this.getPersonPrincipalInfo(personId);

    this.applicationsDispatcherService.getPersonApplicationNumber(personId).subscribe(
      applicationNumber => {

        if (applicationNumber > 1) {
          this.numberOfApplications = `${applicationNumber + 1}º Atendimento`;
        } else if (applicationNumber == 0) {
          this.numberOfApplications = `1º Atendimento`
        } else {
          this.numberOfApplications = ``
        }
      },
      error => {
        console.log(error);
        this.errorHandler.handleError(error);
        this.searchButtonLoading = false;
      });

    this.getApplicationHistory(personId);
    this.getApplicationAvailable(personId);

    this.isApplicationTabDisabled = false;
    this.tabGroup2.selectedIndex = 0;
  }

  public getPersonApplicationInfoByPerson(personId: string) {

    this.cleanPersonInfo();
    this.getPersonInfo(personId);
    this.getPersonPhysicalInfo(personId);
    this.getPersonPrincipalInfo(personId);

    this.applicationsDispatcherService.getPersonApplicationNumber(personId).subscribe(
      applicationNumber => {

        if (applicationNumber == 1) {
          this.numberOfApplications = `1 Atendimento`;
        } else if (applicationNumber == 0) {
          this.numberOfApplications = `Nenhum`
        } else if (applicationNumber > 1) {
          this.numberOfApplications = `${applicationNumber} Atendimentos`
        } else {
          this.numberOfApplications = ``
        }
      },
      error => {
        console.log(error);
        this.errorHandler.handleError(error);
        this.searchButtonLoading = false;
      });

    this.getApplicationHistory(personId);
    this.getApplicationAvailable(personId);

    this.isApplicationTabDisabled = false;
    this.tabGroup2.selectedIndex = 0;

  }

  public getApplicationAvailable(personId: string) {
    this.applicationsDispatcherService.getAvailableApplicationsByPersonId(personId).subscribe(
      applications => {
        console.log(applications)
        this.dataSourceApplication = new MatTableDataSource(applications);
      },
      error => {
        console.log(error);
        this.errorHandler.handleError(error);
        this.searchButtonLoading = false;
      });
  }

  public personId!: string;

  public getApplicationHistory(personId: string) {

    this.personId = personId;

    this.applicationsDispatcherService.getHistoryApplicationsByPersonId(personId).subscribe(
      applicationsHistory => {
        this.applicationsHistory = applicationsHistory;
      },
      error => {
        console.log(error);
        this.errorHandler.handleError(error);
        this.searchButtonLoading = false;
      });
  }

  public getPersonInfo(personId: string) {

    this.personsDispatcherService.getPersonById(personId).subscribe(
      person => {
        this.personName = person.Name;
        this.personProfilePic = this.formateProfilePicExhibition(person.ProfilePic);
        this.personAge = `${this.getPersonAge(person.CommemorativeDate)} anos`;
      },
      error => {
        console.log(error);
        this.errorHandler.handleError(error);
        this.searchButtonLoading = false;
      });

  }

  public getPersonPhysicalInfo(personId: string) {

    this.personsPhysicalDispatcherService.GetPersonPhysicalByPersonId(personId).subscribe(
      personPhysical => {
      },
      error => {
        console.log(error);
        this.errorHandler.handleError(error);
        this.searchButtonLoading = false;
      });

  }

  public getPersonPrincipalInfo(personId: string) {

    this.personsPhoneDispatcherService.getPrincipalPersonPhoneByPersonId(personId).subscribe(
      personPrincipalPhone => {
        if (personPrincipalPhone != null) {
          this.personPrincipalPhone = `(${personPrincipalPhone.CodeArea})${personPrincipalPhone.NumberPhone}`;
        }
      },
      error => {
        console.log(error);
        this.errorHandler.handleError(error);
        this.searchButtonLoading = false;
      });

    this.personsAddressDispatcherService.getPrincipalPersonAddressByPersonId(personId).subscribe(
      personPrincipalAddress => {
        if (personPrincipalAddress != null) {
          this.personPrincipalAddress = `${personPrincipalAddress.PublicPlace}, ${personPrincipalAddress.AddressNumber} - ${personPrincipalAddress.District} - ${personPrincipalAddress.City}/${personPrincipalAddress.State}`;
        } else {
          this.personPrincipalAddress = `Não Informado`;
        }
      },
      error => {
        console.log(error);
        this.errorHandler.handleError(error);
        this.searchButtonLoading = false;
      });
  }

  public cleanPersonInfo() {
    this.personAge = "";
    this.personName = "";
    this.personPrincipalAddress = "";
    this.personPrincipalPhone = "";
    this.personProfilePic = `${this.imagePathUrlDefault}`;
  }

  formatDoseType(doseType: string) {
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

  formatTypeOfService(typeOfService: string) {
    if (typeOfService == "C") {
      return "NA CLÍNICA"
    } else if (typeOfService == "D") {
      return "A DOMICÍLIO"
    } else {
      return ""
    }
  }

  formatApplicationPlace(applicationPlace: string) {

    if (applicationPlace == '00') {
      return 'Músculo deltóide no terço proximal';
    } else if (applicationPlace == '01') {
      return 'Face superior externa do braço';
    } else if (applicationPlace == '02') {
      return 'Face anterior da coxa';
    } else if (applicationPlace == '03') {
      return 'Face anterior do antebraço';
    } else if (applicationPlace == '04') {
      return 'Dorso glúteo/Músculo grande glúteo';
    } else if (applicationPlace == '05') {
      return 'Veias das extremidades/periféricas'
    } else {
      return ''
    }
  }

  formatRouteOfAdministration(routeOfAdministration: string) {
    if (routeOfAdministration == 'O') {
      return 'Oral';
    } else if (routeOfAdministration == 'I') {
      return 'Intradérmica';
    } else if (routeOfAdministration == 'S') {
      return 'Subcutânea';
    } else if (routeOfAdministration == 'D') {
      return 'Intramuscular';
    } else {
      return '';
    }
  }

  public formatDayTimelineDate(applicationDate: any) {
    let dateFormated = this.formatDate(new Date(applicationDate));
    let arrayDate = dateFormated.split("/");
    return arrayDate[0];
  }

  public formatYearTimelineDate(applicationDate: any) {
    let dateFormated = this.formatDate(new Date(applicationDate));
    let arrayDate = dateFormated.split("/");
    return arrayDate[2].substring(2, 4);
  }

  public formatMonthTimelineDate(applicationDate: any) {
    const mapaMes = {
      "01": "JAN",
      "02": "FEV",
      "03": "MAR",
      "04": "ABR",
      "05": "MAI",
      "06": "JUN",
      "07": "JUL",
      "08": "AGO",
      "09": "SET",
      "10": "OUT",
      "11": "NOV",
      "12": "DEZ"
    }
    let dateFormated = this.formatDate(new Date(applicationDate));
    let arrayDate = dateFormated.split("/");
    return this.getFullNameMonthTimelineDate(arrayDate[1]);
  }

  public getFullNameMonthTimelineDate(month: string) {

    let monthFormated = "";

    switch (month) {
      case '01': {
        monthFormated = 'JAN'
        break;
      }
      case '02': {
        monthFormated = 'FEV'
        break;
      }
      case '03': {
        monthFormated = 'MAR'
        break;
      }
      case '04': {
        monthFormated = 'ABR'
        break;
      }
      case '05': {
        monthFormated = 'MAI'
        break;
      }
      case '06': {
        monthFormated = 'JUN'
        break;
      }
      case '07': {
        monthFormated = 'JUL'
        break;
      }
      case '08': {
        monthFormated = 'AGO'
        break;
      }
      case '09': {
        monthFormated = 'SET'
        break;
      }
      case '10': {
        monthFormated = 'OUT'
        break;
      }
      case '11': {
        monthFormated = 'NOV'
        break;
      }
      case '12': {
        monthFormated = 'DEZ'
        break;
      }
      default: {
        monthFormated = ''
        break;
      }
    }
    return monthFormated;
  }

  public positionTooltip(indexOfelement: number) {
    if (indexOfelement % 2 == 0) {
      return 'right'
    } else {
      return 'left'
    }
  }

}

@Component({
  selector: 'aplication-dialog',
  templateUrl: 'aplication-dialog.html',
})
export class AplicationDialog implements OnInit {

  public authorizationId!: string;
  public productName!: string;
  public doseType!: string;
  public applicationPlace!: string;
  public routeOfAdministration!: string;
  public applicationDate!: Date;
  public productId!: string;
  public productSummaryBatchId!: string;
  public budgetProductId!: string;

  public today = new Date();
  public batchSelected = 'Selecionar Lote'

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<AplicationDialog>,
    private messageHandler: MessageHandlerService,
    private errorHandler: ErrorHandlerService,
    private authorizationDispatcherService: AuthorizationsDispatcherService,
    private productSummaryBatchDispatcherService: ProductsSummariesBatchesDispatcherService,
    private applicationDispatcherService: ApplicationsDispatcherService,
    private _bottomSheet: MatBottomSheet
  ) { }

  ngOnInit(): void {
    this.authorizationId = this.data.AuthorizationId;
    this.getAuthorization();
  }

  //Form
  applicationForm: FormGroup = this.formBuilder.group({
    productName: [null, [Validators.required]],
    doseType: [null, [Validators.required]],
    applicationPlace: [null, [Validators.required]],
    routeOfAdministration: [null, [Validators.required]],
    applicationDate: [null, [Validators.required]]
  });

  public getAuthorization() {
    this.authorizationDispatcherService.getAuthorizationById(this.authorizationId).subscribe(
      authorization => {
        console.log(authorization)
        this.productName = authorization.BudgetProduct.Product.Name;
        this.doseType = authorization.BudgetProduct.ProductDose;
        this.applicationDate = new Date();
        this.productId = authorization.BudgetProduct.Product.ID;
        this.budgetProductId = authorization.BudgetProduct.ID;
      },
      error => {
        console.log(error);
        this.errorHandler.handleError(error);
      });
  }

  public openSelectBatchBottomSheet() {
    const bottomSheetRef = this._bottomSheet.open(SelectBatchBottomSheet, {
      data: {
        ProductId: this.productId
      }
    });

    bottomSheetRef.afterDismissed().subscribe(
      (res) => {
        if (res == undefined || res == null || res == "") {

        } else {
          this.productSummaryBatchDispatcherService.getProductsSummariesBatchesById(res).subscribe(
            productSummaryBatch => {
              this.batchSelected = `${productSummaryBatch.Batch} (${productSummaryBatch.Manufacturer}) - Validade ${this.formatDate(new Date(productSummaryBatch.ValidityBatchDate))}`
              this.productSummaryBatchId = productSummaryBatch.ID;
            },
            error => {
              console.log(error);
              this.errorHandler.handleError(error);
            });
        }
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

  public saveApplication() {

    if (!this.applicationForm.valid) {
      console.log(this.applicationForm);
      this.applicationForm.markAllAsTouched();
      this.messageHandler.showMessage("Campos obrigatórios não preenchidos, verifique!", "warning-snackbar");
      return;
    }

    if (this.productSummaryBatchId == null) {
      this.messageHandler.showMessage("É necessário selecionar um Lote!", "warning-snackbar");
      return;
    }

    let application = new ApplicationModel();
    application.ApplicationDate = this.applicationDate;
    application.ApplicationPlace = this.applicationPlace;
    application.AuthorizationId = this.authorizationId;
    application.DoseType = this.doseType;
    application.ProductSummaryBatchId = this.productSummaryBatchId;
    application.RouteOfAdministration = this.routeOfAdministration;
    application.UserId = localStorage.getItem('userId')!;
    application.BudgetProductId = this.budgetProductId;

    this.applicationDispatcherService.createApplication(application).subscribe(
      response => {
        this.dialogRef.close(response);
        this.messageHandler.showMessage("Aplicação realizada com sucesso!", "success-snackbar")
      },
      error => {
        console.log(error);
        this.errorHandler.handleError(error);
      });
  }

}


@Component({
  selector: 'batch-bottom-sheet',
  templateUrl: 'batch-bottom-sheet.html',
})
export class BatchBottomSheet implements OnInit {

  public productSummaryBatchId!: string;
  public Batch!: string;
  public Manufacturer!: string;
  public NumberOfUnitsBatch!: string;
  public ManufacturingDate!: string;
  public ValidityBatchDate!: string;
  public ProductName!: string;

  constructor(
    private _bottomSheetRef: MatBottomSheetRef<BatchBottomSheet>,
    private productsSummariesBatchesDispatcherService: ProductsSummariesBatchesDispatcherService,
    private errorHandler: ErrorHandlerService,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    this.productSummaryBatchId = this.data.ProductSummaryBatchId;
    this.getProductSummaryBatch();
  }

  public getProductSummaryBatch() {
    this.productsSummariesBatchesDispatcherService.getProductsSummariesBatchesById(this.productSummaryBatchId).subscribe(
      productSummaryBatch => {
        console.log(productSummaryBatch);
        this.Batch = productSummaryBatch.Batch;
        this.Manufacturer = productSummaryBatch.Manufacturer;
        this.ManufacturingDate = productSummaryBatch.ManufacturingDate;
        this.ValidityBatchDate = productSummaryBatch.ValidityBatchDate;
        this.NumberOfUnitsBatch = productSummaryBatch.NumberOfUnitsBatch;
        this.ProductName = productSummaryBatch.Products.Name;
      },
      error => {
        console.log(error);
        this.errorHandler.handleError(error);
      });
  }

}

@Component({
  selector: 'select-batch-bottom-sheet',
  templateUrl: 'select-batch-bottom-sheet.html',
})
export class SelectBatchBottomSheet implements OnInit {

  public productId!: string;
  public productsSummariesBatches!: any;

  constructor(
    private _bottomSheetRef: MatBottomSheetRef<SelectBatchBottomSheet>,
    private productsSummariesBatchesDispatcherService: ProductsSummariesBatchesDispatcherService,
    private errorHandler: ErrorHandlerService,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    this.productId = this.data.ProductId;
    this.getProductsSummariesBatches();
  }

  public getProductsSummariesBatches() {
    this.productsSummariesBatchesDispatcherService.getValidProductsSummariesBatchesByProductId(this.productId).subscribe(
      productsSummariesBatches => {
        this.productsSummariesBatches = productsSummariesBatches;
      },
      error => {
        console.log(error);
        this.errorHandler.handleError(error);
      });
  }

  openLink(event: MouseEvent, produdctSummaryBatchId: string): void {
    this._bottomSheetRef.dismiss(produdctSummaryBatchId);
    event.preventDefault();
  }

}
