import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { debounceTime, distinctUntilChanged, map, Observable, startWith, switchMap } from 'rxjs';
import { IProduct } from 'src/app/interfaces/i-product';
import { ProductModel } from 'src/app/models/product-model';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { MessageHandlerService } from 'src/app/services/message-handler.service';
import { ProductsDispatcherService } from 'src/app/services/products-dispatcher.service';
import { VaccinesAutocompleteDispatcherService } from 'src/app/services/vaccines-autocomplete-dispatcher.service';

@Component({
  selector: 'app-produto',
  templateUrl: './produto.component.html',
  styleUrls: ['./produto.component.scss']
})
export class ProdutoComponent implements OnInit {

  public myControl = new FormControl();
  public filteredOptions: Observable<any[]> | undefined;

  //Controle para o spinner do button
  public searchButtonLoading: boolean = false;
  public createButtonLoading: boolean = false;
  // public createPfButtonLoading: boolean = false;
  // public createPjButtonLoading: boolean = false;
  // public showSavePhysicalComplementsButton: boolean = false;
  // public showSaveJuridicalComplementsButton: boolean = false;

  //Controle de tabs
  public tabIsDisabled: boolean = true;
  public inputIsDisabled: boolean = false;

  //Controle de exibição dos IDs na Table
  public show: boolean = true;

  //Variáveis dos inputs
  public searchProductName!: string;
  public productId!: string;
  public sbimVaccinesId!: string;
  public situation!: string;
  public details!: string;
  public saleValue!: number;
  public register!: string;
  public name!: string;
  public informationField!: string;

  //Table search
  public value = '';
  public displayedColumns: string[] = ['Name', 'SaleValue', 'ID', 'Options'];
  public dataSource = new MatTableDataSource<IProduct>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  //Form de produtos
  public productForm: FormGroup = this.formBuilder.group({
    ProductId: [null],
    SbimVaccinesId: [null],
    Situation: [null, [Validators.email]],
    Details: [null],
    SaleValue: [null, [Validators.email]],
    Name: [null, [Validators.required, Validators.maxLength(255)]],
  });


  constructor(
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private productsDispatcherService: ProductsDispatcherService,
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
    this.informationField = "";

    this.inputIsDisabled = false;
    this.tabIsDisabled = true;
  }

  public editProduct(id: string): void {
    this.resetForms();

    this.productsDispatcherService.getProductById(id)
      .subscribe(
        product => {
          this.productId = product.ID;
          this.name = product.Name;
          this.informationField = product.Name;
          this.situation = product.Situation;
          this.details = product.Details;
          this.saleValue = product.SaleValue;
          this.details = product.Details;

          this.tabIsDisabled = false;
        },
        error => {
          console.log(error);
        });
  }

  public updateProduct(): void {

    if (!this.productForm.valid) {
      console.log(this.productForm);
      this.createButtonLoading = false;
      this.productForm.markAllAsTouched();
      this.messageHandler.showMessage("Campos obrigatórios não preenchidos, verifique!", "warning-snackbar")
      return;
    }

    let product = new ProductModel();
    product.id = this.productId;
    product.name = this.name;
    product.saleValue = this.saleValue;
    product.details = this.details;
    product.situation = this.situation;

    this.productsDispatcherService.updateProduct(this.productId, product)
      .subscribe(
        response => {
          this.productId = response.ID;
          this.name = response.Name;
          this.saleValue = response.SaleValue;
          this.details = response.Details;
          this.situation = response.Situation;

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


    this.productsDispatcherService.createProduct(product)
      .subscribe(
        response => {
          this.productId = response.ID;
          this.name = response.Name;
          this.saleValue = response.SaleValue;
          this.situation = response.Situation;
          this.details = response.Details;

          this.informationField = this.name;

          this.tabIsDisabled = false;
          this.createButtonLoading = false;

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

  public deleteProduct(): void {
    const dialogRef = this.dialog.open(ConfirmProductRemoveDialog);

    dialogRef.afterClosed()
      .subscribe(result => {
        if (!!result) {
          this.productsDispatcherService.deleteProduct(this.productId)
            .subscribe(
              success => {
                this.informationField = "";
                this.resetForms();
                this.tabIsDisabled = true;
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

  public displayState(state: any): void {
    console.log(state)
    return state.Name;
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
