import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatStepper, StepperOrientation } from '@angular/material/stepper';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';

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

@Component({
  selector: 'app-orcamento-cadastro',
  templateUrl: './orcamento-cadastro.component.html',
  styleUrls: ['./orcamento-cadastro.component.scss']
})

export class OrcamentoCadastroComponent implements OnInit {

  myControl = new FormControl('');
  options: string[] = ['AMANDA', 'GUILHERME', 'JOÃO'];
  filteredOptions: Observable<string[]> | undefined;

  displayedColumns: string[] = ['product', 'dose', 'borrower', 'amount'];
  dataSource = ELEMENT_DATA;

  displayedColumns2: string[] = ['paymentForm', 'portion', 'negotiatedValue'];
  dataSource2 = ELEMENT_DATA2;

  constructor(public dialog: MatDialog, private _formBuilder: FormBuilder, breakpointObserver: BreakpointObserver) {
    this.stepperOrientation = breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
  }

  onNext(stepper: MatStepper) {
    //chamar stepper.next depois de salvar com sucesso
    stepper.next();
 }

  ngOnInit(): void {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
  }

  openProductDialog() {
    const dialogRef = this.dialog.open(BudgetProductDialog, {
      width: '80vw'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });

  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });

  thirdFormGroup = this._formBuilder.group({
    thirdCtrl: ['', Validators.required],
  });

  fourthFormGroup = this._formBuilder.group({
    fourthCtrl: ['', Validators.required],
  });

  stepperOrientation: Observable<StepperOrientation> | undefined;
}

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

  myControl = new FormControl('');
  options: string[] = ['VACINA COVID', 'VACINA INFLUENZA', 'VACINA TETRAVALENTE'];
  filteredOptions: Observable<string[]> | undefined;

  displayedColumns3: string[] = ['product', 'dose'];
  dataSource3 = new MatTableDataSource<DosesElement>(ELEMENT_DATA3);
  selection3 = new SelectionModel<DosesElement>(true, []);

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