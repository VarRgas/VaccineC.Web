import { SelectionModel } from '@angular/cdk/collections';
import { BreakpointObserver } from '@angular/cdk/layout';
import { StepperOrientation } from '@angular/cdk/stepper';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatStepper } from '@angular/material/stepper';
import { MatTableDataSource } from '@angular/material/table';
import { debounceTime, distinctUntilChanged, map, startWith, switchMap } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { IBudget } from 'src/app/interfaces/i-budget';
import { IBudgetHistoric } from 'src/app/interfaces/i-budget-historic';
import { IBudgetNegotiation } from 'src/app/interfaces/i-budget-negotiation';
import { IBudgetProduct } from 'src/app/interfaces/i-budget-product';
import { IProductDoses } from 'src/app/interfaces/i-product-doses';
import { BudgetModel } from 'src/app/models/budget-model';
import { BudgetNegotiationModel } from 'src/app/models/budget-negotiation-model';
import { BudgetProductModel } from 'src/app/models/budget-product-model';
import { BudgetsDispatcherService } from 'src/app/services/budgets-dispatcher.service';
import { BudgetsHistoricsDispatcherService } from 'src/app/services/budgets-historics-dispatcher.service';
import { BudgetsNegotiationsDispatcherService } from 'src/app/services/budgets-negotiations-dispatcher.service';
import { BudgetsProductsDispatcherService } from 'src/app/services/budgets-products-dispatcher.service';
import { CompaniesParametersDispatcherService } from 'src/app/services/company-parameter-dispatcher.service';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { MessageHandlerService } from 'src/app/services/message-handler.service';
import { PaymentFormsDispatcherService } from 'src/app/services/payment-forms-dispatcher.service';
import { PersonAutocompleteService } from 'src/app/services/person-autocomplete.service';
import { ProductsDispatcherService } from 'src/app/services/products-dispatcher.service';
import { ProductsDosesDispatcherService } from 'src/app/services/products-doses-dispatcher.service';
import { UsersService } from 'src/app/services/user-dispatcher.service';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { EditPersonDialog } from 'src/app/shared/edit-person-modal/edit-person-dialog';

@Component({
  selector: 'app-orcamentos',
  templateUrl: './orcamentos.component.html',
  styleUrls: ['./orcamentos.component.scss'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: { displayDefaultIndicatorType: false }
  }]
})
export class OrcamentosComponent implements OnInit {

  @ViewChild('stepper') stepper!: MatStepper;

  //Controle de exibição dos IDs na Table
  public show: boolean = true;

  //Controle de habilitação de campos
  public isInputDisabled = false;
  public isInputReadOnly = false;
  public isPersonReadOnly = false;
  public isbudgetNegotiationReadonly = false;
  public isbudgetValuesReadonly = false;
  public isBudgetReadonly = false;
  public isButtonApproveVisibile = false;
  public isButtonCancelVisibile = false;
  public isButtonReopenVisibile = false;
  public isBudgetProductDisabled = false;
  public isBudgetProductRepeatDisabled = false;
  public isRemoveBudgetNegotiationHidden = false;
  public isDefinePaymentVisible = true;
  public searchButtonLoading = false;
  public firstStepLoading = false;
  public tabBudgetIsDisabled = true;
  public tabHistoricIsDisabled = true;

  public DefaultCompanyParameter!: any;

  //Variáveis dos inputs
  //BudgetForm
  public budgetId!: string;
  public personId!: string;
  public userId!: string;
  public details!: string;
  public situation!: string;
  public expirationDate!: Date;
  public budgetNumber!: number;

  //BudgetForm2
  public budgetsAmount!: number;
  public discountPercentage!: number;
  public discountValue!: number;
  public discountType: string = 'R$';
  public totalBudgetAmount!: number;
  public totalBudgetedAmount!: number;
  public prefixDiscountType: string = 'R$';

  //BudgetNegotiationForm
  public paymentFormId!: string;
  public installments!: number;
  public totalAmountTraded!: number;
  public totalAmountBalance!: number;

  //Outros
  public situationColor = '';
  public situationTitle = '';
  public situationProductColor = '';
  public situationProductTitle = '';
  public searchPersonName!: string;
  public informationField!: string;
  public balanceNegotiations: number = 0;
  public selectedRow!: boolean;
  public personType!: string;

  //Table Pesquisa
  public displayedBudgetsColumns: string[] = ['BudgetNumber', 'PersonName', 'ExpirationDate', 'Amount', 'Options', 'ID'];
  public dataSourceBudget = new MatTableDataSource<IBudget>();

  //Table Produtos
  public displayedColumnsBudgetProduct: string[] = ['ProductName', 'BorrowerPersonName', 'EstimatedSalesValue', 'ID', 'Options'];
  public dataSourceBudgetProduct = new MatTableDataSource<IBudgetProduct>();
  clickedRows = new Set<IBudgetProduct>();

  //Table Pagamentos
  public displayedColumnsBudgetNegotiation: string[] = ['PaymentFormName', 'Installments', 'TotalAmountTraded', 'ID', 'Options'];
  public dataSourceBudgetNegotiation = new MatTableDataSource<IBudgetNegotiation>();

  //Table Histórico
  public displayedColumnsHistoric: string[] = ['Register', 'User', 'Historic', 'ID'];
  public dataSourceHistoric = new MatTableDataSource<IBudgetHistoric>();

  //Autocomplete Pessoa
  public myControl = new FormControl();
  public options: string[] = [];
  public filteredOptions: Observable<any[]> | undefined;

  //Autocomplete Usuário
  public myUserControl = new FormControl();
  public acUser: string[] = [];
  public acUsers: Observable<any[]> | undefined;

  //Autocomplete Forma de Pagamento
  public myPaymentFormControl = new FormControl();
  public acPaymentForm: string[] = [];
  public acPaymentForms: Observable<any[]> | undefined;

  public budgetForm: FormGroup = this.formBuilder.group({
    PersonId: [null, Validators.required],
    UserId: [null, Validators.required],
    Situation: [null],
    ExpirationDate: [null, Validators.required],
    Details: [null],
  });

  public budgetForm2: FormGroup = this.formBuilder.group({
    TotalBudgetedAmount: [null, Validators.required],
    TotalBudgetAmount: [null, Validators.required],
    DiscountType: [null, Validators.required],
    DiscountValue: [null, Validators.required],
  });

  public budgetNegotiationForm: FormGroup = this.formBuilder.group({
    PaymentFormId: [null, Validators.required],
    Installments: [null, Validators.required],
    TotalAmountTraded: [null, Validators.required]
  });

  @ViewChild('paginatorBudget') paginatorBudget!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private errorHandler: ErrorHandlerService,
    private messageHandler: MessageHandlerService,
    private budgetsDispatcherService: BudgetsDispatcherService,
    private breakpointObserver: BreakpointObserver,
    private personAutocompleteService: PersonAutocompleteService,
    private budgetsProductsDispatcherService: BudgetsProductsDispatcherService,
    private budgetsNegotiationsDispatcherService: BudgetsNegotiationsDispatcherService,
    private paymentFormsDispatcherService: PaymentFormsDispatcherService,
    private budgetsHistoricsDispatcherService: BudgetsHistoricsDispatcherService,
    private companiesParametersDispatcherService: CompaniesParametersDispatcherService,
    private usersService: UsersService) {
    this.stepperOrientation = breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
  }

  ngOnInit(): void {
    this.companiesParametersDispatcherService.getDefaultCompanyParameter().subscribe(
      companyParameter => {
        if (companyParameter != null) {
          this.DefaultCompanyParameter = companyParameter;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  public budgetProductRowSelected!: any;

  onRowClicked(row: any) {

    if (!this.selectedRow) {
      this.selectedRow = row;
    }
    else {
      this.selectedRow = row;
    }
    this.budgetProductRowSelected = row;
  }

  treatBudgetSituation(situation: string) {

    if (situation == "P" || situation == null || situation == undefined) {
      this.isBudgetReadonly = false;
      this.isbudgetNegotiationReadonly = true;
      this.isBudgetProductDisabled = false;
      this.isbudgetValuesReadonly = false;
      this.isButtonApproveVisibile = false;
      this.isButtonCancelVisibile = false;
      this.isButtonReopenVisibile = false;
      this.isRemoveBudgetNegotiationHidden = true;
      this.isDefinePaymentVisible = true;

      if (this.dataSourceBudgetProduct.data.length > 0) {
        this.isBudgetProductRepeatDisabled = false;
      } else {
        this.isBudgetProductRepeatDisabled = true;
      }

    } else if (situation == "E") {
      this.isBudgetReadonly = true;
      this.isbudgetNegotiationReadonly = false;
      this.isbudgetValuesReadonly = true;
      this.isBudgetProductDisabled = true;
      this.isBudgetProductRepeatDisabled = true;
      this.isButtonApproveVisibile = true;
      this.isButtonCancelVisibile = true;
      this.isButtonReopenVisibile = true;
      this.isRemoveBudgetNegotiationHidden = false;
      this.isDefinePaymentVisible = false;
    } else if (situation == "A") {
      this.isBudgetReadonly = true;
      this.isbudgetNegotiationReadonly = true;
      this.isBudgetProductDisabled = true;
      this.isBudgetProductRepeatDisabled = true;
      this.isbudgetValuesReadonly = true;
      this.isButtonApproveVisibile = false;
      this.isButtonCancelVisibile = true;
      this.isButtonReopenVisibile = true;
      this.isRemoveBudgetNegotiationHidden = true;
      this.isDefinePaymentVisible = false;
    } else if (situation == "X") {
      this.isBudgetReadonly = true;
      this.isbudgetNegotiationReadonly = true;
      this.isBudgetProductDisabled = true;
      this.isBudgetProductRepeatDisabled = true;
      this.isbudgetValuesReadonly = true;
      this.isButtonApproveVisibile = false;
      this.isButtonCancelVisibile = false;
      this.isButtonReopenVisibile = true;
      this.isRemoveBudgetNegotiationHidden = true;
      this.isDefinePaymentVisible = false;
    } else if (situation == "F") {
      this.isBudgetReadonly = true;
      this.isbudgetNegotiationReadonly = true;
      this.isBudgetProductDisabled = true;
      this.isBudgetProductRepeatDisabled = true;
      this.isbudgetValuesReadonly = true;
      this.isButtonApproveVisibile = false;
      this.isButtonCancelVisibile = false;
      this.isButtonReopenVisibile = false;
      this.isRemoveBudgetNegotiationHidden = true;
      this.isDefinePaymentVisible = false;
    }

  }

  calculateBudgetAmount(): void {

    if (this.discountType == "R$") {
      this.totalBudgetAmount = Number(this.totalBudgetedAmount) - Number(this.discountValue);
    } else {
      let percentDecimal = Number(this.discountValue) / 100;
      let discountValue = percentDecimal * this.totalBudgetedAmount;
      this.totalBudgetAmount = this.totalBudgetedAmount - discountValue;
    }
  }

  discountTypeChanged(): void {

    if (this.discountType == null || this.discountType == undefined || this.discountType == "R$") {
      this.prefixDiscountType = "R$"
    } else {
      this.prefixDiscountType = "%"
    }

    this.calculateBudgetAmount();
  }

  public getTotalProductAmount() {
    return this.dataSourceBudgetProduct.data.map(t => t.EstimatedSalesValue).reduce((acc, value) => acc + value, 0);
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

  public goToBudgetProductStep(stepper: MatStepper) {

    if (this.budgetId == "" || this.budgetId == null || this.budgetId == undefined) {
      this.createBudget(stepper);
    } else {
      this.updateBudget(stepper);
    }
  }

  public goToBudgetValuesStep(stepper: MatStepper) {

    this.totalBudgetedAmount = this.dataSourceBudgetProduct.data.map(t => t.EstimatedSalesValue).reduce((acc, value) => acc + value, 0);

    if (this.dataSourceBudgetProduct.data.length == 0) {
      this.messageHandler.showMessage("Para avançar é necessário inserir Produtos ao Orçamento!", "warning-snackbar")
      return;
    }

    let count = 0;

    if (this.personType == 'F') {
      this.dataSourceBudgetProduct.data.forEach((budgetProduct: any) => {
        if (budgetProduct.BorrowerPersonId == '' || budgetProduct.BorrowerPersonId == null) {
          count++;
        }
      });
    }

    if (count > 0) {
      this.messageHandler.showMessage("Para avançar é necessário informar os Tomadores para os Produtos!", "warning-snackbar")
      return;
    }

    this.discountTypeChanged();
    stepper.next();
  }

  public showSituationFormated(situation: string): string {
    if (situation == "A") {
      return "Aprovado";
    } else if (situation == "P") {
      return "Pendente";
    } else if (situation == "X") {
      return "Cancelado";
    } else if (situation == "V") {
      return "Vencido";
    } else if (situation == "F") {
      return "Finalizado";
    } else {
      return "Em Negociação";
    }
  }

  public goToBudgetNegotiationStep(stepper: MatStepper) {

    if (this.situation == "P") {

      if (!this.budgetForm2.valid) {
        console.log(this.budgetForm);
        //this.createButtonLoading = false;
        this.budgetForm2.markAllAsTouched();
        this.messageHandler.showMessage("Campos obrigatórios não preenchidos, verifique!", "warning-snackbar");
        return;
      }

      if (this.totalBudgetAmount == 0 || this.totalBudgetAmount == null || this.totalBudgetAmount == undefined) {
        this.messageHandler.showMessage("Para prosseguir, o R$ Total Orçamento não pode estar zerado!", "warning-snackbar")
        return;
      }

      if (this.totalBudgetedAmount == 0 || this.totalBudgetedAmount == null || this.totalBudgetedAmount == undefined) {
        this.messageHandler.showMessage("Para prosseguir, o R$ Produtos Orçados não pode estar zerado!", "warning-snackbar")
        return;
      }

      let budget = new BudgetModel();
      budget.id = this.budgetId;
      budget.personId = this.budgetForm.value.PersonId.ID;
      budget.userId = localStorage.getItem('userId')!;
      budget.totalBudgetAmount = this.totalBudgetAmount;
      budget.discountPercentage = this.discountPercentage;
      budget.discountValue = this.discountValue;
      budget.expirationDate = this.expirationDate;
      budget.details = this.details;
      budget.totalBudgetedAmount = this.totalBudgetedAmount;

      if (this.situation == "P") {
        budget.situation = "E";
      } else {
        budget.situation = this.situation;
      }

      if (this.discountType == "R$") {
        budget.discountPercentage = 0;
        budget.discountValue = this.discountValue;
      } else {
        budget.discountPercentage = this.discountValue;
        budget.discountValue = 0;
      }

      this.budgetsDispatcherService.updateBudget(budget.id, budget)
        .subscribe(
          response => {
            console.log(response)
            this.budgetId = response.ID;
            this.userId = response.Users;
            this.personId = response.Persons;
            this.situation = response.Situation;
            this.totalBudgetAmount = response.TotalBudgetAmount;
            this.discountPercentage = response.DiscountPercentage;
            this.discountValue = response.DiscountValue;
            this.expirationDate = response.ExpirationDate;
            this.details = response.Details;
            this.budgetNumber = response.BudgetNumber;
            this.totalBudgetedAmount = response.TotalBudgetedAmount;

            this.informationField = `Orçamento nº ${response.BudgetNumber} - ${response.Persons.Name} - ${this.showSituationFormated(response.Situation)}`;

            this.isPersonReadOnly = true;

            this.loadData();
            this.treatBudgetSituation(response.Situation);
            if (this.DefaultCompanyParameter != null && this.DefaultCompanyParameter.PaymentForm != null) {
              this.paymentFormId = this.DefaultCompanyParameter.PaymentForm;
            }
            stepper.next();
          },
          error => {
            console.log(error);
            this.errorHandler.handleError(error);
          });

    } else if (this.situation == "E") {
      this.paymentFormId = this.DefaultCompanyParameter.PaymentForm;
      stepper.next();
    }
    else {
      stepper.next();
    }

    let totalAmountTradedNegotiations = this.dataSourceBudgetNegotiation.data.map(t => t.TotalAmountTraded).reduce((acc, value) => acc + value, 0);
    this.balanceNegotiations = this.totalBudgetAmount - totalAmountTradedNegotiations;

    this.treatBalanceNegotiation();
  }

  public createBudget(stepper: MatStepper): void {

    this.firstStepLoading = true;

    if (!this.budgetForm.valid) {
      console.log(this.budgetForm);
      this.firstStepLoading = false;
      this.budgetForm.markAllAsTouched();
      this.messageHandler.showMessage("Campos obrigatórios não preenchidos, verifique!", "warning-snackbar");
      return;
    }

    let budget = new BudgetModel();
    budget.personId = this.budgetForm.value.PersonId.ID;
    budget.userId = localStorage.getItem('userId')!;
    budget.situation = "P";
    budget.totalBudgetAmount = 0;
    budget.discountPercentage = 0;
    budget.discountValue = 0;
    budget.expirationDate = this.expirationDate;
    budget.details = this.details;
    budget.totalBudgetedAmount = 0;

    this.budgetsDispatcherService.createBudget(budget)
      .subscribe(
        response => {
          console.log(response)
          this.personType = response.Persons.PersonType;
          this.budgetId = response.ID;
          this.userId = response.Users;
          this.personId = response.Persons;
          this.situation = response.Situation;
          this.totalBudgetAmount = response.TotalBudgetAmount;
          this.discountPercentage = response.DiscountPercentage;
          this.discountValue = response.DiscountValue;
          this.expirationDate = response.ExpirationDate;
          this.details = response.Details;
          this.budgetNumber = response.BudgetNumber;
          this.totalBudgetedAmount = response.TotalBudgetedAmount;

          this.informationField = `Orçamento nº ${response.BudgetNumber} - ${response.Persons.Name} - ${this.showSituationFormated(response.Situation)}`;

          this.isPersonReadOnly = true;
          this.firstStepLoading = false;
          this.tabHistoricIsDisabled = false;

          this.loadData();
          this.treatBudgetSituation(response.Situation);
          this.getBudgetHistorics();
          stepper.next();
          this.messageHandler.showMessage("Orçamento criado com sucesso!", "success-snackbar")
        },
        error => {
          console.log(error);
          this.errorHandler.handleError(error);
          this.firstStepLoading = false;
        });

  }

  public updateBudget(stepper: MatStepper): void {

    this.firstStepLoading = true;

    if (!this.budgetForm.valid) {
      console.log(this.budgetForm);
      this.firstStepLoading = false;
      this.budgetForm.markAllAsTouched();
      this.messageHandler.showMessage("Campos obrigatórios não preenchidos, verifique!", "warning-snackbar");
      return;
    }

    let budget = new BudgetModel();
    budget.id = this.budgetId;
    budget.personId = this.budgetForm.value.PersonId.ID;
    budget.userId = localStorage.getItem('userId')!;
    budget.situation = this.situation;
    budget.totalBudgetAmount = this.totalBudgetAmount;
    budget.expirationDate = this.expirationDate;
    budget.details = this.details;
    budget.totalBudgetedAmount = this.totalBudgetedAmount;

    if (this.discountType == "R$") {
      budget.discountPercentage = 0;
      budget.discountValue = this.discountValue;
    } else {
      budget.discountPercentage = this.discountValue;
      budget.discountValue = 0;
    }

    this.budgetsDispatcherService.updateBudget(budget.id, budget)
      .subscribe(
        response => {

          this.personType = response.Persons.PersonType;
          this.budgetId = response.ID;
          this.userId = response.Users;
          this.personId = response.Persons;
          this.situation = response.Situation;
          this.totalBudgetAmount = response.TotalBudgetAmount;
          this.discountPercentage = response.DiscountPercentage;
          this.discountValue = response.DiscountValue;
          this.expirationDate = response.ExpirationDate;
          this.details = response.Details;
          this.budgetNumber = response.BudgetNumber;
          this.totalBudgetedAmount = response.TotalBudgetedAmount;

          if (this.discountPercentage != 0) {
            this.discountType = "%"
            this.prefixDiscountType = "%"
            this.discountValue = response.DiscountPercentage;
          } else {
            this.discountType = "R$"
            this.prefixDiscountType = "R$"
            this.discountValue = response.DiscountValue;
          }

          this.informationField = `Orçamento nº ${response.BudgetNumber} - ${response.Persons.Name} - ${this.showSituationFormated(response.Situation)}`;

          this.firstStepLoading = false;
          this.isPersonReadOnly = true;

          this.loadData();
          this.treatBudgetSituation(response.Situation);
          this.getBudgetHistorics();
          stepper.next();
        },
        error => {
          console.log(error);
          this.errorHandler.handleError(error);
          this.firstStepLoading = false;
        });
  }

  public approveBudget(): void {

    if (this.dataSourceBudgetNegotiation.data.length == 0 || this.balanceNegotiations > 0) {
      this.messageHandler.showMessage("Para avançar é necessário finalizar a negociação de valores!", "warning-snackbar")
      return;
    }

    let budget = new BudgetModel();
    budget.id = this.budgetId;
    budget.personId = this.budgetForm.value.PersonId.ID;
    budget.userId = localStorage.getItem('userId')!;
    budget.situation = "A";
    budget.totalBudgetAmount = this.totalBudgetAmount;
    budget.expirationDate = this.expirationDate;
    budget.details = this.details;
    budget.totalBudgetedAmount = this.totalBudgetedAmount;
    budget.discountPercentage = this.discountPercentage;
    budget.discountValue = this.discountValue;

    this.budgetsDispatcherService.updateBudget(budget.id, budget)
      .subscribe(
        response => {

          console.log(response)

          this.budgetId = response.ID;
          this.userId = response.Users;
          this.personId = response.Persons;
          this.situation = response.Situation;
          this.totalBudgetAmount = response.TotalBudgetAmount;
          this.discountPercentage = response.DiscountPercentage;
          this.discountValue = response.DiscountValue;
          this.expirationDate = response.ExpirationDate;
          this.details = response.Details;
          this.budgetNumber = response.BudgetNumber;
          this.totalBudgetedAmount = response.TotalBudgetedAmount;

          this.informationField = `Orçamento nº ${response.BudgetNumber} - ${response.Persons.Name} - ${this.showSituationFormated(response.Situation)}`;

          if (this.discountPercentage != 0) {
            this.discountType = "%"
            this.prefixDiscountType = "%"
            this.discountValue = response.DiscountPercentage;
          } else {
            this.discountType = "R$"
            this.prefixDiscountType = "R$"
            this.discountValue = response.DiscountValue;
          }

          this.loadData();
          this.treatBudgetSituation(response.Situation)
          this.discountTypeChanged();
          this.stepper.selectedIndex = 0;
          this.messageHandler.showMessage("Orçamento aprovado com sucesso!", "success-snackbar")
        },
        error => {
          console.log(error);
          this.errorHandler.handleError(error);
        });
  }

  public cancelBudget(): void {

    const dialogRef = this.dialog.open(ConfirmBudgetCancelationDialog);

    dialogRef.afterClosed()
      .subscribe(result => {
        if (!!result) {
          let budget = new BudgetModel();
          budget.id = this.budgetId;
          budget.personId = this.budgetForm.value.PersonId.ID;
          budget.userId = localStorage.getItem('userId')!;
          budget.situation = "X";
          budget.totalBudgetAmount = this.totalBudgetAmount;
          budget.expirationDate = this.expirationDate;
          budget.details = this.details;
          budget.totalBudgetedAmount = this.totalBudgetedAmount;
          budget.discountPercentage = this.discountPercentage;
          budget.discountValue = this.discountValue;

          this.budgetsDispatcherService.updateBudget(budget.id, budget)
            .subscribe(
              response => {
                console.log(response)

                this.budgetId = response.ID;
                this.userId = response.Users;
                this.personId = response.Persons;
                this.situation = response.Situation;
                this.totalBudgetAmount = response.TotalBudgetAmount;
                this.discountPercentage = response.DiscountPercentage;
                this.discountValue = response.DiscountValue;
                this.expirationDate = response.ExpirationDate;
                this.details = response.Details;
                this.budgetNumber = response.BudgetNumber;
                this.totalBudgetedAmount = response.TotalBudgetedAmount;

                this.informationField = `Orçamento nº ${response.BudgetNumber} - ${response.Persons.Name} - ${this.showSituationFormated(response.Situation)}`;

                if (this.discountPercentage != 0) {
                  this.discountType = "%"
                  this.prefixDiscountType = "%"
                  this.discountValue = response.DiscountPercentage;
                } else {
                  this.discountType = "R$"
                  this.prefixDiscountType = "R$"
                  this.discountValue = response.DiscountValue;
                }

                this.loadData();
                this.treatBudgetSituation(response.Situation)
                this.stepper.selectedIndex = 0;
                this.messageHandler.showMessage("Orçamento cancelado com sucesso!", "success-snackbar")
              },
              error => {
                console.log(error);
                this.errorHandler.handleError(error);
              });
        }
      });
  }

  public reopenBudget(): void {

    if (this.removeNegotiations()) {
      let budget = new BudgetModel();
      budget.id = this.budgetId;
      budget.personId = this.budgetForm.value.PersonId.ID;
      budget.userId = localStorage.getItem('userId')!;
      budget.situation = "P";
      budget.totalBudgetAmount = this.totalBudgetAmount;
      budget.expirationDate = this.expirationDate;
      budget.details = this.details;
      budget.totalBudgetedAmount = this.totalBudgetedAmount;
      budget.discountPercentage = this.discountPercentage;
      budget.discountValue = this.discountValue;

      this.budgetsDispatcherService.updateBudget(budget.id, budget)
        .subscribe(
          response => {

            this.budgetId = response.ID;
            this.userId = response.Users;
            this.personId = response.Persons;
            this.situation = response.Situation;
            this.totalBudgetAmount = response.TotalBudgetAmount;
            this.discountPercentage = response.DiscountPercentage;
            this.discountValue = response.DiscountValue;
            this.expirationDate = response.ExpirationDate;
            this.details = response.Details;
            this.budgetNumber = response.BudgetNumber;
            this.totalBudgetedAmount = response.TotalBudgetedAmount;

            this.informationField = `Orçamento nº ${response.BudgetNumber} - ${response.Persons.Name} - ${this.showSituationFormated(response.Situation)}`;

            if (this.discountPercentage != 0) {
              this.discountType = "%"
              this.prefixDiscountType = "%"
              this.discountValue = response.DiscountPercentage;
            } else {
              this.discountType = "R$"
              this.prefixDiscountType = "R$"
              this.discountValue = response.DiscountValue;
            }

            this.loadData();
            this.treatBudgetSituation(response.Situation);
            this.stepper.selectedIndex = 1;
            this.messageHandler.showMessage("Orçamento reaberto com sucesso!", "success-snackbar")
          },
          error => {
            console.log(error);
            this.errorHandler.handleError(error);
          });
    }
  }

  public openRepeatProducDialog() {

    if (this.budgetProductRowSelected == "" || this.budgetProductRowSelected == null || this.budgetProductRowSelected == undefined) {
      this.messageHandler.showMessage("Nenhum produto selecionado!", "warning-snackbar")

    } else {
      const dialogRef = this.dialog.open(RepeatBudgetProductDialog, {
        disableClose: true,
        width: '50vw',
        data: {
          BudgetProduct: this.budgetProductRowSelected,
        },
      });

      dialogRef.afterClosed().subscribe(
        (res) => {
          if (res != "") {
            this.dataSourceBudgetProduct = new MatTableDataSource(res);
            setTimeout(() => {
              this.getBudgetHistorics();
            }, 500);
            this.budgetProductRowSelected = "";

          }
        }
      );
      this.budgetProductRowSelected = "";
    }

  }

  public removeNegotiations(): boolean {

    if (this.dataSourceBudgetNegotiation.data.length > 0) {

      let listBudgetNegotiationModel = new Array<BudgetNegotiationModel>();

      this.dataSourceBudgetNegotiation.data.forEach((productNegotiation: any) => {
        let budgetNegotiationModel = new BudgetNegotiationModel();
        budgetNegotiationModel.id = productNegotiation.ID;
        budgetNegotiationModel.budgetId = productNegotiation.BudgetId;
        budgetNegotiationModel.paymentFormId = productNegotiation.PaymentFormId;
        budgetNegotiationModel.totalAmountBalance = productNegotiation.TotalAmountBalance;
        budgetNegotiationModel.totalAmountTraded = productNegotiation.TotalAmountTraded;
        budgetNegotiationModel.installments = productNegotiation.Installments;

        listBudgetNegotiationModel.push(budgetNegotiationModel);
      })

      this.budgetsNegotiationsDispatcherService.deleteBudgetNegotiationOnDemand(listBudgetNegotiationModel, localStorage.getItem('userId')!).subscribe(
        response => {
          this.dataSourceBudgetNegotiation = new MatTableDataSource(response);
          setTimeout(() => {
            this.getBudgetHistorics();
          }, 500);
          return true;

        }, error => {
          console.log(error);
          this.errorHandler.handleError(error);
          return false;

        });
    }
    return true;
  }

  public loadData(): void {

    if (this.searchPersonName == "" || this.searchPersonName == null || this.searchPersonName == undefined) {
      this.getAllBudgets();
    } else {
      this.getBudgetsByPersonName();
    }
  }

  public getAllBudgets(): void {

    this.searchButtonLoading = true;

    this.budgetsDispatcherService.getAllBudgets()
      .subscribe(budgets => {
        this.dataSourceBudget = new MatTableDataSource(budgets);
        this.dataSourceBudget.sort = this.sort;
        this.dataSourceBudget.paginator = this.paginatorBudget;

        this.searchButtonLoading = false;
      },
        error => {
          console.log(error);
          this.errorHandler.handleError(error);

          this.searchButtonLoading = false;
        });
  }

  public getBudgetsByPersonName(): void {
    const searchPersonNameFormated = this.searchPersonName.replace(/[^a-zA-Z0-9 ]/g, '');

    this.budgetsDispatcherService.getBudgetsByPersonName(searchPersonNameFormated)
      .subscribe(
        budgets => {
          this.dataSourceBudget = new MatTableDataSource(budgets);
          this.dataSourceBudget.paginator = this.paginatorBudget;
          this.dataSourceBudget.sort = this.sort;
        },
        error => {
          console.log(error);
          this.errorHandler.handleError(error);
        });
  }

  public addNewBudget(): void {

    setTimeout(() => {
      this.resetForms();
      this.resetTables();

      this.tabBudgetIsDisabled = false;
      this.budgetProductRowSelected = "";

      this.usersService.getById(localStorage.getItem('userId')!)
        .subscribe(
          user => {
            this.userId = user;
          },
          error => {
            console.log(error);
          });

      let dateNow = new Date();
      if (this.DefaultCompanyParameter != null && this.DefaultCompanyParameter.MaximumDaysBudgetValidity != null) {
        dateNow.setDate(dateNow.getDate() + this.DefaultCompanyParameter.MaximumDaysBudgetValidity);
      }

      this.expirationDate = dateNow;
      this.budgetId = "";
      this.informationField = "";
      this.isPersonReadOnly = false;

      this.treatBudgetSituation("P");
    }, 200);

  }

  public resetForms(): void {

    this.budgetForm.reset();
    this.budgetForm.clearValidators();
    this.budgetForm.updateValueAndValidity();

    this.budgetForm2.reset();
    this.budgetForm2.clearValidators();
    this.budgetForm2.updateValueAndValidity();

    this.budgetNegotiationForm.reset();
    this.budgetNegotiationForm.clearValidators();
    this.budgetNegotiationForm.updateValueAndValidity();

  }

  public resetTables(): void {
    this.dataSourceBudgetNegotiation = new MatTableDataSource();
    this.dataSourceBudgetProduct = new MatTableDataSource();
    this.dataSourceHistoric = new MatTableDataSource();
  }

  public editBudget(id: string): void {

    this.resetForms();
    this.resetTables();

    this.budgetProductRowSelected = "";

    this.budgetsDispatcherService.getBudgetById(id)
      .subscribe(
        budget => {
          this.personType = budget.Persons.PersonType;
          this.budgetId = budget.ID;
          this.userId = budget.Users;
          this.personId = budget.Persons;
          this.situation = budget.Situation;
          this.totalBudgetAmount = budget.TotalBudgetAmount;
          this.discountPercentage = budget.DiscountPercentage;
          this.discountValue = budget.DiscountValue;
          this.expirationDate = budget.ExpirationDate;
          this.details = budget.Details;
          this.budgetNumber = budget.BudgetNumber;
          this.totalBudgetedAmount = budget.TotalBudgetedAmount;

          if (this.discountPercentage != 0) {
            this.discountType = "%"
            this.prefixDiscountType = "%"
            this.discountValue = budget.DiscountPercentage;
          } else {
            this.discountType = "R$"
            this.prefixDiscountType = "R$"
            this.discountValue = budget.DiscountValue;
          }
          this.treatBudgetSituation(budget.Situation)
          this.informationField = `Orçamento nº ${budget.BudgetNumber} - ${budget.Persons.Name} - ${this.showSituationFormated(budget.Situation)}`;
          this.isPersonReadOnly = true;
          this.tabBudgetIsDisabled = false;
          this.tabHistoricIsDisabled = false;

        },
        error => {
          console.log(error);
        });

    this.budgetsProductsDispatcherService.getBudgetsProductsBudget(id)
      .subscribe(
        budgetsProducts => {
          this.dataSourceBudgetProduct = new MatTableDataSource(budgetsProducts);
        },
        error => {
          console.log(error);
        });

    this.budgetsNegotiationsDispatcherService.getBudgetsNegotiationsBudget(id)
      .subscribe(
        budgetsNegotiations => {
          this.dataSourceBudgetNegotiation = new MatTableDataSource(budgetsNegotiations);
        },
        error => {
          console.log(error);
        });

    this.budgetsHistoricsDispatcherService.getBudgetsHistoricsBudget(id)
      .subscribe(
        budgetsHistorics => {
          this.dataSourceHistoric = new MatTableDataSource(budgetsHistorics);
        },
        error => {
          console.log(error);
        });
  }

  public createBudgetNegotiation() {

    if (!this.budgetNegotiationForm.valid) {
      console.log(this.budgetNegotiationForm);
      this.budgetNegotiationForm.markAllAsTouched();
      this.messageHandler.showMessage("Campos obrigatórios não preenchidos, verifique!", "warning-snackbar");
      return;
    }

    let budgetNegotiation = new BudgetNegotiationModel();
    budgetNegotiation.paymentFormId = this.budgetNegotiationForm.value.PaymentFormId.ID;
    budgetNegotiation.budgetId = this.budgetId;
    budgetNegotiation.installments = this.installments;
    budgetNegotiation.totalAmountBalance = this.balanceNegotiations;
    budgetNegotiation.totalAmountTraded = this.totalAmountTraded;
    budgetNegotiation.userId = localStorage.getItem('userId')!

    this.budgetsNegotiationsDispatcherService.createBudgetNegotiation(budgetNegotiation).subscribe(
      budgetsNegotiations => {

        this.budgetNegotiationForm.reset();
        this.budgetNegotiationForm.clearValidators();
        this.budgetNegotiationForm.updateValueAndValidity();

        this.dataSourceBudgetNegotiation = new MatTableDataSource(budgetsNegotiations);

        let totalAmountTradedNegotiations = this.dataSourceBudgetNegotiation.data.map(t => t.TotalAmountTraded).reduce((acc, value) => acc + value, 0);
        this.balanceNegotiations = this.totalBudgetAmount - totalAmountTradedNegotiations;

        this.treatBalanceNegotiation();
        this.getBudgetHistorics();
        this.messageHandler.showMessage("Negociação inserida com sucesso!", "success-snackbar");

      },
      error => {
        this.errorHandler.handleError(error);
        console.log(error);
      });

  }

  public removeBudgetProduct(id: string) {

    const dialogRef = this.dialog.open(ConfirmBudgetProductRemoveDialog);

    dialogRef.afterClosed()
      .subscribe(result => {
        if (!!result) {
          this.budgetsProductsDispatcherService.deleteBudgetProduct(id, localStorage.getItem('userId')!).subscribe(
            budgetsProducts => {

              if (budgetsProducts.length == 0) {
                setTimeout(() => {
                  this.treatBudgetSituation(this.situation);
                  this.budgetProductRowSelected = "";
                }, 500);
              }

              this.dataSourceBudgetProduct = new MatTableDataSource(budgetsProducts);
              this.getBudgetHistorics();
              this.messageHandler.showMessage("Produto removido com sucesso!", "success-snackbar");
            },
            error => {
              this.errorHandler.handleError(error);
              console.log(error);
            });
        }
      });

  }

  public updateBudgetProduct(id: string) {
    const dialogRef = this.dialog.open(UpdateBudgetProductDialog, {
      disableClose: true,
      width: '70vw',
      data: {
        ID: id,
        Situation: this.situation
      },
    });

    dialogRef.afterClosed().subscribe(
      (res) => {
        if (res != "") {
          this.dataSourceBudgetProduct = new MatTableDataSource(res);
          this.budgetProductRowSelected = "";
          setTimeout(() => {
            this.treatBudgetSituation(this.situation);
            this.isButtonReopenVisibile = true;
            this.getBudgetHistorics();
          }, 500);
        }
      }
    );

  }

  public treatBalanceNegotiation() {
    if (this.situation == "E") {
      if (this.balanceNegotiations == 0) {
        this.isbudgetNegotiationReadonly = true;
      } else {
        this.isbudgetNegotiationReadonly = false;
      }
    }

  }

  public removeBudgetNegotiation(id: string) {
    this.budgetsNegotiationsDispatcherService.deleteBudgetNegotiation(id, localStorage.getItem('userId')!).subscribe(
      budgetsNegotiations => {

        this.dataSourceBudgetNegotiation = new MatTableDataSource(budgetsNegotiations);

        let totalAmountTradedNegotiations = this.dataSourceBudgetNegotiation.data.map(t => t.TotalAmountTraded).reduce((acc, value) => acc + value, 0);
        this.balanceNegotiations = this.totalBudgetAmount - totalAmountTradedNegotiations;

        this.treatBalanceNegotiation();
        this.getBudgetHistorics();
        this.messageHandler.showMessage("Negociação removida com sucesso!", "success-snackbar");
      },
      error => {
        this.errorHandler.handleError(error);
        console.log(error);
      });

  }

  openProductDialog() {
    const dialogRef = this.dialog.open(AddBudgetProductDialog, {
      disableClose: true,
      width: '80vw',
      data: {
        ID: this.budgetId,
      },
    });

    dialogRef.afterClosed().subscribe(
      (res) => {
        if (res != "") {
          this.dataSourceBudgetProduct = new MatTableDataSource(res);
          this.budgetProductRowSelected = "";
          this.isButtonReopenVisibile = true;
          setTimeout(() => {
            this.getBudgetHistorics();
            this.treatBudgetSituation(this.situation);
            this.isButtonReopenVisibile = true;
          }, 500);
        }
      }
    );

  }

  public openEditPersonDialog(){
    const dialogRef = this.dialog.open(EditPersonDialog, {
      disableClose: true,
      width: '80vw',
      data: {
        PersonId: this.budgetForm.value.PersonId.ID
      }
    });

    dialogRef.afterClosed().subscribe(result => {

    });
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

  public filterPersons(val: string): Observable<any[]> {
    return this.personAutocompleteService.getAllPersonData()
      .pipe(
        map(response => response.filter((option: { Name: string; ID: string }) => {
          return option.Name.toLowerCase()
        }))
      )
  }

  public searchUsersByAutoComplete(): void {
    this.acUsers = this.myUserControl.valueChanges.pipe(
      startWith(''),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(val => {
        return this.filterUsers(val || '')
      })
    )
  }

  public filterUsers(val: string): Observable<any[]> {
    return this.usersService.getAllActive()
      .pipe(
        map(response => response.filter((user: { Email: string; ID: string }) => {
          console.log(user)
          return user.Email.toLowerCase()
        }))
      )
  }

  public searchPaymentFormsByAutoComplete(): void {
    this.acPaymentForms = this.myPaymentFormControl.valueChanges.pipe(
      startWith(''),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(val => {
        return this.filterPaymentForms(val || '')
      })
    )
  }

  public filterPaymentForms(val: string): Observable<any[]> {
    return this.paymentFormsDispatcherService.getAll()
      .pipe(
        map(response => response.filter((paymentForm: { Name: string; ID: string }) => {
          return paymentForm.Name.toLowerCase()
        }))
      )
  }

  displayStatePerson(state: any) {
    return state && state.Name ? state.Name : '';
  }

  displayStateUser(state: any) {
    return state && state.Email ? state.Email : '';
  }

  displayStatePaymentForm(state: any) {
    return state && state.Name ? state.Name : '';
  }

  secondFormGroup = this.formBuilder.group({
    secondCtrl: ['', Validators.required],
  });

  stepperOrientation: Observable<StepperOrientation> | undefined;

  resolveExibitionSituation(situation: string) {
    if (situation == "A") {
      this.situationColor = "fa-circle budget-aproved";
      this.situationTitle = "Aprovado"
    } else if (situation == "P") {
      this.situationColor = "fa-circle budget-pending";
      this.situationTitle = "Pendente"
    } else if (situation == "X") {
      this.situationColor = "fa-circle budget-canceled";
      this.situationTitle = "Cancelado"
    } else if (situation == "V") {
      this.situationColor = "fa-circle budget-expired";
      this.situationTitle = "Vencido"
    } else if (situation == "F") {
      this.situationColor = "fa-circle budget-finished";
      this.situationTitle = "Finalizado"
    } else if (situation = "E") {
      this.situationColor = "fa-circle budget-negotiation";
      this.situationTitle = "Em Negociação";
    }
  }

  resolveExibitionSituationProduct(situationProduct: string) {
    if (situationProduct == "E") {
      this.situationProductColor = "budget-finished";
      this.situationProductTitle = "Em Execução"
    } else if (situationProduct == "P") {
      this.situationProductColor = "budget-pending";
      this.situationProductTitle = "Pendente"
    } else {
      this.situationProductColor = "";
      this.situationProductTitle = ""
    }
  }

  public getBudgetHistorics() {
    this.budgetsHistoricsDispatcherService.getBudgetsHistoricsBudget(this.budgetId)
      .subscribe(
        budgetsHistorics => {
          this.dataSourceHistoric = new MatTableDataSource(budgetsHistorics);
        },
        error => {
          console.log(error);
        });
  }

}

@Component({
  selector: 'add-budget-product-dialog',
  templateUrl: 'add-budget-product-dialog.html',
})

export class AddBudgetProductDialog implements OnInit {

  myControl = new FormControl();
  options: string[] = [];
  filteredOptions: Observable<any[]> | undefined;

  myPersonControl = new FormControl();
  acPerson: string[] = [];
  acPersons: Observable<any[]> | undefined;

  //Doses table
  public displayedColumns: string[] = ['select', 'DoseType'];
  public dataSource = new MatTableDataSource<IProductDoses>();
  selection = new SelectionModel<IProductDoses>(true, []);

  Id!: string;
  BudgetId!: string;
  ProductName!: string;
  PersonName!: string;
  EstimatedSalesValue!: number;
  ProductDose!: string;
  Situation: string = 'P';
  Details!: string;
  DosesList!: any;

  isFieldReadonly = false;
  isProductDoseHidden = false;
  isTableDosesHidden = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private errorHandler: ErrorHandlerService,
    private messageHandler: MessageHandlerService,
    private productService: ProductsDispatcherService,
    private personAutocompleteService: PersonAutocompleteService,
    private budgetProductService: BudgetsProductsDispatcherService,
    private productDoseService: ProductsDosesDispatcherService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<UpdateBudgetProductDialog>
  ) { }

  //Form
  budgetProductForm: FormGroup = this.formBuilder.group({
    Id: [null],
    PersonName: [null],
    ProductName: [null, [Validators.required]],
    ProductDose: [null],
    EstimatedSalesValue: [null, [Validators.required]],
    Situation: [null],
    Details: [null]
  });

  ngOnInit(): void {
    this.BudgetId = this.data.ID;
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  checkboxLabel(row?: IProductDoses): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.DoseType + 1}`;
  }

  searchProductByAutoComplete() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(val => {
        return this.filter(val || '')
      })
    )
  }

  filter(val: string): Observable<any[]> {
    return this.productService.getAllProducts()
      .pipe(
        map(response => response.filter((option: { Name: string; ID: string }) => {
          return option.Name.toLowerCase()
        }))
      )
  }

  displayState(state: any) {
    return state && state.Name ? state.Name : '';
  }

  searchPersonByAutoComplete() {
    this.acPersons = this.myPersonControl.valueChanges.pipe(
      startWith(''),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(val => {
        return this.filterPerson(val || '')
      })
    )
  }

  filterPerson(val: string): Observable<any[]> {
    return this.personAutocompleteService.getPersonPhysicalData()
      .pipe(
        map(response => response.filter((option: { Name: string; ID: string }) => {
          return option.Name.toLowerCase()
        }))
      )
  }

  displayStatePerson(state: any) {
    return state && state.Name ? state.Name : '';
  }

  onSelectionChanged(event: MatAutocompleteSelectedEvent) {

    this.EstimatedSalesValue = event.option.value.SaleValue;
    this.getProductDoses(event.option.value.ID)

    setTimeout(() => {
      if (this.dataSource.data.length == 0) {
        this.isTableDosesHidden = true;
      } else {
        this.isTableDosesHidden = false;
      }
    }, 200);


  }

  getProductDoses(productId: string) {
    this.productDoseService.getProductsDosesByProductId(productId).subscribe(
      response => {
        this.dataSource = new MatTableDataSource(response);
      },
      error => {
        console.log(error);
      });

  }

  createBudgetProduct() {

    if (!this.budgetProductForm.valid) {
      console.log(this.budgetProductForm);
      this.budgetProductForm.markAllAsTouched();
      this.messageHandler.showMessage("Campos obrigatórios não preenchidos, verifique!", "warning-snackbar");
      return;
    }

    if (this.selection.selected.length == 0 && this.dataSource.data.length != 0) {
      this.messageHandler.showMessage("É necessário selecionar ao menos uma Dose!", "warning-snackbar")
      return;
    }

    let listBudgetProductModel = new Array<BudgetProductModel>();
    if (this.dataSource.data.length != 0) {
      this.selection.selected.forEach((productDose: any) => {

        let budgetProduct = new BudgetProductModel();
        budgetProduct.budgetId = this.BudgetId;
        budgetProduct.productId = this.budgetProductForm.value.ProductName.ID;
        budgetProduct.productDose = productDose.DoseType;
        budgetProduct.situationProduct = "P";
        budgetProduct.estimatedSalesValue = this.EstimatedSalesValue;
        budgetProduct.details = this.Details;
        budgetProduct.situationProduct = this.Situation;
        budgetProduct.userId = localStorage.getItem('userId')!;

        if (this.budgetProductForm.value.PersonName != undefined) {
          budgetProduct.borrowerPersonId = this.budgetProductForm.value.PersonName.ID;
        }

        listBudgetProductModel.push(budgetProduct);
      })

    } else {

      let budgetProduct = new BudgetProductModel();
      budgetProduct.budgetId = this.BudgetId;
      budgetProduct.productId = this.budgetProductForm.value.ProductName.ID;
      budgetProduct.situationProduct = "P";
      budgetProduct.estimatedSalesValue = this.EstimatedSalesValue;
      budgetProduct.details = this.Details;
      budgetProduct.situationProduct = this.Situation;
      budgetProduct.userId = localStorage.getItem('userId')!;

      if (this.budgetProductForm.value.PersonName != undefined) {
        budgetProduct.borrowerPersonId = this.budgetProductForm.value.PersonName.ID;
      }

      listBudgetProductModel.push(budgetProduct);
    }

    this.budgetProductService.createOnDemand(listBudgetProductModel).subscribe(
      response => {
        this.dialogRef.close(response);
        this.messageHandler.showMessage("Produto(s) criado(s) com sucesso!", "success-snackbar")
      },
      error => {
        console.log(error);
        this.errorHandler.handleError(error);
      });

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
}

@Component({
  selector: 'update-budget-product-dialog',
  templateUrl: 'update-budget-product-dialog.html',
})

export class UpdateBudgetProductDialog implements OnInit {

  myControl = new FormControl();
  options: string[] = [];
  filteredOptions: Observable<any[]> | undefined;

  myPersonControl = new FormControl();
  acPerson: string[] = [];
  acPersons: Observable<any[]> | undefined;

  Id!: string;
  ProductName!: string;
  PersonName!: string;
  EstimatedSalesValue!: number;
  ProductDose!: string;
  Situation!: string;
  SituationBudget!: string;
  SituationBudgetProduct!: string;
  Details!: string;
  DosesList!: any;

  isFieldReadonly = false;
  isProductDoseHidden = false;
  isSaveButtonVisible = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private errorHandler: ErrorHandlerService,
    private messageHandler: MessageHandlerService,
    private productService: ProductsDispatcherService,
    private personAutocompleteService: PersonAutocompleteService,
    private budgetProductService: BudgetsProductsDispatcherService,
    private productDoseService: ProductsDosesDispatcherService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<UpdateBudgetProductDialog>
  ) {
  }

  //Form
  budgetProductForm: FormGroup = this.formBuilder.group({
    Id: [null],
    PersonName: [null],
    ProductName: [null, [Validators.required]],
    ProductDose: [null],
    EstimatedSalesValue: [null, [Validators.required]],
    Situation: [null],
    Details: [null]
  });

  ngOnInit(): void {
    this.Id = this.data.ID;
    this.SituationBudgetProduct = this.data.Situation;
    this.getBudgetProductById(this.Id);
  }

  getBudgetProductById(id: string): void {
    this.budgetProductService.getBudgetProductById(id).subscribe(
      result => {
        if (this.SituationBudgetProduct != "P") {
          this.isSaveButtonVisible = false;
        } else {
          if (result.SituationProduct == "E") {
            this.isSaveButtonVisible = false;
          } else {
            this.isSaveButtonVisible = true;
          }
        }

        this.Id = result.ID;
        this.PersonName = result.Person;
        this.ProductName = result.Product;
        this.EstimatedSalesValue = result.EstimatedSalesValue;
        this.Situation = result.SituationProduct;
        this.Details = result.Details;
        this.getProductDoses(result.Product.ID);

        setTimeout(() => {
          this.DosesList.forEach((productDose: any) => {
            if (productDose.DoseType == result.ProductDose) {
              this.ProductDose = productDose;
            }
          })
        }, 200);

      },
      error => {
        console.log(error);
      });

  }

  searchProductByAutoComplete() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(val => {
        return this.filter(val || '')
      })
    )
  }

  filter(val: string): Observable<any[]> {
    // call the service which makes the http-request
    return this.productService.getAllProducts()
      .pipe(
        map(response => response.filter((option: { Name: string; ID: string }) => {
          return option.Name.toLowerCase()
        }))
      )
  }

  displayState(state: any) {
    return state && state.Name ? state.Name : '';
  }

  searchPersonByAutoComplete() {
    this.acPersons = this.myPersonControl.valueChanges.pipe(
      startWith(''),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(val => {
        return this.filterPerson(val || '')
      })
    )
  }

  filterPerson(val: string): Observable<any[]> {
    // call the service which makes the http-request
    return this.personAutocompleteService.getPersonPhysicalData()
      .pipe(
        map(response => response.filter((option: { Name: string; ID: string }) => {
          return option.Name.toLowerCase()
        }))
      )
  }

  displayStatePerson(state: any) {
    return state && state.Name ? state.Name : '';
  }

  onSelectionChanged(event: MatAutocompleteSelectedEvent) {
    this.EstimatedSalesValue = event.option.value.SaleValue;
    this.getProductDoses(event.option.value.ID)
  }

  getProductDoses(productId: string) {
    this.productDoseService.getProductsDosesByProductId(productId).subscribe(
      response => {
        this.DosesList = response;
        if (this.DosesList.length == 0) {
          this.isProductDoseHidden = true;
          this.ProductDose = "";
        } else {
          this.isProductDoseHidden = false;
        }
      },
      error => {
        console.log(error);
      });

  }

  updateBudgetProduct() {

    if (!this.budgetProductForm.valid) {
      console.log(this.budgetProductForm);
      this.budgetProductForm.markAllAsTouched();
      this.messageHandler.showMessage("Campos obrigatórios não preenchidos, verifique!", "warning-snackbar");
      return;
    }

    let budgetProduct = new BudgetProductModel();
    budgetProduct.id = this.Id;

    if (this.budgetProductForm.value.PersonName != undefined) {
      budgetProduct.borrowerPersonId = this.budgetProductForm.value.PersonName.ID;
    }

    budgetProduct.productId = this.budgetProductForm.value.ProductName.ID;
    budgetProduct.productDose = this.budgetProductForm.value.ProductDose.DoseType;
    budgetProduct.estimatedSalesValue = this.EstimatedSalesValue;
    budgetProduct.details = this.Details;
    budgetProduct.situationProduct = this.Situation;
    budgetProduct.userId = localStorage.getItem('userId')!;

    this.budgetProductService.updateBudgetProduct(budgetProduct.id, budgetProduct).subscribe(
      response => {
        this.dialogRef.close(response);
        this.messageHandler.showMessage("Produto alterado com sucesso!", "success-snackbar")
      },
      error => {
        console.log(error);
      });

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
}

@Component({
  selector: 'repeat-budget-product-dialog',
  templateUrl: 'repeat-budget-product-dialog.html',
})

export class RepeatBudgetProductDialog implements OnInit {

  public budgetProductId!: string;
  public ProductName!: string;
  public PersonName!: string | null;
  public ProductDose!: string;
  public NumberOfTimes!: number;

  public isBorrowerRepeated = false;
  public isSlideToggleDisabled = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private budgetProductService: BudgetsProductsDispatcherService,
    private formBuilder: FormBuilder,
    private messageHandler: MessageHandlerService,
    public dialogRef: MatDialogRef<RepeatBudgetProductDialog>
  ) {
  }

  ngOnInit(): void {

    this.budgetProductId = this.data.BudgetProduct.ID;
    this.getBudgetProductById(this.data.BudgetProduct.ID)

    if (this.data.BudgetProduct.BorrowerPersonId == null) {
      this.isSlideToggleDisabled = true;
    } else {
      this.isSlideToggleDisabled = false;
    }
  }

  //Form
  repeatProductForm: FormGroup = this.formBuilder.group({
    ProductName: [null, [Validators.required]],
    ProductDose: [null],
    PersonName: [null],
    NumberOfTimes: [null, [Validators.required]],
    isBorrowerRepeated: [null]
  });

  public getBudgetProductById(budgetId: string): void {
    this.budgetProductService.getBudgetProductById(budgetId).subscribe(
      response => {
        if (response.Person != null) {
          this.PersonName = response.Person.Name;
        } else {
          this.PersonName = null;
        }

        this.ProductName = response.Product.Name;
        this.ProductDose = this.formatDoseType(response.ProductDose);
      },
      error => {
        console.log(error);
      });
  }

  public formatDoseType(doseType: string) {
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

  public repeatBudgetProduct(): void {

    if (!this.repeatProductForm.valid) {
      console.log(this.repeatProductForm);
      this.repeatProductForm.markAllAsTouched();
      this.messageHandler.showMessage("Campos obrigatórios não preenchidos, verifique!", "warning-snackbar");
      return;
    }

    if (this.NumberOfTimes <= 0) {
      this.repeatProductForm.markAllAsTouched();
      this.messageHandler.showMessage("O Nº de Vezes precisa ser maior que 0!", "warning-snackbar");
      return;
    }

    this.budgetProductService.repeatOnDemand(this.budgetProductId, this.NumberOfTimes, this.isBorrowerRepeated, localStorage.getItem('userId')!).subscribe(
      response => {
        this.dialogRef.close(response);
        this.messageHandler.showMessage("Produto(s) inseridos com sucesso!", "success-snackbar")
      },
      error => {
        console.log(error);
      });
  }


}


@Component({
  selector: 'confirm-budget-product-remove-dialog',
  templateUrl: 'confirm-budget-product-remove-dialog.html',
})

export class ConfirmBudgetProductRemoveDialog implements OnInit {

  ngOnInit(): void {
  }

}

@Component({
  selector: 'confirm-budget-cancelation-dialog',
  templateUrl: 'confirm-budget-cancelation-dialog.html',
})

export class ConfirmBudgetCancelationDialog implements OnInit {

  ngOnInit(): void {
  }

}