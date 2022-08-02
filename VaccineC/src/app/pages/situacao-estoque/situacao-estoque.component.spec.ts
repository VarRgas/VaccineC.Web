import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SituacaoEstoqueComponent } from './situacao-estoque.component';

describe('SituacaoEstoqueComponent', () => {
  let component: SituacaoEstoqueComponent;
  let fixture: ComponentFixture<SituacaoEstoqueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SituacaoEstoqueComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SituacaoEstoqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
