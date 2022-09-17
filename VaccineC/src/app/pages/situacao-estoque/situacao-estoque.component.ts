import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { IBatch } from 'src/app/interfaces/i-batch';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { ProductsSummariesBatchesDispatcherService } from 'src/app/services/product-summary-batch-dispatcher.service';

@Component({
  selector: 'app-situacao-estoque',
  templateUrl: './situacao-estoque.component.html',
  styleUrls: ['./situacao-estoque.component.scss']
})
export class SituacaoEstoqueComponent implements OnInit {

  //Controle para o spinner do button
  public searchButtonLoading = false;

  //Controle de exibição dos IDs na Table
  public show: boolean = true;

  //Table lotes a vencer
  public value = '';
  public displayedColumns: string[] = ['Product', 'Batch', 'ValidityBatchDate', 'Warning', 'ID'];
  public dataSource = new MatTableDataSource<IBatch>();

  //Table Abaixo do estoque minimo
  public displayedColumns2: string[] = ['Product', 'Batch', 'MinimumStock', 'Total', 'ID'];
  public dataSource2 = new MatTableDataSource<IBatch>();

  @ViewChild('paginatorExpiredBatch') paginatorExpiredBatch!: MatPaginator;
  @ViewChild('paginatorBelowMinimumStock') paginatorBelowMinimumStock!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private productsSummariesBatchesDispatcherService: ProductsSummariesBatchesDispatcherService,
    private errorHandler: ErrorHandlerService,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.getAllSummaryBatchs();
    this.getBatchsBelowMinimumStock();
  }

  public getAllSummaryBatchs(): void {
    this.productsSummariesBatchesDispatcherService.getAllProductsSummariesBatches()
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
}
