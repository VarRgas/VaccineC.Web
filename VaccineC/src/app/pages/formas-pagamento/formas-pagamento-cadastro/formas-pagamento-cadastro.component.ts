import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { PaymentFormsService } from 'src/app/services/payment-form.service';

@Component({
  selector: 'app-formas-pagamento-cadastro',
  templateUrl: './formas-pagamento-cadastro.component.html',
  styleUrls: ['./formas-pagamento-cadastro.component.scss']
})
export class FormasPagamentoCadastroComponent implements OnInit {

  public IdPaymentForm!: string;

  paymentFormForm: FormGroup = this.formBuilder.group({
    IdPaymentForm: [null],
    Name: [null, [Validators.required, Validators.maxLength(255)]],
    MaximumInstallments: [null, [Validators.required]],
  });

  constructor(
    private formBuilder: FormBuilder,
    private paymentFormService: PaymentFormsService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private errorHandler: ErrorHandlerService
  ) { }

  ngOnInit(): void {
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
        },
        error => {
          console.log(error);
          this.errorHandler.handleError(error);
        });
  }

  deletePaymentForm(): void {

    const dialogRef = this.dialog.open(ConfirmPaymentFormRemoveDialog);

    dialogRef.afterClosed().subscribe(result => {
      if (!!result) {
        this.paymentFormService.delete(this.IdPaymentForm).subscribe(
          success => {
            this.paymentFormForm.reset();

            this.snackBar.open("Forma de Pagamento removida com sucesso!", 'Ok!', {
              horizontalPosition: 'right',
              verticalPosition: 'bottom',
              duration: 5000,
              panelClass: ['success-snackbar']
            });
          },
          error => {
            console.log(error);
            this.errorHandler.handleError(error);
          });
      }
    });

  }

}

@Component({
  selector: 'confirm-payment-form-remove-dialog',
  templateUrl: './confirm-payment-form-remove-dialog.html',
})
export class ConfirmPaymentFormRemoveDialog { }