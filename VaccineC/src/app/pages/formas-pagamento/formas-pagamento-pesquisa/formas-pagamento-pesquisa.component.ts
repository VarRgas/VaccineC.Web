import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { IPaymentForm } from 'src/app/interfaces/i-payment-form';
import { PaymentFormsService } from 'src/app/services/payment-form.service';

@Component({
  selector: 'app-formas-pagamento-pesquisa',
  templateUrl: './formas-pagamento-pesquisa.component.html',
  styleUrls: ['./formas-pagamento-pesquisa.component.scss']
})

export class FormasPagamentoPesquisaComponent implements OnInit {

  public displayedColumns: string[] = ['Name', 'MaximumInstallments', 'Options'];
  public value = '';
  public dataSource = new MatTableDataSource<IPaymentForm>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private paymentFormsService: PaymentFormsService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
  }

  loadPaymentFormData() {
    this.paymentFormsService.getAll().subscribe(
      paymentForms => {
        this.dataSource = new MatTableDataSource(paymentForms);

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        console.log(paymentForms);
      },
      error => {
        console.log(error);
      });
  }
}