import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { IBatch } from 'src/app/interfaces/i-batch';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { MessageHandlerService } from 'src/app/services/message-handler.service';
import { PersonsPhonesDispatcherService } from 'src/app/services/person-phone-dispatcher.service';
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
  public displayedColumns2: string[] = ['Product', 'Batch', 'MinimumStock', 'Total', 'Warning', 'ID'];
  public dataSource2 = new MatTableDataSource<IBatch>();

  //Table Projeção
  public displayedColumns3: string[] = ['scheduling', 'date', 'product', 'quantityInStock', 'quantityAfterApplication'];
  public dataSource3 = new MatTableDataSource<IBatch>();

  @ViewChild('paginatorExpiredBatch') paginatorExpiredBatch!: MatPaginator;
  @ViewChild('paginatorBelowMinimumStock') paginatorBelowMinimumStock!: MatPaginator;
  @ViewChild('paginatorProjection') paginatorProjection!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  public dialogRef?: MatDialogRef<any>;

  constructor(
    private productsSummariesBatchesDispatcherService: ProductsSummariesBatchesDispatcherService,
    private errorHandler: ErrorHandlerService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.getCurrentDate();
    this.getNotEmptySummaryBatchs();
    this.getBatchsBelowMinimumStock();
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

  public getNotEmptySummaryBatchs(): void {
    this.productsSummariesBatchesDispatcherService.getNotEmptyProductsSummariesBatches()
      .subscribe(
        batchs => {
          this.dataSource = new MatTableDataSource(batchs);
          this.dataSource.paginator = this.paginatorExpiredBatch;
          this.dataSource.sort = this.sort;
          this.searchButtonLoading = false;
        },
        error => {
          console.log(error);
          this.errorHandler.handleError(error);
          this.searchButtonLoading = false;
        });
  }

  public getBatchsBelowMinimumStock(): void {
    this.productsSummariesBatchesDispatcherService.getAllBatchsBelowMinimumStock()
      .subscribe(
        batchs => {
          this.dataSource2 = new MatTableDataSource(batchs);
          this.dataSource2.paginator = this.paginatorBelowMinimumStock;
          this.dataSource2.sort = this.sort;
          this.searchButtonLoading = false;
        },
        error => {
          console.log(error);
          this.errorHandler.handleError(error);
          this.searchButtonLoading = false;
        });
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

  public openInformationBatch(id: string): void {
    this.dialogRef = this.dialog.open(BatchInformationDialog, {
      disableClose: true,
      width: '50vw',
      data: {
        ID: id
      },
    });
  }

  public formatMonth(month: string): string {
    console.log(month)
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
        console.log(productSummaryBatch)
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