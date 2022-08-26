import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable({
    providedIn: 'root'
})

export class MessageHandlerService {

    constructor(
        private snackBar: MatSnackBar
    ) { }

    public showMessage = (message: string, panelClass: string) => {
        this.snackBar.open(message, 'Ok', {
            horizontalPosition: 'right',
            verticalPosition: 'bottom',
            duration: 5000,
            panelClass: [panelClass]
        });
    }
}