import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PaymentFormModel } from 'src/app/models/payment-form-model';

@Component({
  selector: 'app-formas-pagamento',
  templateUrl: './formas-pagamento.component.html',
  styleUrls: ['./formas-pagamento.component.scss']
})
export class FormasPagamentoComponent implements OnInit {

  selected = new FormControl(0)

  constructor() { }

  ngOnInit(): void {
  }
}
