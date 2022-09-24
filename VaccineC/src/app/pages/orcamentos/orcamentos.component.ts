import { SelectionModel } from '@angular/cdk/collections';
import { BreakpointObserver } from '@angular/cdk/layout';
import { StepperOrientation } from '@angular/cdk/stepper';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatStepper } from '@angular/material/stepper';
import { MatTableDataSource } from '@angular/material/table';
import { debounceTime, distinctUntilChanged, map, startWith, switchMap } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { IBudget } from 'src/app/interfaces/i-budget';
import { BudgetModel } from 'src/app/models/budget-model';
import { BudgetsDispatcherService } from 'src/app/services/budgets-dispatcher.service';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { MessageHandlerService } from 'src/app/services/message-handler.service';
import { PersonAutocompleteService } from 'src/app/services/person-autocomplete.service';
import { UsersService } from 'src/app/services/user-dispatcher.service';

@Component({
  selector: 'app-orcamentos',
  templateUrl: './orcamentos.component.html',
  styleUrls: ['./orcamentos.component.scss']
})
export class OrcamentosComponent implements OnInit {

  @ViewChild('stepper') stepper!: MatStepper;

  //Controle de exibição dos IDs na Table
  public show: boolean = true;

  //Controle de habilitação de campos
  public isInputDisabled = false;
  public isInputReadOnly = false;

  //Variáveis dos inputs
  public searchPersonName!: string;
  public situation!: string;
  public budgetId!: string;
  public personId!: string;
  public userId!: string;
  public details!: string;
  public budgetNumber!: number;
  public budgetsAmount!: number;
  public discountPercentage!: number;
  public discountValue!: number;
  public totalBudgetAmount!: number;
  public totalBudgetedAmount!: number;
  public expirationDate!: Date;
  public informationField!: string;

  //Table search
  public displayedBudgetsColumns: string[] = ['BudgetNumber', 'PersonName', 'ExpirationDate', 'Amount', 'Options', 'ID'];
  public dataSourceBudget = new MatTableDataSource<IBudget>();;

  public myControl = new FormControl();
  public options: string[] = [];
  public filteredOptions: Observable<any[]> | undefined;

  public myUserControl = new FormControl();
  public acUser: string[] = [];
  public acUsers: Observable<any[]> | undefined;

  public displayedColumns: string[] = ['product', 'dose', 'borrower', 'amount'];
  public dataSource = ELEMENT_DATA;

  public displayedColumns2: string[] = ['paymentForm', 'portion', 'negotiatedValue'];
  public dataSource2 = ELEMENT_DATA2;

  public budgetForm: FormGroup = this.formBuilder.group({
    PersonId: [null, Validators.required],
    UserId: [null, Validators.required],
    Situation: [null],
    ExpirationDate: [null, Validators.required],
    Details: [null],
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
    private usersService: UsersService) {
    this.stepperOrientation = breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
  }

  ngOnInit(): void {

  }

  public onNext(stepper: MatStepper) {
    if (this.budgetId == "" || this.budgetId == null || this.budgetId == undefined) {
      this.createBudget(stepper);
    } else {
      this.updateBudget(stepper);
    }
  }


  public createBudget(stepper: MatStepper): void {

    if (!this.budgetForm.valid) {
      console.log(this.budgetForm);
      //this.createButtonLoading = false;
      this.budgetForm.markAllAsTouched();
      this.messageHandler.showMessage("Campos obrigatórios não preenchidos, verifique!", "warning-snackbar")
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
          this.budgetId = response.ID;
          this.personId = response.Persons;
          this.userId = response.Users;
          this.expirationDate = response.ExpirationDate;
          this.details = response.Details;

          this.informationField = `Orçamento nº ${response.BudgetNumber} - ${response.Persons.Name}`;

          this.loadData();
          stepper.next();
          this.messageHandler.showMessage("Orçamento criado com sucesso!", "success-snackbar")
        },
        error => {
          console.log(error);
          this.errorHandler.handleError(error);
        });

  }

  public updateBudget(stepper: MatStepper): void {

    if (!this.budgetForm.valid) {
      console.log(this.budgetForm);
      //this.createButtonLoading = false;
      this.budgetForm.markAllAsTouched();
      this.messageHandler.showMessage("Campos obrigatórios não preenchidos, verifique!", "warning-snackbar")
      return;
    }

    let budget = new BudgetModel();
    budget.id = this.budgetId;
    budget.personId = this.budgetForm.value.PersonId.ID;
    budget.userId = localStorage.getItem('userId')!;
    budget.situation = "P";
    budget.totalBudgetAmount = 0;
    budget.discountPercentage = 0;
    budget.discountValue = 0;
    budget.expirationDate = this.expirationDate;
    budget.details = this.details;
    budget.totalBudgetedAmount = 0;

    this.budgetsDispatcherService.updateBudget(budget.id, budget)
      .subscribe(
        response => {
          console.log(response)
          this.budgetId = response.ID;
          this.personId = response.Persons;
          this.userId = response.Users;
          this.expirationDate = response.ExpirationDate;
          this.details = response.Details;

          this.informationField = `Orçamento nº ${response.BudgetNumber} - ${response.Persons.Name}`;

          this.loadData();
          stepper.next();
          this.messageHandler.showMessage("Orçamento alterado com sucesso!", "success-snackbar")
        },
        error => {
          console.log(error);
          this.errorHandler.handleError(error);
        });
  }

  public loadData(): void {

    if (this.searchPersonName == "" || this.searchPersonName == null || this.searchPersonName == undefined) {
      this.getAllBudgets();
    } else {
      this.getBudgetsByPersonName();
    }
  }

  public getAllBudgets(): void {
    this.budgetsDispatcherService.getAllBudgets()
      .subscribe(budgets => {
        this.dataSourceBudget = new MatTableDataSource(budgets);
        this.dataSourceBudget.paginator = this.paginatorBudget;
        this.dataSourceBudget.sort = this.sort;
      },
        error => {
          console.log(error);
          this.errorHandler.handleError(error);
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

  public addNewBudget(stepper: MatStepper): void {

    this.usersService.getById(localStorage.getItem('userId')!)
      .subscribe(
        user => {
          this.userId = user;
        },
        error => {
          console.log(error);
        });

    this.resetForms();
    this.stepper.selectedIndex = 0;

    this.budgetId = "";
    this.informationField = "";

    this.dataSourceBudget = new MatTableDataSource();
    this.dataSourceBudget.paginator = this.paginatorBudget;
    this.dataSourceBudget.sort = this.sort;

  }

  public editBudget(id: string): void {

    this.resetForms();

    this.budgetsDispatcherService.getBudgetById(id)
      .subscribe(
        budget => {
          console.log(budget)
          this.budgetId = budget.ID;
          this.userId = budget.Users;
          this.personId = budget.Persons;
          this.expirationDate = budget.ExpirationDate;
          this.details = budget.Details;
          this.informationField = `Orçamento nº ${budget.BudgetNumber} - ${budget.Persons.Name}`;
        },
        error => {
          console.log(error);
        });

  }

  public resetForms(): void {
    this.budgetForm.reset();
    this.budgetForm.clearValidators();
    this.budgetForm.updateValueAndValidity();
  }

  openProductDialog() {
    const dialogRef = this.dialog.open(BudgetProductDialog, {
      width: '80vw'
    });

    dialogRef.afterClosed()
      .subscribe(result => {
        console.log(`Dialog result: ${result}`);
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
    return this.personAutocompleteService.getPersonPhysicalData()
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

  displayStatePerson(state: any) {
    return state && state.Name ? state.Name : '';
  }

  displayStateUser(state: any) {
    return state && state.Email ? state.Email : '';
  }

  secondFormGroup = this.formBuilder.group({
    secondCtrl: ['', Validators.required],
  });

  thirdFormGroup = this.formBuilder.group({
    thirdCtrl: ['', Validators.required],
  });

  fourthFormGroup = this.formBuilder.group({
    fourthCtrl: ['', Validators.required],
  });

  stepperOrientation: Observable<StepperOrientation> | undefined;

}

export interface ProductElement {
  product: string;
  dose: string;
  borrower: string;
  amount: string;
}

const ELEMENT_DATA: ProductElement[] = [
  { product: 'VACINA INFLUENZA', dose: 'DOSE ÚNICA', borrower: 'MARIA', amount: '150,00' },
  { product: 'VACINA BCG', dose: 'DOSE 1', borrower: 'JOÃO', amount: '100,00' },
];

export interface PaymentElement {
  paymentForm: string;
  portion: string;
  negotiatedValue: string;
}

const ELEMENT_DATA2: PaymentElement[] = [
  { paymentForm: 'CARTÃO DE CRÉDITO', portion: '1', negotiatedValue: '150,00' },
];

export interface DosesElement {
  product: string;
  dose: string;
}

const ELEMENT_DATA3: DosesElement[] = [
  { product: 'VACINA BCG', dose: '1' },
  { product: 'VACINA BCG', dose: '2' },
  { product: 'VACINA BCG', dose: '3' }
];

@Component({
  selector: 'budget-product-dialog',
  templateUrl: 'budget-product-dialog.html',
})

export class BudgetProductDialog implements OnInit {
  public myControl = new FormControl('');
  public options: string[] = ['VACINA COVID', 'VACINA INFLUENZA', 'VACINA TETRAVALENTE'];
  public filteredOptions: Observable<any[]> | undefined;

  public displayedColumns3: string[] = ['product', 'dose'];
  public dataSource3 = new MatTableDataSource<DosesElement>(ELEMENT_DATA3);
  public selection3 = new SelectionModel<DosesElement>(true, []);

  constructor() { }

  ngOnInit(): void {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection3.selected.length;
    const numRows = this.dataSource3.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection3.clear();
      return;
    }

    this.selection3.select(...this.dataSource3.data);
  }
}
