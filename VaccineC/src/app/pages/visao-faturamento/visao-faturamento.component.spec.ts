import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisaoFaturamentoComponent } from './visao-faturamento.component';

describe('VisaoFaturamentoComponent', () => {
  let component: VisaoFaturamentoComponent;
  let fixture: ComponentFixture<VisaoFaturamentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisaoFaturamentoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisaoFaturamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
