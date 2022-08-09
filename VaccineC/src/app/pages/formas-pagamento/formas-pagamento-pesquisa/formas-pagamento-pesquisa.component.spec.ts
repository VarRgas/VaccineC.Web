import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormasPagamentoPesquisaComponent } from './formas-pagamento-pesquisa.component';

describe('FormasPagamentoPesquisaComponent', () => {
  let component: FormasPagamentoPesquisaComponent;
  let fixture: ComponentFixture<FormasPagamentoPesquisaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormasPagamentoPesquisaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormasPagamentoPesquisaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
