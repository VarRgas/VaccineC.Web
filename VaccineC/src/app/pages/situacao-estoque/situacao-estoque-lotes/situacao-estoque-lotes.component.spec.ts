import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SituacaoEstoqueLotesComponent } from './situacao-estoque-lotes.component';

describe('SituacaoEstoqueLotesComponent', () => {
  let component: SituacaoEstoqueLotesComponent;
  let fixture: ComponentFixture<SituacaoEstoqueLotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SituacaoEstoqueLotesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SituacaoEstoqueLotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
