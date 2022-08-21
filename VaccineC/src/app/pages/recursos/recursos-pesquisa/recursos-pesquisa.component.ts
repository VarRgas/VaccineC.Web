import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { IResource } from 'src/app/interfaces/i-resource';
import { ResourcesService } from 'src/app/services/resources.service';

@Component({
  selector: 'app-recursos-pesquisa',
  templateUrl: './recursos-pesquisa.component.html',
  styleUrls: ['./recursos-pesquisa.component.scss']
})
export class RecursosPesquisaComponent implements OnInit {

  public value = '';
  public displayedColumns: string[] = ['Name', 'UrlName', 'Options'];
  public dataSource = new MatTableDataSource<IResource>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private resourcesService: ResourcesService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
  }

  loadResourceData() {
    this.resourcesService.getAll().subscribe(
      resources => {
        this.dataSource = new MatTableDataSource(resources);

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        console.log(resources);
      },
      error => {
        console.log(error);
      });
  }

}
