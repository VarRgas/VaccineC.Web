import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { map, Observable, startWith } from 'rxjs';
import { IMovement } from 'src/app/interfaces/i-movement';
import { IMovementProduct } from 'src/app/interfaces/i-movement-product';
import { MovementModel } from 'src/app/models/movement-model';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { MessageHandlerService } from 'src/app/services/message-handler.service';
import { MovementsDispatcherService } from 'src/app/services/movement-dispatcher.service';
import { MovementsProductsDispatcherService } from 'src/app/services/movement-product-dispatcher.service';

@Component({
  selector: 'app-movimentar-estoque',
  templateUrl: './movimentar-estoque.component.html',
  styleUrls: ['./movimentar-estoque.component.scss']
})
export class MovimentarEstoqueComponent implements OnInit {

  public searchMovementNumber!: string;
  public informationField!: string;
  public Id!: string;
  public MovementType!: string;
  public MovementNumber!: string;
  public Situation!: string;
  public ProductsAmount!: number;

  //SEARCH TABLE
  displayedColumns: string[] = ['MovementNumber', 'MovementType', 'Situation', 'ProductsAmount', 'ID', 'Options'];
  public dataSource = new MatTableDataSource<IMovement>();

  //PRODUCTS TABLE
  displayedColumnsMovementProduct: string[] = ['UnitsNumber', 'Name', 'UnitaryValue', 'Amount', 'ID', 'Options'];
  public dataSourceMovementProduct = new MatTableDataSource<IMovementProduct>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  searchButtonLoading = false;
  createButtonLoading = false;
  finishButtonLoading = false;
  cancelButtonLoading = false;
  isMovementTypeDisabled = false;
  isVisible = false;
  isSaveButtonHidden = false;
  isFinishButtonHidden = true;
  isCancelButtonHidden = true;
  isAddNewProductButtonHidden = true;
  isButtonsTableDisabled = false;

  //Controle de exibição dos IDs na Table
  public show: boolean = true;

  //Form
  movementForm: FormGroup = this.formBuilder.group({
    Id: [null],
    MovementType: [null, [Validators.required]],
    MovementNumber: [null],
  });

  constructor(
    private movementService: MovementsDispatcherService,
    private movementProductService: MovementsProductsDispatcherService,
    private errorHandler: ErrorHandlerService,
    private messageHandler: MessageHandlerService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
  }

  loadMovementData() {

    this.searchButtonLoading = true;

    if (this.searchMovementNumber == "" || this.searchMovementNumber == null || this.searchMovementNumber == undefined) {
      this.getAllMovements();
    } else {
      this.getAllMovementsByNumber();
    }

  }

  getAllMovements() {
    this.movementService.getAll().subscribe(
      movements => {
        console.log(movements)
        this.dataSource = new MatTableDataSource(movements);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.searchButtonLoading = false;
      },
      error => {
        console.log(error);
        this.errorHandler.handleError(error);
        this.searchButtonLoading = false;
      });
  }

  getAllMovementsByNumber() {
    this.movementService.getAllByMovementNumber(this.searchMovementNumber).subscribe(
      movements => {
        this.dataSource = new MatTableDataSource(movements);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.searchButtonLoading = false;
      },
      error => {
        console.log(error);
        this.errorHandler.handleError(error);
        this.searchButtonLoading = false;
      });
  }

  createMovement() {

    this.createButtonLoading = true;

    if (!this.movementForm.valid) {
      console.log(this.movementForm);
      this.createButtonLoading = false;
      this.movementForm.markAllAsTouched();
      this.messageHandler.showMessage("Campos obrigatórios não preenchidos, verifique!", "warning-snackbar")
      return;
    }

    let movement = new MovementModel();
    movement.usersId = localStorage.getItem('userId')!
    movement.movementType = this.MovementType;
    movement.productsAmount = 0.00;
    movement.situation = "P";

    this.movementService.create(movement).subscribe(
      response => {
        console.log(response)

        this.isVisible = true;
        this.isAddNewProductButtonHidden = false;
        this.treatButtons(response.Situation);

        this.Id = response.ID;
        this.MovementNumber = response.MovementNumber;
        this.MovementType = response.MovementType;
        this.ProductsAmount = response.ProductsAmount;
        this.Situation = response.Situation;

        this.getAllMovements();

        this.messageHandler.showMessage("Movimento criado com sucesso!", "success-snackbar");
        this.createButtonLoading = false;
      },
      error => {
        this.errorHandler.handleError(error);
        console.log(error);
        this.createButtonLoading = false;
      });

  }

  finishMovement() {

    this.finishButtonLoading = true;

    if (!this.movementForm.valid) {
      console.log(this.movementForm);
      this.finishButtonLoading = false;
      this.movementForm.markAllAsTouched();
      this.messageHandler.showMessage("Campos obrigatórios não preenchidos, verifique!", "warning-snackbar")
      return;
    }

    let movement = new MovementModel();
    movement.id = this.Id;
    movement.usersId = localStorage.getItem('userId')!
    movement.movementType = this.MovementType;
    movement.productsAmount = 0.00;
    movement.situation = "P";

    this.movementService.finish(movement.id, movement).subscribe(
      response => {
        console.log(response)
        this.treatButtons(response.Situation);

        this.Id = response.ID;
        this.MovementNumber = response.MovementNumber;
        this.MovementType = response.MovementType;
        this.ProductsAmount = response.ProductsAmount;
        this.Situation = response.Situation;

        this.getAllMovements();

        this.messageHandler.showMessage("Movimento finalizado com sucesso!", "success-snackbar");
        this.finishButtonLoading = false;
      },
      error => {
        this.errorHandler.handleError(error);
        console.log(error);
        this.finishButtonLoading = false;
      });

  }

  cancelMovement() {
    const dialogRef = this.dialog.open(ConfirmCancelMovementDialog);

    dialogRef.afterClosed()
      .subscribe(result => {
        if (!!result) {
          this.cancelButtonLoading = true;

          if (!this.movementForm.valid) {
            console.log(this.movementForm);
            this.cancelButtonLoading = false;
            this.movementForm.markAllAsTouched();
            this.messageHandler.showMessage("Campos obrigatórios não preenchidos, verifique!", "warning-snackbar")
            return;
          }

          let movement = new MovementModel();
          movement.id = this.Id;
          movement.usersId = localStorage.getItem('userId')!
          movement.movementType = this.MovementType;
          movement.productsAmount = 0.00;
          movement.situation = "C";

          this.movementService.cancel(movement.id, movement).subscribe(
            response => {
              console.log(response)
              this.treatButtons(response.Situation);

              this.Id = response.ID;
              this.MovementNumber = response.MovementNumber;
              this.MovementType = response.MovementType;
              this.ProductsAmount = response.ProductsAmount;
              this.Situation = response.Situation;

              this.getAllMovements();

              this.messageHandler.showMessage("Movimento cancelado com sucesso!", "success-snackbar");
              this.cancelButtonLoading = false;
            },
            error => {
              this.errorHandler.handleError(error);
              console.log(error);
              this.cancelButtonLoading = false;
            });
        }
      });
  }

  addNewMovement() {
    this.resetForms();
    this.isMovementTypeDisabled = false;
    this.isVisible = false;
    this.isSaveButtonHidden = false;
    this.isFinishButtonHidden = true;
    this.isCancelButtonHidden = true;
  }

  editMovement(id: string) {
    this.resetForms();

    this.movementService.getById(id).subscribe(
      movement => {
        this.Id = movement.ID;
        this.MovementNumber = movement.MovementNumber;
        this.MovementType = movement.MovementType;
        this.Situation = movement.Situation;
        this.ProductsAmount = movement.ProductsAmount;

        this.treatButtons(movement.Situation)

        this.isMovementTypeDisabled = true;
        this.isVisible = true;
        console.log(movement)
      },
      error => {
        console.log(error);
      });

    this.movementProductService.getAllByMovementId(id).subscribe(
      movementProduct => {
        this.dataSourceMovementProduct = new MatTableDataSource(movementProduct);
        this.dataSourceMovementProduct.paginator = this.paginator;
        this.dataSourceMovementProduct.sort = this.sort;
        console.log(movementProduct)
      },
      error => {
        console.log(error);
      });

  }

  openDialogAddMovementProduct() {
    if (this.MovementType == "E") {
      this.openAddMovementProductEntryDialog();
    } else {
      this.openAddMovementProductExitDialog();
    }
  }

  openAddMovementProductEntryDialog() {
    const dialogRef = this.dialog.open(AddMovementProductEntryDialog, {
      width: '50vw'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openAddMovementProductExitDialog() {
    const dialogRef = this.dialog.open(AddMovementProductExitDialog, {
      width: '50vw'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  public resetForms(): void {
    this.movementForm.reset();
    this.movementForm.clearValidators();
    this.movementForm.updateValueAndValidity();

    this.dataSourceMovementProduct = new MatTableDataSource();
    this.dataSourceMovementProduct.paginator = this.paginator;
    this.dataSourceMovementProduct.sort = this.sort;
  }

  resolveExibitionSituation(situation: string) {
    if (situation == "P") {
      return "Pendente"
    } else if (situation == "F") {
      return "Finalizado"
    } else if (situation == "C") {
      return "Cancelado"
    } else {
      return ""
    }
  }

  treatButtons(situation: string) {
    if (situation == "P") {
      this.isSaveButtonHidden = true;
      this.isFinishButtonHidden = false;
      this.isCancelButtonHidden = false;
      this.isAddNewProductButtonHidden = false;
      this.isButtonsTableDisabled = false;
    } else if (situation == "C" || situation == "F") {
      this.isSaveButtonHidden = true;
      this.isFinishButtonHidden = true;
      this.isCancelButtonHidden = true;
      this.isAddNewProductButtonHidden = true;
      this.isButtonsTableDisabled = true;
    }
  }


}

@Component({
  selector: 'add-movement-product-entry-dialog',
  templateUrl: 'add-movement-product-entry-dialog.html',
})
export class AddMovementProductEntryDialog {

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

@Component({
  selector: 'add-movement-product-exit-dialog',
  templateUrl: 'add-movement-product-exit-dialog.html',
})
export class AddMovementProductExitDialog {

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

@Component({
  selector: 'confirm-cancel-movement-dialog',
  templateUrl: 'confirm-cancel-movement-dialog.html',
})
export class ConfirmCancelMovementDialog { }
