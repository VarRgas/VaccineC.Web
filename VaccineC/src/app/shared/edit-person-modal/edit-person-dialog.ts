import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { MessageHandlerService } from 'src/app/services/message-handler.service';

@Component({
    selector: 'edit-person-dialog',
    templateUrl: './edit-person-dialog.html',
    styleUrls: ['./edit-person-dialog.scss']
})
export class EditPersonDialog implements OnInit {

    public personId!: string;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private formBuilder: FormBuilder,
        public dialogRef: MatDialogRef<EditPersonDialog>,
        private messageHandler: MessageHandlerService,
        private errorHandler: ErrorHandlerService,

    ) { }

    ngOnInit(): void {
        this.personId = this.data.PersonId;
        console.log(this.personId);
    }

}
