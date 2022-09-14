import { SelectionModel } from '@angular/cdk/collections';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { debounceTime, distinctUntilChanged, map, Observable, startWith, switchMap } from 'rxjs';
import { IMovement } from 'src/app/interfaces/i-movement';
import { IMovementProduct } from 'src/app/interfaces/i-movement-product';
import { IProductSummariesBatches } from 'src/app/interfaces/i-product-summaty-batch';
import { MovementModel } from 'src/app/models/movement-model';
import { MovementProductModel } from 'src/app/models/movement-product-model';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { MessageHandlerService } from 'src/app/services/message-handler.service';
import { MovementsDispatcherService } from 'src/app/services/movement-dispatcher.service';
import { MovementsProductsDispatcherService } from 'src/app/services/movement-product-dispatcher.service';
import { ProductsSummariesBatchesDispatcherService } from 'src/app/services/product-summary-batch-dispatcher.service';
import { ProductsDispatcherService } from 'src/app/services/products-dispatcher.service';

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

  @ViewChild('paginatorMovement') paginatorMovement!: MatPaginator;
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
    Situation: [null]
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
        this.dataSource = new MatTableDataSource(movements);
        this.dataSource.paginator = this.paginatorMovement;
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
        this.dataSource.paginator = this.paginatorMovement;
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

        this.isVisible = true;
        this.isAddNewProductButtonHidden = false;
        this.treatButtons(response.Situation);

        this.Id = response.ID;
        this.MovementNumber = response.MovementNumber;
        this.MovementType = response.MovementType;
        this.ProductsAmount = response.ProductsAmount;
        this.Situation = response.Situation;
        this.informationField = `Movimento nº ${response.MovementNumber}`

        this.isMovementTypeDisabled = true;

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
    movement.productsAmount = this.dataSourceMovementProduct.data.map(t => t.Amount).reduce((acc, value) => acc + value, 0);
    movement.situation = "P";

    this.movementService.finish(movement.id, movement).subscribe(
      response => {
        this.treatButtons(response.Situation);

        this.Id = response.ID;
        this.MovementNumber = response.MovementNumber;
        this.MovementType = response.MovementType;
        this.ProductsAmount = response.ProductsAmount;
        this.Situation = response.Situation;
        this.informationField = `Movimento nº ${response.MovementNumber}`

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
          movement.productsAmount = this.dataSourceMovementProduct.data.map(t => t.Amount).reduce((acc, value) => acc + value, 0);
          movement.situation = "C";

          this.movementService.cancel(movement.id, movement).subscribe(
            response => {

              this.treatButtons(response.Situation);

              this.Id = response.ID;
              this.MovementNumber = response.MovementNumber;
              this.MovementType = response.MovementType;
              this.ProductsAmount = response.ProductsAmount;
              this.Situation = response.Situation;
              this.informationField = `Movimento nº ${response.MovementNumber}`

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
    this.informationField = '';
  }

  editMovement(id: string) {
    this.resetForms();

    this.movementService.getById(id).subscribe(
      movement => {
        console.log(movement)
        this.Id = movement.ID;
        this.MovementNumber = movement.MovementNumber;
        this.MovementType = movement.MovementType;
        this.Situation = movement.Situation;
        this.ProductsAmount = movement.ProductsAmount;
        this.informationField = `Movimento nº ${movement.MovementNumber}`

        this.treatButtons(movement.Situation)

        this.isMovementTypeDisabled = true;
        this.isVisible = true;

      },
      error => {
        console.log(error);
      });

    this.movementProductService.getAllByMovementId(id).subscribe(
      movementProduct => {
        this.dataSourceMovementProduct = new MatTableDataSource(movementProduct);
        this.dataSourceMovementProduct.sort = this.sort;
      },
      error => {
        console.log(error);
      });

  }

  deleteMovementProduct(id: string) {

    const dialogRef = this.dialog.open(ConfirmCancelMovementProductDialog);

    dialogRef.afterClosed().subscribe(result => {
      if (!!result) {
        this.movementProductService.delete(id).subscribe(
          success => {
            this.dataSourceMovementProduct = new MatTableDataSource(success);
            this.dataSourceMovementProduct.sort = this.sort;
            this.messageHandler.showMessage("Produto removido com sucesso!", "success-snackbar")
          },
          error => {
            console.log(error);
            this.errorHandler.handleError(error);
          });
      }
    });

  }

  public getTotalUnits() {
    return this.dataSourceMovementProduct.data.map(t => t.Amount).reduce((acc, value) => acc + value, 0);
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
      disableClose: true,
      width: '80vw',
      data: {
        ID: this.Id,
      },
    });

    dialogRef.afterClosed().subscribe(
      (res) => {
        if (res != "") {
          this.dataSourceMovementProduct = new MatTableDataSource(res);
          this.dataSourceMovementProduct.sort = this.sort;
        }
      }
    );
  }

  public openUpdateMovementProductEntryDialog(id: string): void {

    if (this.MovementType == "E") {
      const dialogRef = this.dialog.open(UpdateMovementProductEntryDialog, {
        disableClose: true,
        width: '80vw',
        data: {
          ID: id
        },
      });

      dialogRef.afterClosed().subscribe(
        (res) => {
          if (res != "") {
            this.dataSourceMovementProduct = new MatTableDataSource(res);
            this.dataSourceMovementProduct.sort = this.sort;
          }
        }
      );
    } else {
      const dialogRef = this.dialog.open(UpdateMovementProductExitDialog, {
        disableClose: true,
        width: '80vw',
        data: {
          ID: id
        },
      });

      dialogRef.afterClosed().subscribe(
        (res) => {
          if (res != "") {
            this.dataSourceMovementProduct = new MatTableDataSource(res);
            this.dataSourceMovementProduct.sort = this.sort;
          }
        }
      );
    }

  }


  openAddMovementProductExitDialog() {
    const dialogRef = this.dialog.open(AddMovementProductExitDialog, {
      disableClose: true,
      width: '80vw',
      data: {
        ID: this.Id,
      },
    });

    dialogRef.afterClosed().subscribe(
      (res) => {
        if (res != "") {
          this.dataSourceMovementProduct = new MatTableDataSource(res);
          this.dataSourceMovementProduct.sort = this.sort;
        }
      }
    );
  }

  public resetForms(): void {
    this.movementForm.reset();
    this.movementForm.clearValidators();
    this.movementForm.updateValueAndValidity();

    this.dataSourceMovementProduct = new MatTableDataSource();
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
export class AddMovementProductEntryDialog implements OnInit {

  myControl = new FormControl();
  options: string[] = [];
  filteredOptions: Observable<any[]> | undefined;

  Id!: string;
  MovementId!: string;
  ProductId!: string;
  ProductName!: string;
  UnitsNumber!: number;
  UnitaryValue!: number;
  Amount!: number;
  Batch!: string;
  Manufacturer!: string;
  BatchManufacturingDate!: Date | null;
  BatchExpirationDate!: Date | null;

  isFieldReadonly = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private errorHandler: ErrorHandlerService,
    private messageHandler: MessageHandlerService,
    private productService: ProductsDispatcherService,
    private movementProductService: MovementsProductsDispatcherService,
    private productSummaryBatchService: ProductsSummariesBatchesDispatcherService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<AddMovementProductEntryDialog>
  ) {
  }

  //Form
  movementProductForm: FormGroup = this.formBuilder.group({
    Id: [null],
    MovementId: [null],
    ProductName: [null, [Validators.required]],
    Batch: [null, [Validators.required]],
    UnitsNumber: [null, [Validators.required]],
    UnitaryValue: [null, [Validators.required]],
    Amount: [null, [Validators.required]],
    BatchManufacturingDate: [null, [Validators.required]],
    BatchExpirationDate: [null, [Validators.required]],
    Manufacturer: [null, [Validators.required]]
  });

  ngOnInit(): void {
    this.MovementId = this.data.ID;
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

  onSelectionChanged(event: MatAutocompleteSelectedEvent) {
    this.ProductId = event.option.value.ID;
    this.UnitaryValue = event.option.value.SaleValue;
    this.Batch = "";
    this.BatchExpirationDate = null;
    this.BatchManufacturingDate = null;
    this.Manufacturer = "";
    this.Amount = 0;
    this.isFieldReadonly = false;
  }

  getAmount() {
    this.Amount = this.UnitaryValue * this.UnitsNumber;
  }

  getBatch() {

    if (this.Batch != null && this.Batch != "") {
      this.productSummaryBatchService.getProductsSummariesBatchesByName(this.ProductId, this.Batch).subscribe(
        response => {
          if (response != null) {
            this.Batch = response.Batch;
            this.Manufacturer = response.Manufacturer;
            this.BatchExpirationDate = response.ValidityBatchDate;
            this.BatchManufacturingDate = response.ManufacturingDate;

            this.isFieldReadonly = true;
          } else {
            this.Manufacturer = "";
            this.BatchExpirationDate = null;
            this.BatchManufacturingDate = null;
            this.isFieldReadonly = false;
          }
        },
        error => {
          console.log(error);
        });
    } else {
      this.Manufacturer = "";
      this.BatchExpirationDate = null;
      this.BatchManufacturingDate = null;
      this.isFieldReadonly = false;
    }

  }
  saveMovementProductEntry() {
    if (!this.movementProductForm.valid) {
      console.log(this.movementProductForm);
      this.movementProductForm.markAllAsTouched();
      this.messageHandler.showMessage("Campos obrigatórios não preenchidos, verifique!", "warning-snackbar")
      return;
    }

    if (this.UnitsNumber <= 0) {
      this.messageHandler.showMessage("A Quantidade deve ser maior que 0 (zero)!", "warning-snackbar")
      return;
    }

    let movementProduct = new MovementProductModel();
    movementProduct.movementId = this.MovementId;
    movementProduct.productId = this.ProductId;
    movementProduct.batch = this.Batch;
    movementProduct.unitsNumber = this.UnitsNumber;
    movementProduct.unitaryValue = this.UnitaryValue;
    movementProduct.amount = this.Amount;
    movementProduct.batchExpirationDate = this.BatchExpirationDate;
    movementProduct.batchManufacturingDate = this.BatchManufacturingDate;
    movementProduct.manufacturer = this.Manufacturer;

    this.movementProductService.create(movementProduct, "E").subscribe(
      response => {
        this.dialogRef.close(response);
        this.messageHandler.showMessage("Produto inserido com sucesso!", "success-snackbar")
      },
      error => {
        this.errorHandler.handleError(error);
        console.log(error);
      });
  }

}

@Component({
  selector: 'update-movement-product-entry-dialog',
  templateUrl: 'update-movement-product-entry-dialog.html',
})
export class UpdateMovementProductEntryDialog implements OnInit {

  myControl = new FormControl();
  options: string[] = [];
  filteredOptions: Observable<any[]> | undefined;

  Id!: string;
  MovementId!: string;
  ProductId!: string;
  ProductName!: string;
  UnitsNumber!: number;
  UnitaryValue!: number;
  Amount!: number;
  Batch!: string;
  Manufacturer!: string;
  BatchManufacturingDate!: Date | null;
  BatchExpirationDate!: Date | null;

  isFieldReadonly = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private errorHandler: ErrorHandlerService,
    private messageHandler: MessageHandlerService,
    private productService: ProductsDispatcherService,
    private movementProductService: MovementsProductsDispatcherService,
    private productSummaryBatchService: ProductsSummariesBatchesDispatcherService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<AddMovementProductEntryDialog>
  ) {
  }

  //Form
  movementProductForm: FormGroup = this.formBuilder.group({
    Id: [null],
    MovementId: [null],
    ProductName: [null, [Validators.required]],
    Batch: [null, [Validators.required]],
    UnitsNumber: [null, [Validators.required]],
    UnitaryValue: [null, [Validators.required]],
    Amount: [null, [Validators.required]],
    BatchManufacturingDate: [null, [Validators.required]],
    BatchExpirationDate: [null, [Validators.required]],
    Manufacturer: [null, [Validators.required]]
  });

  ngOnInit(): void {
    this.Id = this.data.ID;
    this.getMovementProductById(this.Id);
  }

  getMovementProductById(id: string): void {
    this.movementProductService.getById(id).subscribe(
      result => {

        this.ProductName = result.Product;
        this.MovementId = result.MovementId;
        this.ProductId = result.ProductId;
        this.UnitsNumber = result.UnitsNumber;
        this.UnitaryValue = result.UnitaryValue;
        this.Amount = result.Amount;
        this.Batch = result.Batch;
        this.Manufacturer = result.Manufacturer;
        this.BatchManufacturingDate = result.BatchManufacturingDate;
        this.BatchExpirationDate = result.BatchExpirationDate;

        this.productSummaryBatchService.getProductsSummariesBatchesByName(result.ProductId, result.Batch).subscribe(
          response => {
            if (response != null) {
              this.isFieldReadonly = true;
            } else {
              this.isFieldReadonly = false;
            }
          },
          error => {
            console.log(error);
            this.isFieldReadonly = false;
          });

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

  onSelectionChanged(event: MatAutocompleteSelectedEvent) {
    this.ProductId = event.option.value.ID;
    this.UnitaryValue = event.option.value.SaleValue;
    this.Batch = "";
    this.BatchExpirationDate = null;
    this.BatchManufacturingDate = null;
    this.Manufacturer = "";
    this.Amount = 0;
    this.isFieldReadonly = false;
  }

  getAmount() {
    this.Amount = this.UnitaryValue * this.UnitsNumber;
  }

  getBatch() {
    if (this.Batch != null && this.Batch != "") {
      this.productSummaryBatchService.getProductsSummariesBatchesByName(this.ProductId, this.Batch).subscribe(
        response => {

          if (response != null) {
            this.Batch = response.Batch;
            this.Manufacturer = response.Manufacturer;
            this.BatchExpirationDate = response.ValidityBatchDate;
            this.BatchManufacturingDate = response.ManufacturingDate;

            this.isFieldReadonly = true;
          } else {
            this.Manufacturer = "";
            this.BatchExpirationDate = null;
            this.BatchManufacturingDate = null;
            this.isFieldReadonly = false;
          }
        },
        error => {
          console.log(error);
        });
    } else {
      this.Manufacturer = "";
      this.BatchExpirationDate = null;
      this.BatchManufacturingDate = null;
      this.isFieldReadonly = false;
    }

  }

  updateMovementProductEntry() {
    if (!this.movementProductForm.valid) {
      console.log(this.movementProductForm);
      this.movementProductForm.markAllAsTouched();
      this.messageHandler.showMessage("Campos obrigatórios não preenchidos, verifique!", "warning-snackbar")
      return;
    }

    let movementProduct = new MovementProductModel();
    console.log(this.ProductId);
    movementProduct.id = this.Id;
    movementProduct.movementId = this.MovementId;
    movementProduct.productId = this.ProductId;
    movementProduct.batch = this.Batch;
    movementProduct.unitsNumber = this.UnitsNumber;
    movementProduct.unitaryValue = this.UnitaryValue;
    movementProduct.amount = this.Amount;
    movementProduct.batchExpirationDate = this.BatchExpirationDate;
    movementProduct.batchManufacturingDate = this.BatchManufacturingDate;
    movementProduct.manufacturer = this.Manufacturer;
    console.log(movementProduct)

    this.movementProductService.update(movementProduct.id, "E", movementProduct).subscribe(
      response => {
        this.dialogRef.close(response);
        this.messageHandler.showMessage("Produto alterado com sucesso!", "success-snackbar")
      },
      error => {
        console.log(error);
      });
  }

}


@Component({
  selector: 'update-movement-product-exit-dialog',
  templateUrl: 'update-movement-product-exit-dialog.html',
})
export class UpdateMovementProductExitDialog implements OnInit {

  public displayedColumns: string[] = ['Select', 'Batch', 'NumberOfUnitsBatch', 'ManufacturingDate', 'ValidityBatchDate', 'ID'];
  public dataSource = new MatTableDataSource<IProductSummariesBatches>();
  selection = new SelectionModel<IProductSummariesBatches>(true, []);
  displayType = "Single";

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  myControl = new FormControl();
  options: string[] = [];
  filteredOptions: Observable<any[]> | undefined;

  Id!: string;
  MovementId!: string;
  ProductId!: string;
  ProductName!: string;
  UnitsNumber!: number;
  UnitaryValue!: number;
  Amount!: number;
  Batch!: string;

  isBatchTableVisible = false;
  isFieldReadonly = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private errorHandler: ErrorHandlerService,
    private messageHandler: MessageHandlerService,
    private productService: ProductsDispatcherService,
    private movementProductService: MovementsProductsDispatcherService,
    private productSummaryBatchService: ProductsSummariesBatchesDispatcherService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<AddMovementProductEntryDialog>
  ) {
  }

  //Form
  movementProductForm: FormGroup = this.formBuilder.group({
    Id: [null],
    MovementId: [null],
    ProductName: [null, [Validators.required]],
    UnitsNumber: [null, [Validators.required]],
    UnitaryValue: [null, [Validators.required]],
    Amount: [null, [Validators.required]],
  });

  ngOnInit(): void {
    this.Id = this.data.ID;
    this.getMovementProductById(this.Id);
  }

  getMovementProductById(id: string) {
    this.movementProductService.getById(id).subscribe(
      response => {
        console.log(response);
        this.ProductName = response.Product;
        this.MovementId = response.MovementId;
        this.ProductId = response.ProductId;
        this.UnitsNumber = response.UnitsNumber;
        this.UnitaryValue = response.UnitaryValue;
        this.Amount = response.Amount;
        this.Batch = response.Batch;

        this.productSummaryBatchService.getProductsSummariesBatchesByProductId(this.ProductId).subscribe(
          response => {
            this.isBatchTableVisible = true;
            this.dataSource = new MatTableDataSource(response);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;

            console.log(this.dataSource.data)
            this.dataSource.data.forEach((productSummaryBatch) => {
              console.log(productSummaryBatch)
              if (this.Batch == productSummaryBatch.Batch) {
                this.selection.select(productSummaryBatch)
              }
            })
            // this.selection.select(this.dataSource.data)
          },
          error => {
            console.log(error);
          })
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

  onSelectionChanged(event: MatAutocompleteSelectedEvent) {

    this.ProductId = event.option.value.ID;
    this.UnitaryValue = event.option.value.SaleValue;
    this.Amount = 0;
    this.isFieldReadonly = false;

    this.productSummaryBatchService.getProductsSummariesBatchesByProductId(this.ProductId).subscribe(
      response => {
        this.isBatchTableVisible = true;
        this.dataSource = new MatTableDataSource(response);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error => {
        console.log(error);
      });
  }

  getAmount() {
    this.Amount = this.UnitaryValue * this.UnitsNumber;
  }

  selectHandler(row: IProductSummariesBatches) {

    if (!this.selection.isSelected(row)) {
      this.selection.clear();
    }

    this.selection.toggle(row);
  }

  updateMovementProductExit() {

    if (!this.movementProductForm.valid) {
      console.log(this.movementProductForm);
      this.movementProductForm.markAllAsTouched();
      this.messageHandler.showMessage("Campos obrigatórios não preenchidos, verifique!", "warning-snackbar")
      return;
    }

    if (this.selection.selected.length == 0) {
      this.messageHandler.showMessage("É necessário selecionar um Lote!", "warning-snackbar")
      return;
    }

    if (this.UnitsNumber <= 0) {
      this.messageHandler.showMessage("A Quantidade deve ser maior que 0 (zero)!", "warning-snackbar")
      return;
    }

    if (this.selection.selected[0].NumberOfUnitsBatch <= 0) {
      this.messageHandler.showMessage("O lote selecionado não possui unidades para retirada!", "danger-snackbar")
      return;
    }

    if (this.selection.selected[0].NumberOfUnitsBatch < this.UnitsNumber) {
      this.messageHandler.showMessage("Não é possível retirar " + this.UnitsNumber + " unidades do lote selecionado, pois o total de unidades presentes é " + this.selection.selected[0].NumberOfUnitsBatch + ".", "danger-snackbar")
      return;
    }

    let movementProduct = new MovementProductModel();
    movementProduct.id = this.Id;
    movementProduct.movementId = this.MovementId;
    movementProduct.productId = this.ProductId;
    movementProduct.unitsNumber = this.UnitsNumber;
    movementProduct.unitaryValue = this.UnitaryValue;
    movementProduct.amount = this.Amount;
    movementProduct.batch = this.selection.selected[0].Batch;
    movementProduct.batchExpirationDate = this.selection.selected[0].ValidityBatchDate;
    movementProduct.batchManufacturingDate = this.selection.selected[0].ManufacturingDate;
    movementProduct.manufacturer = this.selection.selected[0].Manufacturer;

    console.log(this.selection.selected)

    this.movementProductService.update(movementProduct.id, "S", movementProduct).subscribe(
      response => {
        this.dialogRef.close(response);
        this.messageHandler.showMessage("Produto alterado com sucesso!", "success-snackbar")
      },
      error => {
        console.log(error);
      })
  }

}

@Component({
  selector: 'add-movement-product-exit-dialog',
  templateUrl: 'add-movement-product-exit-dialog.html',
})
export class AddMovementProductExitDialog {

  public displayedColumns: string[] = ['Select', 'Batch', 'NumberOfUnitsBatch', 'ManufacturingDate', 'ValidityBatchDate', 'ID'];
  public dataSource = new MatTableDataSource<IProductSummariesBatches>();
  selection = new SelectionModel<IProductSummariesBatches>(true, []);
  displayType = "Single";

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  myControl = new FormControl();
  options: string[] = [];
  filteredOptions: Observable<any[]> | undefined;

  Id!: string;
  MovementId!: string;
  ProductId!: string;
  ProductName!: string;
  UnitsNumber!: number;
  UnitaryValue!: number;
  Amount!: number;

  isBatchTableVisible = false;
  isFieldReadonly = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private errorHandler: ErrorHandlerService,
    private messageHandler: MessageHandlerService,
    private productService: ProductsDispatcherService,
    private movementProductService: MovementsProductsDispatcherService,
    private productSummaryBatchService: ProductsSummariesBatchesDispatcherService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<AddMovementProductEntryDialog>
  ) {
  }

  //Form
  movementProductForm: FormGroup = this.formBuilder.group({
    Id: [null],
    MovementId: [null],
    ProductName: [null, [Validators.required]],
    UnitsNumber: [null, [Validators.required]],
    UnitaryValue: [null, [Validators.required]],
    Amount: [null, [Validators.required]],
  });

  ngOnInit(): void {
    this.MovementId = this.data.ID;
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

  onSelectionChanged(event: MatAutocompleteSelectedEvent) {

    this.ProductId = event.option.value.ID;
    this.UnitaryValue = event.option.value.SaleValue;
    this.Amount = 0;
    this.isFieldReadonly = false;

    this.productSummaryBatchService.getProductsSummariesBatchesByProductId(this.ProductId).subscribe(
      response => {
        this.isBatchTableVisible = true;
        this.dataSource = new MatTableDataSource(response);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error => {
        console.log(error);
      });
  }

  getAmount() {
    this.Amount = this.UnitaryValue * this.UnitsNumber;
  }

  selectHandler(row: IProductSummariesBatches) {

    if (!this.selection.isSelected(row)) {
      this.selection.clear();
    }

    this.selection.toggle(row);
  }

  saveMovementProductEntry() {

    if (!this.movementProductForm.valid) {
      console.log(this.movementProductForm);
      this.movementProductForm.markAllAsTouched();
      this.messageHandler.showMessage("Campos obrigatórios não preenchidos, verifique!", "warning-snackbar")
      return;
    }

    if (this.selection.selected.length == 0) {
      this.messageHandler.showMessage("É necessário selecionar um Lote!", "warning-snackbar")
      return;
    }

    if (this.UnitsNumber <= 0) {
      this.messageHandler.showMessage("A Quantidade deve ser maior que 0 (zero)!", "warning-snackbar")
      return;
    }

    if (this.selection.selected[0].NumberOfUnitsBatch <= 0) {
      this.messageHandler.showMessage("O lote selecionado não possui unidades para retirada!", "danger-snackbar")
      return;
    }


    if (this.selection.selected[0].NumberOfUnitsBatch < this.UnitsNumber) {
      this.messageHandler.showMessage("Não é possível retirar " + this.UnitsNumber + " unidades do lote selecionado, pois o total de unidades presentes é " + this.selection.selected[0].NumberOfUnitsBatch + ".", "danger-snackbar")
      return;
    }

    let movementProduct = new MovementProductModel();
    movementProduct.movementId = this.MovementId;
    movementProduct.productId = this.ProductId;
    movementProduct.unitsNumber = this.UnitsNumber;
    movementProduct.unitaryValue = this.UnitaryValue;
    movementProduct.amount = this.Amount;

    movementProduct.batch = this.selection.selected[0].Batch;
    movementProduct.batchExpirationDate = this.selection.selected[0].ValidityBatchDate;
    movementProduct.batchManufacturingDate = this.selection.selected[0].ManufacturingDate;
    movementProduct.manufacturer = this.selection.selected[0].Manufacturer;

    console.log(movementProduct)

    this.movementProductService.create(movementProduct, "S").subscribe(
      response => {
        this.dialogRef.close(response);
        this.messageHandler.showMessage("Produto inserido com sucesso!", "success-snackbar")
      },
      error => {
        console.log(error)
        this.errorHandler.handleError(error);
      })
  }

}

@Component({
  selector: 'confirm-cancel-movement-dialog',
  templateUrl: 'confirm-cancel-movement-dialog.html',
})
export class ConfirmCancelMovementDialog { }

@Component({
  selector: 'confirm-cancel-movement-product-dialog',
  templateUrl: 'confirm-cancel-movement-product-dialog.html',
})
export class ConfirmCancelMovementProductDialog { }