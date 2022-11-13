import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { IResource } from 'src/app/interfaces/i-resource';
import { ResourceModel } from 'src/app/models/resource-model';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { MessageHandlerService } from 'src/app/services/message-handler.service';
import { ResourcesService } from 'src/app/services/resources.service';
import { UsersService } from 'src/app/services/user-dispatcher.service';
import { UserResourceService } from 'src/app/services/user-resource.service';

@Component({
  selector: 'app-recursos',
  templateUrl: './recursos.component.html',
  styleUrls: ['./recursos.component.scss']
})

export class RecursosComponent implements OnInit {

  //Controle para o spinner do button
  searchButtonLoading = false;
  createButtonLoading = false;

  //Controle de exibição dos IDs na Table
  show: boolean = true;

  //Variáveis dos inputs
  public searchNameResource!: string;
  public IdResource!: string;
  public Name!: string;
  public UrlName!: string;
  public informationField!: string;

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
    private router: Router,
    private resourcesService: ResourcesService,
    private usersService: UsersService,
    private usersResourcesService: UserResourceService,
    private errorHandler: ErrorHandlerService,
    private messageHandler: MessageHandlerService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.getUserPermision();
    this.updateUserResourceAccessNumber();
    this.getAllResources();
  }

  public getUserPermision() {

    let resource = new ResourceModel();
    resource.urlName = this.router.url;
    resource.name = this.router.url;

    this.usersService.userPermission(localStorage.getItem('userId')!, resource).subscribe(
      response => {
        if (!response) {
          this.router.navigateByUrl('/unauthorized-error-401');
        }
      },
      error => {
        console.log(error);
        this.errorHandler.handleError(error);
      });
  }

  public updateUserResourceAccessNumber() {
    let resource = new ResourceModel();
    resource.urlName = this.router.url;
    resource.name = this.router.url;

    this.usersResourcesService.updateUserResourceAccessNumber(localStorage.getItem('userId')!, resource).subscribe(
      response => {

      },
      error => {
        console.log(error);
        this.errorHandler.handleError(error);
      });

  }

  loadResourceData() {

    this.searchButtonLoading = true;

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
        this.searchButtonLoading = false;
      },
      error => {
        console.log(error);
        this.errorHandler.handleError(error);
        this.searchButtonLoading = false;
      });

  }

  getResourcesByName(): void {

    this.resourcesService.getByName(this.searchNameResource).subscribe(
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

  createUpdateResource(): void {

    this.createButtonLoading = true;

    if (this.IdResource == "" || this.IdResource == null || this.IdResource == undefined) {
      this.createResource();
    } else {
      this.updateResource();
    }
  }

  createResource(): void {

    if (!this.resourceForm.valid) {
      console.log(this.resourceForm);
      this.createButtonLoading = false;
      this.resourceForm.markAllAsTouched();
      this.messageHandler.showMessage("Campos obrigatórios não preenchidos, verifique!", "warning-snackbar");
      return;
    }

    const data = this.resourceForm.value;
    data.HasPending = false;

    this.resourcesService.create(data)
      .subscribe(
        response => {
          this.IdResource = response;
          this.informationField = this.Name;
          this.createButtonLoading = false;
          this.getAllResources();
          this.messageHandler.showMessage("Recurso criado com sucesso!", "success-snackbar")
        },
        error => {
          console.log(error);
          this.errorHandler.handleError(error);
          this.createButtonLoading = false;
        });
  }

  updateResource(): void {

    let resource = new ResourceModel();
    resource.id = this.IdResource;
    resource.name = this.Name;
    resource.urlName = this.UrlName;

    if (!this.resourceForm.valid) {
      console.log(this.resourceForm);
      this.createButtonLoading = false;
      this.resourceForm.markAllAsTouched();
      this.messageHandler.showMessage("Campos obrigatórios não preenchidos, verifique!", "warning-snackbar");
      return;
    }

    this.resourcesService.update(this.IdResource, resource)
      .subscribe(
        response => {
          this.IdResource = response;
          this.informationField = this.Name;
          this.createButtonLoading = false;
          this.getAllResources();
          this.messageHandler.showMessage("Recurso alterado com sucesso!", "success-snackbar")
        },
        error => {
          this.errorHandler.handleError(error);
          console.log(error);
          this.createButtonLoading = false;
        });
  }

  deleteResource(): void {

    const dialogRef = this.dialog.open(ConfirmResourceRemoveDialog);

    dialogRef.afterClosed().subscribe(result => {
      if (!!result) {
        this.resourcesService.delete(this.IdResource).subscribe(
          success => {
            this.informationField = "";
            this.resourceForm.reset();
            this.resourceForm.clearValidators();
            this.resourceForm.updateValueAndValidity();
            this.getAllResources();
            this.messageHandler.showMessage("Recurso removido com sucesso!", "success-snackbar")
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
        this.informationField = resource.Name;
      },
      error => {
        console.log(error);
      });
  }

  addNewResource(): void {
    this.resourceForm.reset();
    this.resourceForm.clearValidators();
    this.resourceForm.updateValueAndValidity();
    this.informationField = "";
  }

}

@Component({
  selector: 'confirm-resource-remove-dialog',
  templateUrl: './confirm-resource-remove-dialog.html',
})
export class ConfirmResourceRemoveDialog { }
