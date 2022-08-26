import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GlobalErrorDialog } from '../shared/components/global-error-dialog/global-error-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
    providedIn: 'root'
})

export class ErrorHandlerService {
    public errorMessage: string = '';

    constructor(private router: Router, public dialog: MatDialog, private snackBar: MatSnackBar) { }

    public handleError = (error: HttpErrorResponse) => {
        if (error.status === 0) {
            this.handle0Error(error);
        }
        else if (error.status === 404) {
            this.handle404Error(error);
        }
        else if (error.status === 401) {
            this.handle401Error(error);
        }
        else if (error.status === 409) {
            this.handle409Error(error);
        }
        else if (error.status === 500) {
            this.handle500Error(error);
        }
        else {
            this.handleOtherError(error);
        }
    }

    private handle0Error = (error: HttpErrorResponse) => {
        this.errorMessage = "Não foi possível conectar-se ao servidor."
        this.createErrorMessage(error);
    }

    private handle404Error = (error: HttpErrorResponse) => {
        this.router.navigate(['/', 'not-found-404']);
    }

    private handle401Error = (error: HttpErrorResponse) => {
        this.router.navigate(['/', 'unauthorized-error-401']);
    }

    private handle409Error = (error: HttpErrorResponse) => {
        this.errorMessage = "O registro que você tentou editar foi modificado por outro usuário depois que você obteve o valor original. Se você ainda deseja editar este registro, atualize esta página."
        this.createErrorMessage(error);
    }

    private handle500Error = (error: HttpErrorResponse) => {
        this.errorMessage = "Ocorreu um erro inesperado!"
        this.createErrorMessage(error);
    }

    private handleOtherError = (error: HttpErrorResponse) => {
        this.errorMessage = error.error ? error.error : error.statusText;
        this.createErrorMessage(error);
    }

    private createErrorMessage = (error: HttpErrorResponse) => {
        this.snackBar.open(this.errorMessage, 'Ok', {
            horizontalPosition: 'right',
            verticalPosition: 'bottom',
            duration: 8000,
            panelClass: ['danger-snackbar']
        });
    }

}
