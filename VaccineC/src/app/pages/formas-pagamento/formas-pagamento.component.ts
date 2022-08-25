import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { IPaymentForm } from 'src/app/interfaces/i-payment-form';
import { PaymentFormModel } from 'src/app/models/payment-form-model';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { PaymentFormsService } from 'src/app/services/payment-form.service';

@Component({
  selector: 'app-formas-pagamento',
  templateUrl: './formas-pagamento.component.html',
  styleUrls: ['./formas-pagamento.component.scss']
})
export class FormasPagamentoComponent implements OnInit {

  //Controle para o spinner do button
  loading = false;

  //Controle de exibição dos IDs na Table
  show: boolean = true;

  //Variáveis dos inputs
  public searchNamePaymentForm!: string;
  public IdPaymentForm!: string;
  public Name!: string;
  public MaximumInstallments!: number;

  //Table
  public displayedColumns: string[] = ['Name', 'MaximumInstallments', 'Options', 'ID'];
  public value = '';
  public dataSource = new MatTableDataSource<IPaymentForm>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  //Form
  paymentFormForm: FormGroup = this.formBuilder.group({
    IdPaymentForm: [null],
    Name: [null, [Validators.required, Validators.maxLength(255)]],
    MaximumInstallments: [null, [Validators.required]],
  });

  constructor(
    private paymentFormsService: PaymentFormsService,
    private snackBar: MatSnackBar,
    private errorHandler: ErrorHandlerService,
    private formBuilder: FormBuilder,
    private paymentFormService: PaymentFormsService,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.getAllPaymentForms();
  }

  loadPaymentFormData() {

    this.loading = true;

    if (this.searchNamePaymentForm == "" || this.searchNamePaymentForm == null || this.searchNamePaymentForm == undefined) {
      this.getAllPaymentForms();
    } else {
      this.getPaymentFormsByName();
    }
  }

  createUpdatePaymentForm(): void {

    if (this.IdPaymentForm == "" || this.IdPaymentForm == null || this.IdPaymentForm == undefined) {
      this.createPaymentForm();
    } else {
      this.updatePaymentForm();
    }
  }

  getAllPaymentForms(): void {
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

    this.loading = false;
  }

  getPaymentFormsByName(): void {

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

    this.loading = false;
  }

  createPaymentForm(): void {

    if (!this.paymentFormForm.valid) {
      console.log(this.paymentFormForm);
      return;
    }

    const data = this.paymentFormForm.value;
    data.HasPending = false;
    console.log(data);

    this.paymentFormService.create(data)
      .subscribe(
        response => {
          console.log(response);
          this.snackBar.open("Forma de Pagamento criada com sucesso!", 'Ok', {
            horizontalPosition: 'right',
            verticalPosition: 'bottom',
            duration: 5000,
            panelClass: ['success-snackbar']
          });
          this.IdPaymentForm = response;
          this.getAllPaymentForms();
        },
        error => {
          console.log(error);
          this.errorHandler.handleError(error);
        });
  }

  updatePaymentForm(): void {

    let paymentForm = new PaymentFormModel
    paymentForm.id = this.IdPaymentForm;
    paymentForm.name = this.Name;
    paymentForm.maximumInstallments = this.MaximumInstallments;

    if (!this.paymentFormForm.valid) {
      console.log(this.paymentFormForm);
      return;
    }

    this.paymentFormService.update(this.IdPaymentForm, paymentForm)
      .subscribe(
        response => {
          console.log(response);
          this.snackBar.open("Forma de Pagamento alterada com sucesso!", 'Ok', {
            horizontalPosition: 'right',
            verticalPosition: 'bottom',
            duration: 5000,
            panelClass: ['success-snackbar']
          });
          this.IdPaymentForm = response;
          this.getAllPaymentForms();
        },
        error => {
          this.errorHandler.handleError(error);
          console.log(error);
        });
  }

  deletePaymentForm(): void {

    const dialogRef = this.dialog.open(ConfirmPaymentFormRemoveDialog);

    dialogRef.afterClosed().subscribe(result => {
      if (!!result) {
        this.paymentFormService.delete(this.IdPaymentForm).subscribe(
          success => {
            this.paymentFormForm.reset();
            this.paymentFormForm.clearValidators();
            this.paymentFormForm.updateValueAndValidity();

            this.snackBar.open("Forma de Pagamento removida com sucesso!", 'Ok!', {
              horizontalPosition: 'right',
              verticalPosition: 'bottom',
              duration: 5000,
              panelClass: ['success-snackbar']
            });

            this.getAllPaymentForms();
          },
          error => {
            console.log(error);
            this.errorHandler.handleError(error);
          });
      }
    });

  }

  editPaymentForm(id: string): void {

    this.paymentFormService.getById(id).subscribe(
      paymentForm => {

        this.IdPaymentForm = paymentForm.ID;
        this.Name = paymentForm.Name;
        this.MaximumInstallments = paymentForm.MaximumInstallments;

        console.log(paymentForm)
        this.getAllPaymentForms();
      },
      error => {
        console.log(error);
      });
  }

  addNewPaymentForm(): void {
    this.paymentFormForm.reset();
    this.paymentFormForm.clearValidators();
    this.paymentFormForm.updateValueAndValidity();
  }

}

@Component({
  selector: 'confirm-payment-form-remove-dialog',
  templateUrl: './confirm-payment-form-remove-dialog.html',
})
export class ConfirmPaymentFormRemoveDialog { }