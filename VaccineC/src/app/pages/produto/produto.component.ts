import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { debounceTime, distinctUntilChanged, map, Observable, startWith, switchMap } from 'rxjs';
import { IProduct } from 'src/app/interfaces/i-product';
import { IProductDoses } from 'src/app/interfaces/i-product-doses';
import { IProductSummariesBatches } from 'src/app/interfaces/i-product-summaty-batch';
import { ProductModel } from 'src/app/models/product-model';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { MessageHandlerService } from 'src/app/services/message-handler.service';
import { ProductsSummariesBatchesDispatcherService } from 'src/app/services/product-summary-batch-dispatcher.service';
import { ProductsDispatcherService } from 'src/app/services/products-dispatcher.service';
import { ProductsDosesDispatcherService } from 'src/app/services/products-doses-dispatcher.service';
import { VaccinesAutocompleteDispatcherService } from 'src/app/services/vaccines-autocomplete-dispatcher.service';

@Component({
  selector: 'app-produto',
  templateUrl: './produto.component.html',
  styleUrls: ['./produto.component.scss']
})
export class ProdutoComponent implements OnInit {

  public myControl = new FormControl();
  public options: string[] = [];
  public filteredOptions: Observable<any[]> | undefined;

  //Controle para o spinner do button
  public searchButtonLoading: boolean = false;
  public createButtonLoading: boolean = false;

  //Controle de tabs
  public tabIsDisabled: boolean = true;
  public tabDoseIsDisabled: boolean = true;
  public inputIsDisabled: boolean = false;

  //Controle de exibição dos IDs na Table
  public show: boolean = true;

  //Controle de habilitação de campos
  public isInputDisabled = false;
  public isInputReadOnly = false;

  //Variáveis dos inputs
  public searchProductName!: string;
  public productId!: string;
  public sbimVaccinesId!: string;
  public situation!: string;
  public details!: string;
  public saleValue!: number;
  public register!: Date;
  public name!: string;
  public minimumStock!: number;
  public productDosesId!: string;
  public doseType!: string;
  public doseRangeMonth!: string;
  public informationField!: string;

  //Table search
  public value = '';
  public displayedColumns: string[] = ['Name', 'SaleValue', 'ID', 'Options'];
  public dataSource = new MatTableDataSource<IProduct>();

  //Doses table
  public displayedColumnsDoses: string[] = ['DoseType', 'DoseRangeMonth', 'ID'];
  public dataSourceDoses = new MatTableDataSource<IProductDoses>();

  //Batches table
  public displayedColumnsBatches: string[] = ['Batch', 'ManufacturingDate', 'ValidityBatchDate', 'NumberOfUnitsBatch', 'Warning'];
  public dataSourceBatches = new MatTableDataSource<IProductSummariesBatches>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  public dialogRef?: MatDialogRef<any>;

  //Form de produtos
  public productForm: FormGroup = this.formBuilder.group({
    ProductId: [null],
    SbimVaccinesId: [null],
    Situation: [null, [Validators.required]],
    Details: [null],
    SaleValue: [null, [Validators.required]],
    Name: [null, [Validators.required, Validators.maxLength(255)]],
    MinimumStock: [null, [Validators.required]],
  });

  //Form de doses
  public productDosesForm: FormGroup = this.formBuilder.group({
    ProductDosesId: [null, [Validators.required]],
    ProductsId: [null],
    DoseType: [null, [Validators.required]],
    DoseRangeMonth: [null]
  });

  constructor(
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private productsDispatcherService: ProductsDispatcherService,
    private productsDosesDispatcherService: ProductsDosesDispatcherService,
    private productsSummariesBatchesDispatcherService: ProductsSummariesBatchesDispatcherService,
    private vaccinesAutocompleteDispatcherService: VaccinesAutocompleteDispatcherService,
    private errorHandler: ErrorHandlerService,
    private messageHandler: MessageHandlerService,) { }

  ngOnInit(): void {
    this.getAllProducts();
  }

  public loadProductData(): void {
    this.searchButtonLoading = true;

    if (this.searchProductName == "" || this.searchProductName == null || this.searchProductName == undefined) {
      this.getAllProducts();
    } else {
      this.getProductsByName();
    }
  }

  public createUpdateProduct(): void {
    this.createButtonLoading = true;

    if (this.productId == "" || this.productId == null || this.productId == undefined) {
      this.createProduct();
    } else {
      this.updateProduct();
    }
  }

  public getAllProducts(): void {
    this.productsDispatcherService.getAllProducts()
      .subscribe(products => {
        this.dataSource = new MatTableDataSource(products);
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

  public getProductsByName(): void {
    this.productsDispatcherService.getProductsByName(this.searchProductName)
      .subscribe(
        products => {
          this.dataSource = new MatTableDataSource(products);
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

  public addNewProduct(): void {
    this.resetForms();

    this.dataSourceDoses = new MatTableDataSource();
    this.dataSourceDoses.paginator = this.paginator;
    this.dataSourceDoses.sort = this.sort;

    this.dataSourceBatches = new MatTableDataSource();
    this.dataSourceBatches.paginator = this.paginator;
    this.dataSourceBatches.sort = this.sort;

    this.sbimVaccinesId = '';
    this.informationField = "";
    this.inputIsDisabled = false;
    this.tabIsDisabled = true;
    this.tabDoseIsDisabled = true;
  }

  public editProduct(id: string): void {
    this.resetForms();

    this.productsDispatcherService.getProductById(id)
      .subscribe(
        product => {
          this.productId = product.ID;
          this.sbimVaccinesId = product.SbimVaccines;
          this.name = product.Name;
          this.informationField = product.Name;
          this.situation = product.Situation;
          this.details = product.Details;
          this.saleValue = product.SaleValue;
          this.details = product.Details;
          this.minimumStock = product.MinimumStock;
          this.tabIsDisabled = false;

          if (product.SbimVaccinesId == null || product.SbimVaccinesId == "") {
            this.tabDoseIsDisabled = true;
          } else {
            this.tabDoseIsDisabled = false;
          }

          this.isInputReadOnly = true;
        },
        error => {
          console.log(error);
        });

    this.productsDosesDispatcherService.getProductsDosesByProductId(id)
      .subscribe(
        result => {
          this.dataSourceDoses = new MatTableDataSource(result);
          this.dataSourceDoses.paginator = this.paginator;
          this.dataSourceDoses.sort = this.sort;
        },
        error => {
          console.log(error);
        });

    this.productsSummariesBatchesDispatcherService.getProductsSummariesBatchesByProductId(id)
      .subscribe(
        result => {
          this.dataSourceBatches = new MatTableDataSource(result);
          this.dataSourceBatches.paginator = this.paginator;
          this.dataSourceBatches.sort = this.sort;
        },
        error => {
          console.log(error);
        });
  }

  public createProduct(): void {
    if (!this.productForm.valid) {
      console.log(this.productForm);
      this.createButtonLoading = false;
      this.productForm.markAllAsTouched();
      this.messageHandler.showMessage("Campos obrigatórios não preenchidos, verifique!", "warning-snackbar")
      return;
    }

    let product = new ProductModel();
    product.name = this.name;
    product.saleValue = this.saleValue;
    product.situation = this.situation;
    product.details = this.details;
    product.register = this.register;
    product.minimumStock = this.minimumStock;

    if (this.sbimVaccinesId != null) {
      product.sbimVaccinesId = this.productForm.value.SbimVaccinesId.ID;

    }

    this.productsDispatcherService.createProduct(product)
      .subscribe(
        response => {

          this.productId = response.ID;
          this.name = response.Name;
          this.saleValue = response.SaleValue;
          this.situation = response.Situation;
          this.details = response.Details;
          this.minimumStock = response.MinimumStock;

          if (response.SbimVaccinesId == "" || response.SbimVaccinesId == null) {
            this.tabDoseIsDisabled = true;
          } else {
            this.tabDoseIsDisabled = false;
          }

          this.informationField = this.name;

          this.isInputReadOnly = true;
          this.tabIsDisabled = false;

          this.getAllProducts();
          this.inputIsDisabled = false;
          this.messageHandler.showMessage("Produto criado com sucesso!", "success-snackbar")
        },
        error => {
          console.log(error);
          this.errorHandler.handleError(error);
          this.createButtonLoading = false;
        });
  }

  public updateProduct(): void {

    let product = new ProductModel();
    product.id = this.productId;
    product.name = this.name;
    product.saleValue = this.saleValue;
    product.details = this.details;
    product.situation = this.situation;
    product.minimumStock = this.minimumStock;

    if (this.sbimVaccinesId != null) {
      product.sbimVaccinesId = this.productForm.value.SbimVaccinesId.ID;

    }

    if (!this.productForm.valid) {
      console.log(this.productForm);
      this.createButtonLoading = false;
      this.productForm.markAllAsTouched();
      this.messageHandler.showMessage("Campos obrigatórios não preenchidos, verifique!", "warning-snackbar")
      return;
    }

    this.productsDispatcherService.updateProduct(this.productId, product)
      .subscribe(
        response => {
          console.log(response)
          this.productId = response.ID;
          this.name = response.Name;
          this.saleValue = response.SaleValue;
          this.details = response.Details;
          this.situation = response.Situation;
          this.minimumStock = response.MinimumStock;

          if (response.SbimVaccinesId == "" || response.SbimVaccinesId == null) {
            this.tabDoseIsDisabled = true;
          } else {
            this.tabDoseIsDisabled = false;
          }

          this.tabIsDisabled = false;
          this.informationField = this.name;
          this.createButtonLoading = false;

          this.getAllProducts();
          this.messageHandler.showMessage("Produto alterado com sucesso!", "success-snackbar")
        },
        error => {
          this.errorHandler.handleError(error);
          console.log(error);
          this.createButtonLoading = false;
        });
  }

  public deleteProduct(): void {
    const dialogRef = this.dialog.open(ConfirmProductRemoveDialog);

    dialogRef.afterClosed()
      .subscribe(result => {
        if (!!result) {
          this.productsDispatcherService.deleteProduct(this.productId)
            .subscribe(
              success => {
                this.sbimVaccinesId = "";
                this.informationField = "";
                this.resetForms();
                this.isInputReadOnly = false;
                this.tabIsDisabled = true;
                this.tabDoseIsDisabled = true;
                this.getAllProducts();
                this.messageHandler.showMessage("Produto excluído com sucesso!", "success-snackbar")
              },
              error => {
                console.log(error);
                this.errorHandler.handleError(error);
              });
        }
      });
  }

  public resetForms(): void {
    this.productForm.reset();
    this.productForm.clearValidators();
    this.productForm.updateValueAndValidity();

    this.productDosesForm.reset();
    this.productDosesForm.clearValidators();
    this.productDosesForm.updateValueAndValidity();
  }

  public openDoseDialog(): void {
    const dialogRef = this.dialog.open(DialogContentDose, {
      width: '40vw'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  public searchVaccineByAutoComplete(): void {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(val => {
        return this.filter(val || '')
      })
    )
  }

  public filter(val: string): Observable<any[]> {
    return this.vaccinesAutocompleteDispatcherService.getVaccinesAutocomplete()
      .pipe(
        map(response => response.filter((option: { Name: string; ID: string }) => {
          return option.Name.toLowerCase()
        }))
      )
  }

  public displayState(state: any) {
    return state && state.Name ? state.Name : '';
  }

  public resolveExibitionDoseType(doseType: string) {
    if (doseType == "DU") {
      return "Dose Única"
    } else if (doseType == "D1") {
      return "Dose 1"
    } else if (doseType == "D2") {
      return "Dose 2"
    } else if (doseType == "D3") {
      return "Dose 3"
    } else if (doseType == "DR") {
      return "Dose de Reforço"
    } else {
      return ""
    }
  }

  public getTotalUnits() {
    return this.dataSourceBatches.data.map(t => t.NumberOfUnitsBatch).reduce((acc, value) => acc + value, 0);
  }

  public isExpired(numberOfUnitsBatch: number, validityBatchDate: string) {
    const validityDateStr = validityBatchDate.split("T")[0];
    let validityDate = new Date(validityDateStr);
    let dateNow = new Date();
    if (numberOfUnitsBatch > 0 && validityDate.getTime() < dateNow.getTime()) {
      return true;
    } else {
      return false;
    }
  }
}

@Component({
  selector: 'dialog-content-dose',
  templateUrl: 'dialog-content-dose.html',
})
export class DialogContentDose { }

@Component({
  selector: 'confirm-product-remove-dialog',
  templateUrl: './confirm-product-remove-dialog.html',
})
export class ConfirmProductRemoveDialog { }
