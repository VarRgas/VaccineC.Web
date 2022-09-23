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
import { map, startWith } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { IBudget } from 'src/app/interfaces/i-budget';
import { BudgetsDispatcherService } from 'src/app/services/budgets-dispatcher.service';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { MessageHandlerService } from 'src/app/services/message-handler.service';

@Component({
  selector: 'app-orcamentos',
  templateUrl: './orcamentos.component.html',
  styleUrls: ['./orcamentos.component.scss']
})
export class OrcamentosComponent implements OnInit {
  //Controle para o spinner do button
  public searchButtonLoading: boolean = false;

  //Controle de exibição dos IDs na Table
  public show: boolean = true;

  //Variáveis dos inputs
  public searchPersonName!: string;
  public situation = 'P';
  public id!: string;
  public budgetNumber!: number;
  public budgetsAmount!: number;
  public discountPercentage: number = 0;
  public discountValue: number = 0;
  public totalBudgetAmount: number = 0;
  public totalBudgetedAmount: number = 0;
  public informationField!: string;

  //Table search
  public value = '';
  public displayedBudgetsColumns: string[] = ['ID', 'BudgetNumber', 'PersonName', 'ExpirationDate', 'Amount', 'Options'];
  public dataSourceBudget = new MatTableDataSource<IBudget>();;

  public myControl = new FormControl('');
  public options: string[] = ['AMANDA', 'GUILHERME', 'JOÃO'];
  public filteredOptions: Observable<string[]> | undefined;

  public displayedColumns: string[] = ['product', 'dose', 'borrower', 'amount'];
  public dataSource = ELEMENT_DATA;

  public displayedColumns2: string[] = ['paymentForm', 'portion', 'negotiatedValue'];
  public dataSource2 = ELEMENT_DATA2;


  public budgetForm: FormGroup = this.formBuilder.group({
    Id: [null],
    UserId: [null],
    PersonId: [null],
    // Situation: [null],
    // DiscountPercentage: [null],
    // DiscountValue: [null],
    // TotalBudgetNumber: [null],
    ExpirationDate: [null],
    // ApprovalDate: [null],
    Details: [null],
    // TotalBudgetedNumber: [null],
  });

  @ViewChild('paginatorBudget') paginatorBudget!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private errorHandler: ErrorHandlerService,
    private messageHandler: MessageHandlerService,
    private budgetsDispatcherService: BudgetsDispatcherService,
    private breakpointObserver: BreakpointObserver) {
    this.stepperOrientation = breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
  }

  ngOnInit(): void {
    this.loadData();

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
  }

  public loadData(): void {
    this.searchButtonLoading = true;

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
          this.searchButtonLoading = false;
        },
        error => {
          console.log(error);
          this.errorHandler.handleError(error);
          this.searchButtonLoading = false;
        });
  }

  public addNewBudget(): void {
    this.resetForms();
    this.informationField = "";

    // this.inputIsDisabled = false;
    // this.tabIsDisabled = true;

    this.dataSourceBudget = new MatTableDataSource();
    this.dataSourceBudget.paginator = this.paginatorBudget;
    this.dataSourceBudget.sort = this.sort;

  }

  public editBudget(id: string): void {
    //TODO
  }

  public resetForms(): void {
    // this.budgetsForm.reset();
    // this.budgetsForm.clearValidators();
    // this.budgetsForm.updateValueAndValidity();
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

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  firstFormGroup = this.formBuilder.group({
    firstCtrl: ['', Validators.required],
  });

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
  public filteredOptions: Observable<string[]> | undefined;

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

  public onNext(stepper: MatStepper) {
    //chamar stepper.next depois de salvar com sucesso
    stepper.next();
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
