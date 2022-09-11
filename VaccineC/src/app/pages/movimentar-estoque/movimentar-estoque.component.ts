import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { IMovement } from 'src/app/interfaces/i-movement';
import { IMovementProduct } from 'src/app/interfaces/i-movement-product';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { MessageHandlerService } from 'src/app/services/message-handler.service';
import { MovementsDispatcherService } from 'src/app/services/movement-dispatcher.service';
import { MovementsProductsDispatcherService } from 'src/app/services/movement-product-dispatcher.service';

@Component({
  selector: 'app-movimentar-estoque',
  templateUrl: './movimentar-estoque.component.html',
  styleUrls: ['./movimentar-estoque.component.scss']
})
export class MovimentarEstoqueComponent implements OnInit {

  public searchMovementNumber!: string;
  public informationField!: string;
  public Id!: string;
  public MovementType!: string;
  public MovementNumber!: string;
  public Situation!: string;
  public ProductsAmount!: number;

  //SEARCH TABLE
  displayedColumns: string[] = ['MovementNumber', 'MovementType', 'Situation', 'ProductsAmount', 'ID', 'Options'];
  public dataSource = new MatTableDataSource<IMovement>();

  //PRODUCTS TABLE
  displayedColumnsMovementProduct: string[] = ['UnitsNumber', 'Name', 'UnitaryValue', 'Amount', 'ID', 'Options'];
  public dataSourceMovementProduct = new MatTableDataSource<IMovementProduct>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  searchButtonLoading = false;
  createButtonLoading = false;
  isMovementTypeDisabled = false;
  isVisible = false;
  isSaveButtonHidden = false;
  isFinishButtonHidden = true;
  isCancelButtonHidden = true;

  //Controle de exibição dos IDs na Table
  public show: boolean = true;

  //Form
  movementForm: FormGroup = this.formBuilder.group({
    Id: [null],
    MovementType: [null, [Validators.required]],
    MovementNumber: [null, [Validators.required]],
  });

  constructor(
    private movementService: MovementsDispatcherService,
    private movementProductService: MovementsProductsDispatcherService,
    private errorHandler: ErrorHandlerService,
    private messageHandler: MessageHandlerService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
  }

  loadMovementData() {

    this.searchButtonLoading = true;

    if (this.searchMovementNumber == "" || this.searchMovementNumber == null || this.searchMovementNumber == undefined) {
      this.getAllMovements();
    } else {
      this.getAllMovementsByNumber();
    }

  }

  getAllMovements() {
    this.movementService.getAll().subscribe(
      movements => {
        console.log(movements)
        this.dataSource = new MatTableDataSource(movements);
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

  getAllMovementsByNumber() {
    this.movementService.getAllByMovementNumber(this.searchMovementNumber).subscribe(
      movements => {
        this.dataSource = new MatTableDataSource(movements);
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

  addNewMovement() {
    this.resetForms();
    this.isMovementTypeDisabled = false;
    this.isVisible = false;
    this.isSaveButtonHidden = false;
    this.isFinishButtonHidden = true;
    this.isCancelButtonHidden = true;
  }

  treatButtons(situation: string) {
    if (situation == "P") {
      this.isSaveButtonHidden = true;
      this.isFinishButtonHidden = false;
      this.isCancelButtonHidden = false;
    } else if (situation == "C" || situation == "F") {
      this.isSaveButtonHidden = true;
      this.isFinishButtonHidden = true;
      this.isCancelButtonHidden = true;
    }
  }

  editMovement(id: string) {
    this.resetForms();

    this.movementService.getById(id).subscribe(
      movement => {
        this.Id = movement.ID;
        this.MovementNumber = movement.MovementNumber;
        this.MovementType = movement.MovementType;
        this.Situation = movement.Situation;
        this.ProductsAmount = movement.ProductsAmount;

        this.treatButtons(movement.Situation)

        this.isMovementTypeDisabled = true;
        this.isVisible = true;
        console.log(movement)
      },
      error => {
        console.log(error);
      });

    this.movementProductService.getAllByMovementId(id).subscribe(
      movementProduct => {
        this.dataSourceMovementProduct = new MatTableDataSource(movementProduct);
        this.dataSourceMovementProduct.paginator = this.paginator;
        this.dataSourceMovementProduct.sort = this.sort;
        console.log(movementProduct)
      },
      error => {
        console.log(error);
      });

  }

  public resetForms(): void {
    this.movementForm.reset();
    this.movementForm.clearValidators();
    this.movementForm.updateValueAndValidity();

    this.dataSourceMovementProduct = new MatTableDataSource();
    this.dataSourceMovementProduct.paginator = this.paginator;
    this.dataSourceMovementProduct.sort = this.sort;
  }

  resolveExibitionSituation(situation: string) {
    if (situation == "P") {
      return "Pendente"
    } else if (situation == "F") {
      return "Finalizado"
    } else if (situation == "C") {
      return "Cancelado"
    } else {
      return ""
    }
  }

}