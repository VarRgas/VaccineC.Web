import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ResourcesService } from 'src/app/services/resources.service';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-recursos-cadastro',
  templateUrl: './recursos-cadastro.component.html',
  styleUrls: ['./recursos-cadastro.component.scss']
})
export class RecursosCadastroComponent implements OnInit {

  public IdResource!: string;

  resourceForm: FormGroup = this.formBuilder.group({
    IdResource: [null],
    Name: [null, [Validators.required, Validators.maxLength(255)]],
    UrlName: [null, [Validators.required, Validators.maxLength(255)]],
  });

  constructor(
    private formBuilder: FormBuilder,
    private resourcesService: ResourcesService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private errorHandler: ErrorHandlerService
  ) { }

  ngOnInit(): void {
  }

  createResource(): void {

    if (!this.resourceForm.valid) {
      console.log(this.resourceForm);
      return;
    }

    const data = this.resourceForm.value;
    data.HasPending = false;
    console.log(data);

    this.resourcesService.create(data)
      .subscribe(
        response => {
          console.log(response);
          this.snackBar.open("Recurso criado com sucesso!", 'Ok', {
            horizontalPosition: 'right',
            verticalPosition: 'bottom',
            duration: 5000,
            panelClass: ['success-snackbar']
          });
          this.IdResource = response;
        },
        error => {
          console.log(error);
          this.errorHandler.handleError(error);
        });
  }

  deleteResource(): void {

    const dialogRef = this.dialog.open(ConfirmResourceRemoveDialog);

    dialogRef.afterClosed().subscribe(result => {
      if (!!result) {
        this.resourcesService.delete(this.IdResource).subscribe(
          success => {
            this.resourceForm.reset();

            this.snackBar.open("Recurso removido com sucesso!", 'Ok!', {
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
  selector: 'confirm-resource-remove-dialog',
  templateUrl: './confirm-resource-remove-dialog.html',
})
export class ConfirmResourceRemoveDialog { }
