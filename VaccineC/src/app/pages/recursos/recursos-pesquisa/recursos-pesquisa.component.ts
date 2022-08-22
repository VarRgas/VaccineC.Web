import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { IResource } from 'src/app/interfaces/i-resource';
import { ResourceModel } from 'src/app/models/resource-model';
import { ResourcesService } from 'src/app/services/resources.service';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';

@Component({
  selector: 'app-recursos-pesquisa',
  templateUrl: './recursos-pesquisa.component.html',
  styleUrls: ['./recursos-pesquisa.component.scss']
})
export class RecursosPesquisaComponent implements OnInit {

  public searchNameResource!: string;

  public value = '';
  public displayedColumns: string[] = ['Name', 'UrlName', 'Options'];
  public dataSource = new MatTableDataSource<IResource>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private resourcesService: ResourcesService,
    private errorHandler: ErrorHandlerService
  ) { }

  ngOnInit(): void {
  }

  loadResourceData() {

    if (this.searchNameResource == "" || this.searchNameResource == null || this.searchNameResource == undefined) {

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

    } else {

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
    }

  }

}
