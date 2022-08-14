import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-minha-conta',
  templateUrl: './minha-conta.component.html',
  styleUrls: ['./minha-conta.component.scss']
})
export class MinhaContaComponent implements OnInit {

  password: string | undefined;

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
    if (document.getElementById('sidebarToggle')?.classList.contains('withdrawn')) {
      document.getElementById('center')?.classList.add('container-expand');
      document.getElementById('center')?.classList.remove('container-retract');

    } else {
      document.getElementById('center')?.classList.add('container-retract');
      document.getElementById('center')?.classList.remove('container-expanded');

    }
  }

  openPasswordDialog() {
    const dialogRef = this.dialog.open(PasswordDialog, { width: '40vw' });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}


@Component({
  selector: 'password-dialog',
  templateUrl: 'password-dialog.html',
})
export class PasswordDialog { }