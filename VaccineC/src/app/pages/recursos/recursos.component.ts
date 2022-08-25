import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { IResource } from 'src/app/interfaces/i-resource';
import { ResourceModel } from 'src/app/models/resource-model';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { ResourcesService } from 'src/app/services/resources.service';

@Component({
  selector: 'app-recursos',
  templateUrl: './recursos.component.html',
  styleUrls: ['./recursos.component.scss']
})

export class RecursosComponent implements OnInit {

  //Controle para o spinner do button
  loading = false;

  //Controle de exibição dos IDs na Table
  show: boolean = true;

  //Variáveis dos inputs
  public searchNameResource!: string;
  public IdResource!: string;
  public Name!: string;
  public UrlName!: string;

  //Table
  public value = '';
  public displayedColumns: string[] = ['Name', 'UrlName', 'ID', 'Options'];
  public dataSource = new MatTableDataSource<IResource>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  //Form
  resourceForm: FormGroup = this.formBuilder.group({
    IdResource: [null],
    Name: [null, [Validators.required, Validators.maxLength(255)]],
    UrlName: [null, [Validators.required, Validators.maxLength(255)]],
  });

  constructor(
    private resourcesService: ResourcesService,
    private errorHandler: ErrorHandlerService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.getAllResources();
  }

  loadResourceData() {

    this.loading = true;

    if (this.searchNameResource == "" || this.searchNameResource == null || this.searchNameResource == undefined) {
      this.getAllResources();
    } else {
      this.getResourcesByName();
    }

  }

  getAllResources(): void {

    this.resourcesService.getAll().subscribe(
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

  getResourcesByName(): void {

    this.resourcesService.getByName(this.searchNameResource).subscribe(
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

  createUpdateResource(): void {

    if (this.IdResource == "" || this.IdResource == null || this.IdResource == undefined) {
      this.createResource();
    } else {
      this.updateResource();
    }
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
          this.getAllResources();
        },
        error => {
          console.log(error);
          this.errorHandler.handleError(error);

        });
  }

  updateResource(): void {

    let resource = new ResourceModel();
    resource.id = this.IdResource;
    resource.name = this.Name;
    resource.urlName = this.UrlName;

    if (!this.resourceForm.valid) {
      console.log(this.resourceForm);
      return;
    }

    this.resourcesService.update(this.IdResource, resource)
      .subscribe(
        response => {
          console.log(response);
          this.snackBar.open("Recurso alterado com sucesso!", 'Ok', {
            horizontalPosition: 'right',
            verticalPosition: 'bottom',
            duration: 5000,
            panelClass: ['success-snackbar']
          });
          this.IdResource = response;
          this.getAllResources();
        },
        error => {
          this.errorHandler.handleError(error);
          console.log(error);
        });
  }

  deleteResource(): void {

    const dialogRef = this.dialog.open(ConfirmResourceRemoveDialog);

    dialogRef.afterClosed().subscribe(result => {
      if (!!result) {
        this.resourcesService.delete(this.IdResource).subscribe(
          success => {
            this.resourceForm.reset();
            this.resourceForm.clearValidators();
            this.resourceForm.updateValueAndValidity();

            this.snackBar.open("Recurso removido com sucesso!", 'Ok!', {
              horizontalPosition: 'right',
              verticalPosition: 'bottom',
              duration: 5000,
              panelClass: ['success-snackbar']
            });

            this.getAllResources();
          },
          error => {
            console.log(error);
            this.errorHandler.handleError(error);
          });
      }
    });

  }

  editResource(id: string): void {
    this.resourcesService.getById(id).subscribe(
      resource => {

        this.IdResource = resource.ID;
        this.Name = resource.Name;
        this.UrlName = resource.UrlName;

        console.log(resource);
      },
      error => {
        console.log(error);
      });
  }

  addNewResource(): void {
    this.resourceForm.reset();
    this.resourceForm.clearValidators();
    this.resourceForm.updateValueAndValidity();
  }

}

@Component({
  selector: 'confirm-resource-remove-dialog',
  templateUrl: './confirm-resource-remove-dialog.html',
})
export class ConfirmResourceRemoveDialog { }
