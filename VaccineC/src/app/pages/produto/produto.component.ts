import { Component, Inject, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSelectChange } from '@angular/material/select';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, map, Observable, startWith, switchMap } from 'rxjs';
import { IProduct } from 'src/app/interfaces/i-product';
import { IProductDoses } from 'src/app/interfaces/i-product-doses';
import { IProductSummariesBatches } from 'src/app/interfaces/i-product-summaty-batch';
import { ProductDosesModel } from 'src/app/models/product-doses-model';
import { ProductModel } from 'src/app/models/product-model';
import { ResourceModel } from 'src/app/models/resource-model';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { MessageHandlerService } from 'src/app/services/message-handler.service';
import { ProductsSummariesBatchesDispatcherService } from 'src/app/services/product-summary-batch-dispatcher.service';
import { ProductsDispatcherService } from 'src/app/services/products-dispatcher.service';
import { ProductsDosesDispatcherService } from 'src/app/services/products-doses-dispatcher.service';
import { UsersService } from 'src/app/services/user-dispatcher.service';
import { UserResourceService } from 'src/app/services/user-resource.service';
import { VaccinesAutocompleteDispatcherService } from 'src/app/services/vaccines-autocomplete-dispatcher.service';

@Component({
  selector: 'app-produto',
  templateUrl: './produto.component.html',
  styleUrls: ['./produto.component.scss']
})
export class ProdutoComponent implements OnInit {

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
  public isNameProductReadonly = false;
  public isVaccine = false;

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
  public informationField!: string;

  //Table search
  public value = '';
  public displayedColumns: string[] = ['Name', 'SaleValue', 'ID', 'Options'];
  public dataSource = new MatTableDataSource<IProduct>();

  //Doses table
  public displayedColumnsDoses: string[] = ['DoseType', 'DoseRangeMonth', 'ID', 'Options'];
  public dataSourceDoses = new MatTableDataSource<IProductDoses>();

  //Batches table
  public displayedColumnsBatches: string[] = ['Batch', 'ManufacturingDate', 'ValidityBatchDate', 'NumberOfUnitsBatch', 'Warning'];
  public dataSourceBatches = new MatTableDataSource<IProductSummariesBatches>();

  @ViewChild('paginatorProduct') paginatorProduct!: MatPaginator;
  @ViewChild('paginatorDoses') paginatorDoses!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  public dialogRef?: MatDialogRef<any>;

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceBatches.filter = filterValue.trim().toLowerCase();
  }

  onChanged(value: any): void {

    if (value == "") {
      this.isNameProductReadonly = false;
      this.name = "";
    }
  }

  onSelectionChanged(event: MatAutocompleteSelectedEvent) {
    this.name = event.option.value.Name;
    this.isNameProductReadonly = true;
  }

  //Form de produtos
  public productForm: FormGroup = this.formBuilder.group({
    ProductId: [null],
    SbimVaccinesId: new FormControl(null),
    Situation: [null, [Validators.required]],
    Details: [null],
    SaleValue: [null, [Validators.required]],
    Name: [null, [Validators.required, Validators.maxLength(255)]],
    MinimumStock: [null, [Validators.required]],
  });

  constructor(
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private productsDispatcherService: ProductsDispatcherService,
    private productsDosesDispatcherService: ProductsDosesDispatcherService,
    private productsSummariesBatchesDispatcherService: ProductsSummariesBatchesDispatcherService,
    private vaccinesAutocompleteDispatcherService: VaccinesAutocompleteDispatcherService,
    private errorHandler: ErrorHandlerService,
    private messageHandler: MessageHandlerService,
    private usersService: UsersService,
    private usersResourcesService: UserResourceService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getUserPermision();
    this.updateUserResourceAccessNumber();
    this.getAllProducts();
  }

  public getUserPermision() {

    let resource = new ResourceModel();
    resource.urlName = this.router.url;
    resource.name = this.router.url;

    this.usersService.userPermission(localStorage.getItem('userId')!, resource).subscribe(
      response => {
        if (!response) {
          this.router.navigateByUrl('/unauthorized-error-401');
        }
      },
      error => {
        console.log(error);
        this.errorHandler.handleError(error);
      });
  }

  public updateUserResourceAccessNumber() {
    let resource = new ResourceModel();
    resource.urlName = this.router.url;
    resource.name = this.router.url;

    this.usersResourcesService.updateUserResourceAccessNumber(localStorage.getItem('userId')!, resource).subscribe(
      response => {

      },
      error => {
        console.log(error);
        this.errorHandler.handleError(error);
      });

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

  getProductIcon(sbimVaccinesId: string) {

    if (sbimVaccinesId == "" || sbimVaccinesId == null) {
      return "OUTRO"
    } else {
      return "VACINA"
    }
  }

  public getAllProducts(): void {
    this.productsDispatcherService.getAllProducts()
      .subscribe(products => {

        this.dataSource = new MatTableDataSource(products);
        this.dataSource.paginator = this.paginatorProduct;
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
          this.dataSource.paginator = this.paginatorProduct;
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
    this.dataSourceDoses.paginator = this.paginatorDoses;
    this.dataSourceDoses.sort = this.sort;

    this.dataSourceBatches = new MatTableDataSource();
    this.dataSourceBatches.sort = this.sort;

    this.sbimVaccinesId = '';
    this.informationField = "";
    this.inputIsDisabled = false;
    this.tabIsDisabled = true;
    this.tabDoseIsDisabled = true;
    this.isNameProductReadonly = false;
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

          if (this.sbimVaccinesId == null || this.sbimVaccinesId == "") {
            this.isNameProductReadonly = false;
          } else {
            this.isNameProductReadonly = true;
          }

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
          this.dataSourceDoses.paginator = this.paginatorDoses;
          this.dataSourceDoses.sort = this.sort;
        },
        error => {
          console.log(error);
        });

    this.productsSummariesBatchesDispatcherService.getProductsSummariesBatchesByProductId(id)
      .subscribe(
        result => {
          this.dataSourceBatches = new MatTableDataSource(result);
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
      this.messageHandler.showMessage("Campos obrigatórios não preenchidos, verifique!", "warning-snackbar");
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
          this.createButtonLoading = false;

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
      this.messageHandler.showMessage("Campos obrigatórios não preenchidos, verifique!", "warning-snackbar");
      return;
    }

    this.productsDispatcherService.updateProduct(this.productId, product)
      .subscribe(
        response => {

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
  }

  public openDoseDialog(): void {
    this.dialogRef = this.dialog.open(DialogContentDose, {
      disableClose: true,
      width: '40vw',
      data: {
        ID: this.productId
      },
    });

    this.dialogRef.afterClosed()
      .subscribe(result => {
        if (result != "") {
          this.dataSourceDoses = new MatTableDataSource(result);
          this.dataSourceDoses.paginator = this.paginatorDoses;
          this.dataSourceDoses.sort = this.sort;
        }
      });
  }

  public openUpdateProductDosesDialog(id: string): void {
    this.dialogRef = this.dialog.open(UpdateDialogContentDose, {
      disableClose: true,
      width: '40vw',
      data: {
        ID: id
      },
    });

    this.dialogRef.afterClosed().subscribe(
      (res) => {
        if (res != "") {
          this.dataSourceDoses = new MatTableDataSource(res);
          this.dataSourceDoses.paginator = this.paginatorDoses;
          this.dataSourceDoses.sort = this.sort;
        }
      }
    );
  }

  public deleteProductDoses(id: string) {

    const dialogRef = this.dialog.open(ConfirmProductDosesRemoveDialog);

    dialogRef.afterClosed().subscribe(result => {
      if (!!result) {
        this.productsDosesDispatcherService.deleteProductDoses(id).subscribe(
          success => {
            this.dataSourceDoses = new MatTableDataSource(success);
            this.dataSourceDoses.paginator = this.paginatorDoses;
            this.dataSourceDoses.sort = this.sort;
            this.messageHandler.showMessage("Dose removida com sucesso!", "success-snackbar")
          },
          error => {
            console.log(error);
            this.errorHandler.handleError(error);
          });
      }
    });
  }

  public searchVaccineByAutocomplete() {
    this.filteredOptions = this.productForm.controls.SbimVaccinesId.valueChanges.pipe(
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
          return option.Name.toLowerCase().indexOf(val.toString().toLowerCase()) === 0
        }))
      )
  }

  public displayState(state: any) {
    return state && state.Name ? state.Name : '';
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

  public getTotalUnits() {
    return this.dataSourceBatches.data.map(t => t.NumberOfUnitsBatch).reduce((acc, value) => acc + value, 0);
  }

  public isExpired(numberOfUnitsBatch: number, validityBatchDate: string) {

    let validityDate = new Date(validityBatchDate);
    let dateNow = new Date();
    if (numberOfUnitsBatch > 0 && validityDate.getTime() < dateNow.getTime()) {
      return true;
    } else {
      return false;
    }
  }
}

//DIALOG ADD DOSES
@Component({
  selector: 'dialog-content-dose',
  templateUrl: 'dialog-content-dose.html',
})
export class DialogContentDose implements OnInit {

  public productsId!: string;
  public doseType!: string;
  public doseRangeMonth!: number;

  public isDoseRangeMonthDisabled = false;

  //Form de doses
  public productDosesForm: FormGroup = this.formBuilder.group({
    DoseType: [null, [Validators.required]],
    DoseRangeMonth: [null]
  });


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private productsDosesDispatcherService: ProductsDosesDispatcherService,
    private messageHandler: MessageHandlerService,
    public dialogRef: MatDialogRef<DialogContentDose>
  ) { }

  ngOnInit(): void {
    this.productsId = this.data.ID;
  }

  onSelectionChanged(value: any) {
    if (value == "D1") {
      this.isDoseRangeMonthDisabled = true;
    } else if (value == "DU") {
      this.isDoseRangeMonthDisabled = true;
    } else {
      this.isDoseRangeMonthDisabled = false;
    }
  }

  public saveProductDoses(): void {

    if (!this.productDosesForm.valid) {
      console.log(this.productDosesForm);
      this.productDosesForm.markAllAsTouched();
      this.messageHandler.showMessage("Campos obrigatórios não preenchidos, verifique!", "warning-snackbar");
      return;
    }

    let productDoses = new ProductDosesModel();
    productDoses.doseType = this.doseType;;
    productDoses.doseRangeMonth = this.doseRangeMonth;
    productDoses.productsId = this.productsId;

    this.productsDosesDispatcherService.createProductDoses(productDoses).subscribe(
      response => {
        this.dialogRef.close(response);
        this.messageHandler.showMessage("Dose incluída com sucesso!", "success-snackbar")
      },
      error => {
        this.dialogRef.close();
        console.log(error);
      });
  }

}

//DIALOG UPDATE DOSES
@Component({
  selector: 'update-dialog-content-dose',
  templateUrl: 'update-dialog-content-dose.html',
})
export class UpdateDialogContentDose implements OnInit {

  public id!: string;
  public productsId!: string;
  public doseType!: string;
  public doseRangeMonth!: number;

  public isDoseRangeMonthDisabled = false;

  //Form de doses
  public productDosesForm: FormGroup = this.formBuilder.group({
    DoseType: [null, [Validators.required]],
    DoseRangeMonth: [null]
  });


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private productsDosesDispatcherService: ProductsDosesDispatcherService,
    private messageHandler: MessageHandlerService,
    public dialogRef: MatDialogRef<DialogContentDose>
  ) { }

  onSelectionChanged(value: any) {
    if (value == "D1") {
      this.isDoseRangeMonthDisabled = true;
    } else if (value == "DU") {
      this.isDoseRangeMonthDisabled = true;
    } else {
      this.isDoseRangeMonthDisabled = false;
    }
  }

  ngOnInit(): void {
    this.id = this.data.ID;
    this.getProductDosesById(this.id);
  }

  getProductDosesById(id: string): void {
    this.productsDosesDispatcherService.getProductDosesById(id).subscribe(
      result => {

        this.id = result.ID;
        this.productsId = result.ProductsId;
        this.doseType = result.DoseType;
        this.doseRangeMonth = result.DoseRangeMonth;

        if (this.doseType == "D1") {
          this.isDoseRangeMonthDisabled = true;
        } else if (this.doseType == "DU") {
          this.isDoseRangeMonthDisabled = true;
        } else {
          this.isDoseRangeMonthDisabled = false;
        }

      },
      error => {
        console.log(error);
      });
  }

  public updateProductDoses(): void {

    if (!this.productDosesForm.valid) {
      this.productDosesForm.markAllAsTouched();
      this.messageHandler.showMessage("Campos obrigatórios não preenchidos, verifique!", "warning-snackbar");
      return;
    }

    let productDoses = new ProductDosesModel();
    productDoses.id = this.id;
    productDoses.productsId = this.productsId;
    productDoses.doseType = this.doseType;;
    productDoses.doseRangeMonth = this.doseRangeMonth;

    this.productsDosesDispatcherService.updateProductDoses(this.id, productDoses)
      .subscribe(
        response => {
          this.dialogRef.close(response);
          this.messageHandler.showMessage("Dose alterada com sucesso!", "success-snackbar")
        },
        error => {
          this.dialogRef.close();
          console.log(error);
        });
  }

}

@Component({
  selector: 'confirm-product-remove-dialog',
  templateUrl: './confirm-product-remove-dialog.html',
})
export class ConfirmProductRemoveDialog { }

@Component({
  selector: 'confirm-product-doses-remove-dialog',
  templateUrl: './confirm-product-doses-remove-dialog.html',
})
export class ConfirmProductDosesRemoveDialog { }
