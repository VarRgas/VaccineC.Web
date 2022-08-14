import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SituacaoEstoqueProjecaoComponent } from './situacao-estoque-projecao.component';

describe('SituacaoEstoqueProjecaoComponent', () => {
  let component: SituacaoEstoqueProjecaoComponent;
  let fixture: ComponentFixture<SituacaoEstoqueProjecaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SituacaoEstoqueProjecaoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SituacaoEstoqueProjecaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
