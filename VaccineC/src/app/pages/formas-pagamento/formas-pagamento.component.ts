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
import { MessageHandlerService } from 'src/app/services/message-handler.service';
import { PaymentFormsDispatcherService } from 'src/app/services/payment-forms-dispatcher.service';

@Component({
  selector: 'app-formas-pagamento',
  templateUrl: './formas-pagamento.component.html',
  styleUrls: ['./formas-pagamento.component.scss']
})
export class FormasPagamentoComponent implements OnInit {

  //Controle para o spinner do button
  searchButtonLoading = false;
  createButtonLoading = false;

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
    private paymentFormsService: PaymentFormsDispatcherService,
    private snackBar: MatSnackBar,
    private errorHandler: ErrorHandlerService,
    private messageHandler: MessageHandlerService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getAllPaymentForms();
  }

  loadPaymentFormData() {

    this.searchButtonLoading = true;

    if (this.searchNamePaymentForm == "" || this.searchNamePaymentForm == null || this.searchNamePaymentForm == undefined) {
      this.getAllPaymentForms();
    } else {
      this.getPaymentFormsByName();
    }
  }

  createUpdatePaymentForm(): void {

    this.createButtonLoading = true;

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
        this.searchButtonLoading = false;
      },
      error => {
        console.log(error);
        this.errorHandler.handleError(error);
        this.searchButtonLoading = false;
      });
  }

  getPaymentFormsByName(): void {

    this.paymentFormsService.getByName(this.searchNamePaymentForm).subscribe(
      resources => {
        this.dataSource = new MatTableDataSource(resources);
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

  createPaymentForm(): void {

    if (!this.paymentFormForm.valid) {
      console.log(this.paymentFormForm);
      this.createButtonLoading = false;
      this.paymentFormForm.markAllAsTouched();
      this.messageHandler.showMessage("Campos obrigatórios não preenchidos, verifique!", "warning-snackbar")
      return;
    }

    const data = this.paymentFormForm.value;
    data.HasPending = false;

    this.paymentFormsService.create(data)
      .subscribe(
        response => {
          this.messageHandler.showMessage("Forma de Pagamento criada com sucesso!", "success-snackbar")
          this.IdPaymentForm = response;
          this.createButtonLoading = false;
          this.getAllPaymentForms();
        },
        error => {
          console.log(error);
          this.errorHandler.handleError(error);
          this.createButtonLoading = false;
        });
  }

  updatePaymentForm(): void {

    let paymentForm = new PaymentFormModel
    paymentForm.id = this.IdPaymentForm;
    paymentForm.name = this.Name;
    paymentForm.maximumInstallments = this.MaximumInstallments;

    if (!this.paymentFormForm.valid) {
      console.log(this.paymentFormForm);
      this.createButtonLoading = false;
      this.paymentFormForm.markAllAsTouched();
      this.messageHandler.showMessage("Campos obrigatórios não preenchidos, verifique!", "warning-snackbar")
      return;
    }

    this.paymentFormsService.update(this.IdPaymentForm, paymentForm)
      .subscribe(
        response => {
          this.messageHandler.showMessage("Forma de Pagamento alterada com sucesso!", "success-snackbar")
          this.IdPaymentForm = response;
          this.createButtonLoading = false;
          this.getAllPaymentForms();
        },
        error => {
          this.errorHandler.handleError(error);
          console.log(error);
          this.createButtonLoading = false;
        });
  }

  deletePaymentForm(): void {

    const dialogRef = this.dialog.open(ConfirmPaymentFormRemoveDialog);

    dialogRef.afterClosed().subscribe(result => {
      if (!!result) {
        this.paymentFormsService.delete(this.IdPaymentForm).subscribe(
          success => {
            this.paymentFormForm.reset();
            this.paymentFormForm.clearValidators();
            this.paymentFormForm.updateValueAndValidity();
            this.getAllPaymentForms();
            this.messageHandler.showMessage("Forma de Pagamento removida com sucesso!", "success-snackbar")
          },
          error => {
            console.log(error);
            this.errorHandler.handleError(error);
          });
      }
    });

  }

  editPaymentForm(id: string): void {

    this.paymentFormsService.getById(id).subscribe(
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