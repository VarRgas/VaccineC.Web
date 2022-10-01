import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { IBatch } from 'src/app/interfaces/i-batch';
import { IDiscard } from 'src/app/interfaces/i-discard';
import { IProductSummariesBatches } from 'src/app/interfaces/i-product-summaty-batch';
import { AuthorizationsDispatcherService } from 'src/app/services/authorization-dispatcher.service';
import { DiscardsDispatcherService } from 'src/app/services/discards-dispatcher.service';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { MessageHandlerService } from 'src/app/services/message-handler.service';
import { ProductsSummariesBatchesDispatcherService } from 'src/app/services/product-summary-batch-dispatcher.service';

@Component({
  selector: 'app-situacao-estoque',
  templateUrl: './situacao-estoque.component.html',
  styleUrls: ['./situacao-estoque.component.scss']
})
export class SituacaoEstoqueComponent implements OnInit {

  currentMonth!: string;

  //Controle para o spinner do button
  public searchButtonLoading = false;

  //Controle de exibição dos IDs na Table
  public show: boolean = true;

  //Table lotes a vencer
  public displayedColumns: string[] = ['Product', 'Batch', 'ValidityBatchDate', 'Warning', 'ID'];
  public dataSource = new MatTableDataSource<IBatch>();

  //Table Abaixo do estoque minimo
  public displayedColumns2: string[] = ['ProductName', 'MinimumStock', 'TotalUnits', 'Warning', 'ProductId'];
  public dataSource2 = new MatTableDataSource<IBatch>();

  //Table Projeção
  public displayedColumns3: string[] = ['ProductName', 'TotalAuthorizationsMonth', 'TotalUnitsProduct', 'TotalUnitsAfterApplication', 'Warning', 'ProductId'];
  public dataSource3 = new MatTableDataSource<IBatch>();

  //Table Descartes
  public displayedColumns4: string[] = ['Batch', 'User' ,'Register', 'DiscardedUnits', 'ID'];
  public dataSource4 = new MatTableDataSource<IDiscard>();

  @ViewChild('paginatorExpiredBatch') paginatorExpiredBatch!: MatPaginator;
  @ViewChild('paginatorBelowMinimumStock') paginatorBelowMinimumStock!: MatPaginator;
  @ViewChild('paginatorProjection') paginatorProjection!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  public dialogRef?: MatDialogRef<any>;

  constructor(
    private productsSummariesBatchesDispatcherService: ProductsSummariesBatchesDispatcherService,
    private authorizationsDispatcherService: AuthorizationsDispatcherService,
    private discardsDispatcherService: DiscardsDispatcherService,
    private errorHandler: ErrorHandlerService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.getCurrentDate();
    this.getNotEmptySummaryBatchs();
    this.getBatchsBelowMinimumStock();
    this.getSummarySituationAuthorization();
    this.getDiscards();
  }

  public getCurrentDate(): void {
    const now = new Date();
    this.currentMonth = `${this.formatMonth(now.getMonth().toString())}/${now.getFullYear()}`
  }

  public getMinimumDanger(minimumStock: number, units: number): boolean {
    let halfOfminimumStock = minimumStock / 2;
    if (units < halfOfminimumStock) {
      return false;
    } else {
      return true;
    }
  }

  public getSummarySituationAuthorization(): void {
    this.authorizationsDispatcherService.GetSummarySituationAuthorization()
      .subscribe(
        response => {
          this.dataSource3 = new MatTableDataSource(response);
          this.dataSource3.paginator = this.paginatorProjection;
        },
        error => {
          console.log(error);
          this.errorHandler.handleError(error);
        });
  }

  public getNotEmptySummaryBatchs(): void {
    this.productsSummariesBatchesDispatcherService.getNotEmptyProductsSummariesBatches()
      .subscribe(
        batchs => {
          this.dataSource = new MatTableDataSource(batchs);
          this.dataSource.paginator = this.paginatorExpiredBatch;
        },
        error => {
          console.log(error);
          this.errorHandler.handleError(error);
        });
  }

  public getBatchsBelowMinimumStock(): void {
    this.productsSummariesBatchesDispatcherService.getAllBatchsBelowMinimumStock()
      .subscribe(
        batchs => {
          this.dataSource2 = new MatTableDataSource(batchs);
          this.dataSource2.paginator = this.paginatorBelowMinimumStock;
          this.searchButtonLoading = false;
        },
        error => {
          console.log(error);
          this.errorHandler.handleError(error);
          this.searchButtonLoading = false;
        });
  }

  public getDiscards(): void{
    this.discardsDispatcherService.getAllDiscards()
    .subscribe(
      discards => {
        console.log(discards)
        this.dataSource4 = new MatTableDataSource(discards);
        this.dataSource4.sort = this.sort;
      },
      error => {
        console.log(error);
        this.errorHandler.handleError(error);
      });
  }

  getTotalUnitsDiscarded(){
    return this.dataSource4.data.map(t => t.DiscardedUnits).reduce((acc, value) => acc + value, 0);

  }

  getSituationValidityDanger(validityBatchDate: string) {

    const validityBatchDateFormat = new Date(validityBatchDate);
    const dateNow = new Date();

    if (validityBatchDateFormat < dateNow) {
      return false;
    }

    return true;
  }

  getSituationValidityWarning(validityBatchDate: string) {

    const validityBatchDateFormat = new Date(validityBatchDate);
    const dateNow = new Date();

    if (validityBatchDateFormat > dateNow && validityBatchDateFormat.getMonth() == dateNow.getMonth() && validityBatchDateFormat.getFullYear() == dateNow.getFullYear()) {
      return false;
    }

    return true;
  }

  public isUnitsAfterApplicationZero(totalUnitsAfterApplication: number): boolean {

    if (totalUnitsAfterApplication == 0) {
      return false;
    }

    return true;
  }

  public isUnitsAfterApplicationUnderZero(totalUnitsAfterApplication: number): boolean {

    if (totalUnitsAfterApplication < 0) {
      return false;
    }

    return true;
  }

  public openInformationBatch(id: string): void {
    this.dialogRef = this.dialog.open(BatchInformationDialog, {
      disableClose: true,
      width: '50vw',
      data: {
        ID: id
      },
    });
  }

  public openInformationProductBatchs(productName: string, productId: string): void {
    this.dialogRef = this.dialog.open(ProductBatchsInformationDialog, {
      disableClose: true,
      width: '80vw',
      data: {
        ProductName: productName,
        ProductId: productId
      },
    });
  }

  public formatMonth(month: string): string {

    let response = "";

    switch (month) {
      case "0":
        response = "Janeiro"
        break;
      case "1":
        response = "Fevereiro"
        break;
      case "2":
        response = "Março"
        break;
      case "3":
        response = "Abril"
        break;
      case "4":
        response = "Maio"
        break;
      case "5":
        response = "Junho"
        break;
      case "6":
        response = "Julho"
        break;
      case "7":
        response = "Agosto"
        break;
      case "8":
        response = "Setembro"
        break;
      case "9":
        response = "Outubro"
        break;
      case "10":
        response = "Novembro"
        break;
      case "12":
        response = "Dezembro"
        break;
      default:
        response = ""
        break;
    }

    return response;
  }

}

@Component({
  selector: 'batch-information-dialog',
  templateUrl: 'batch-information-dialog.html',
})
export class BatchInformationDialog implements OnInit {

  id!: string;
  ValidityBatchDate!: Date;
  ManufacturingDate!: Date;
  Batch!: string;
  Manufacturer!: string;
  NumberOfUnitsBatch!: number;
  Product!: string;

  ngOnInit(): void {
    this.id = this.data.ID;
    this.getProductSummaryBatchById(this.id);
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<BatchInformationDialog>,
    private messageHandler: MessageHandlerService,
    private productSummaryBatchDispatcherService: ProductsSummariesBatchesDispatcherService,
  ) { }

  public getProductSummaryBatchById(id: string): void {
    this.productSummaryBatchDispatcherService.getProductsSummariesBatchesById(id).subscribe(
      productSummaryBatch => {
        this.Batch = productSummaryBatch.Batch;
        this.Manufacturer = productSummaryBatch.Manufacturer;
        this.ValidityBatchDate = productSummaryBatch.ValidityBatchDate;
        this.ManufacturingDate = productSummaryBatch.ManufacturingDate;
        this.NumberOfUnitsBatch = productSummaryBatch.NumberOfUnitsBatch;
        this.Product = productSummaryBatch.Products.Name;
      },
      error => {
        console.log(error);
      });
  }

}

@Component({
  selector: 'product-batchs-information-dialog',
  templateUrl: 'product-batchs-information-dialog.html',
})
export class ProductBatchsInformationDialog implements OnInit {

  ProductId!: string;
  ProductName!: string;

  //Batches table
  public displayedColumnsBatches: string[] = ['Batch', 'ManufacturingDate', 'ValidityBatchDate', 'NumberOfUnitsBatch', 'Warning'];
  public dataSourceBatches = new MatTableDataSource<IProductSummariesBatches>();

  ngOnInit(): void {
    this.ProductId = this.data.ProductId;
    this.ProductName = this.data.ProductName;
    this.getProductSummaryBatchByProductId(this.ProductId);
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<BatchInformationDialog>,
    private productSummaryBatchDispatcherService: ProductsSummariesBatchesDispatcherService,
  ) { }

  public getProductSummaryBatchByProductId(productId: string): void {
    this.productSummaryBatchDispatcherService.getProductsSummariesBatchesByProductId(productId).subscribe(
      productsSummariesBatches => {
        this.dataSourceBatches = new MatTableDataSource(productsSummariesBatches);
      },
      error => {
        console.log(error);
      });
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

  public getTotalUnits() {
    return this.dataSourceBatches.data.map(t => t.NumberOfUnitsBatch).reduce((acc, value) => acc + value, 0);
  }

}