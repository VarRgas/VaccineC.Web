import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { IPaymentForm } from 'src/app/interfaces/i-payment-form';
import { PaymentFormsService } from 'src/app/services/payment-form.service';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';

@Component({
  selector: 'app-formas-pagamento-pesquisa',
  templateUrl: './formas-pagamento-pesquisa.component.html',
  styleUrls: ['./formas-pagamento-pesquisa.component.scss']
})

export class FormasPagamentoPesquisaComponent implements OnInit {

  public searchNamePaymentForm!: string;

  public displayedColumns: string[] = ['Name', 'MaximumInstallments', 'Options'];
  public value = '';
  public dataSource = new MatTableDataSource<IPaymentForm>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private paymentFormsService: PaymentFormsService,
    private snackBar: MatSnackBar,
    private errorHandler: ErrorHandlerService
  ) { }

  ngOnInit(): void {
  }

  loadPaymentFormData() {

    if (this.searchNamePaymentForm == "" || this.searchNamePaymentForm == null || this.searchNamePaymentForm == undefined) {

      this.paymentFormsService.getAll().subscribe(
        paymentForms => {
          this.dataSource = new MatTableDataSource(paymentForms);

          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;

          console.log(paymentForms);
        },
        error => {
          console.log(error);
          this.errorHandler.handleError(error);
        });

    } else {

      this.paymentFormsService.getByName(this.searchNamePaymentForm).subscribe(
        resources => {
          this.dataSource = new MatTableDataSource(resources);

          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;

          console.log(resources);
        },
        error => {
          console.log(error);
          this.errorHandler.handleError(error);
        });
    }
  }
}