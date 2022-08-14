import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BreakpointObserver } from '@angular/cdk/layout';
import { StepperOrientation } from '@angular/material/stepper';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';

export interface ProductElement {
  unitsNumber: string;
  product: string;
  unitaryValue: string;
  amount: string;
}

const ELEMENT_DATA: ProductElement[] = [
  { unitsNumber: '10', product: 'VACINA INFLUENZA', unitaryValue: '100,00', amount: '1.000,00' },
  { unitsNumber: '21', product: 'VACINA BCG', unitaryValue: '150,00', amount: '3.150,00' },
];


@Component({
  selector: 'app-movimentar-estoque-cadastro',
  templateUrl: './movimentar-estoque-cadastro.component.html',
  styleUrls: ['./movimentar-estoque-cadastro.component.scss']
})

export class MovimentarEstoqueCadastroComponent implements OnInit {

  displayedColumns: string[] = ['unitsNumber', 'product', 'unitaryValue', 'amount'];
  dataSource = ELEMENT_DATA;

  constructor(public dialog: MatDialog, private _formBuilder: FormBuilder, breakpointObserver: BreakpointObserver) {
    this.stepperOrientation = breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
  }

  openProductDialog() {
    const dialogRef = this.dialog.open(ProductDialog, {
      width: '50vw'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  ngOnInit(): void {
  }

  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });

  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });

  stepperOrientation: Observable<StepperOrientation> | undefined;
}

@Component({
  selector: 'product-dialog',
  templateUrl: 'product-dialog.html',
})
export class ProductDialog {
  
  myControl = new FormControl('');
  options: string[] = ['VACINA BCG', 'VACINA INFLUENZA', 'VACINA TETRAVALENTE'];
  filteredOptions: Observable<string[]> | undefined;

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

 }