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

  @ViewChild('paginatorExpiredBatch') paginatorExpiredBatch!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private productsSummariesBatchesDispatcherService: ProductsSummariesBatchesDispatcherService,
    private errorHandler: ErrorHandlerService,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.getAllSummaryBatchs();
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
