import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { SnackBarComponent } from "../pages/snackbar/snack-bar.component";

@Injectable({
    providedIn: 'root'
})

export class MessageHandlerService {

    constructor(
        private snackBar: MatSnackBar
    ) { }

    public showMessage = (message: string, panelClass: string) => {
        let action = 'Ok';
        return this.snackBar.openFromComponent(SnackBarComponent, {
            data: { message, action },
            duration: 5000,
            horizontalPosition: 'right',
            verticalPosition: 'bottom',
            panelClass: [panelClass]
        });
    }

}