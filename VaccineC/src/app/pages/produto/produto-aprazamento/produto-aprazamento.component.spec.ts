import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdutoAprazamentoComponent } from './produto-aprazamento.component';

describe('ProdutoAprazamentoComponent', () => {
  let component: ProdutoAprazamentoComponent;
  let fixture: ComponentFixture<ProdutoAprazamentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProdutoAprazamentoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProdutoAprazamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
