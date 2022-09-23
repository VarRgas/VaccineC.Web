import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { IBudget } from 'src/app/interfaces/i-budget';
import { BudgetsDispatcherService } from 'src/app/services/budgets-dispatcher.service';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { MessageHandlerService } from 'src/app/services/message-handler.service';

@Component({
  selector: 'app-orcamentos',
  templateUrl: './orcamentos.component.html',
  styleUrls: ['./orcamentos.component.scss']
})
export class OrcamentosComponent implements OnInit {
  //Controle para o spinner do button
  public searchButtonLoading: boolean = false;

  //Controle de exibição dos IDs na Table
  public show: boolean = true;

  //Variáveis dos inputs
  public searchPersonName!: string;
  public situation = 'P';
  public informationField!: string;

  public value = '';
  public displayedColumns: string[] = ['ID', 'BudgetNumber', 'PersonName', 'ExpirationDate', 'Amount', 'Options'];
  public dataSourceBudget = new MatTableDataSource<IBudget>();;

  @ViewChild('paginatorBudget') paginatorBudget!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private errorHandler: ErrorHandlerService,
    private messageHandler: MessageHandlerService,
    private budgetsDispatcherService: BudgetsDispatcherService) { }

  ngOnInit(): void {
    this.loadData();
  }

  public loadData(): void {
    this.searchButtonLoading = true;

    if (this.searchPersonName == "" || this.searchPersonName == null || this.searchPersonName == undefined) {
      this.getAllBudgets();
    } else {
      this.getBudgetsByPersonName();
    }
  }

  public getAllBudgets(): void {
    this.budgetsDispatcherService.getAllBudgets()
      .subscribe(budgets => {
        this.dataSourceBudget = new MatTableDataSource(budgets);
        this.dataSourceBudget.paginator = this.paginatorBudget;
        this.dataSourceBudget.sort = this.sort;
        this.searchButtonLoading = false;
      },
        error => {
          console.log(error);
          this.errorHandler.handleError(error);
          this.searchButtonLoading = false;
        });
  }

  public getBudgetsByPersonName(): void {
    const searchPersonNameFormated = this.searchPersonName.replace(/[^a-zA-Z0-9 ]/g, '');

    this.budgetsDispatcherService.getBudgetsByPersonName(searchPersonNameFormated)
      .subscribe(
        budgets => {
          this.dataSourceBudget = new MatTableDataSource(budgets);
          this.dataSourceBudget.paginator = this.paginatorBudget;
          this.dataSourceBudget.sort = this.sort;
          this.searchButtonLoading = false;
        },
        error => {
          console.log(error);
          this.errorHandler.handleError(error);
          this.searchButtonLoading = false;
        });
  }

  public addNewBudget(): void {
    this.resetForms();
    this.informationField = "";

    // this.inputIsDisabled = false;
    // this.tabIsDisabled = true;

    this.dataSourceBudget = new MatTableDataSource();
    this.dataSourceBudget.paginator = this.paginatorBudget;
    this.dataSourceBudget.sort = this.sort;

  }

  public editBudget(id: string): void {
   //TODO
  }

  public resetForms(): void {
    // this.budgetsForm.reset();
    // this.budgetsForm.clearValidators();
    // this.budgetsForm.updateValueAndValidity();
  }

}
