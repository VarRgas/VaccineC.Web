import { ComponentFixture, TestBed } from '@angular/core/testing';

import FormasPagamentoCadastroComponent from './formas-pagamento-cadastro.component';

describe('FormasPagamentoCadastroComponent', () => {
  let component: FormasPagamentoCadastroComponent;
  let fixture: ComponentFixture<FormasPagamentoCadastroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormasPagamentoCadastroComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormasPagamentoCadastroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
