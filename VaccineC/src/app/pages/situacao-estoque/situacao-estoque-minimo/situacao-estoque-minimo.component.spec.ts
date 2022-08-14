import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SituacaoEstoqueMinimoComponent } from './situacao-estoque-minimo.component';

describe('SituacaoEstoqueMinimoComponent', () => {
  let component: SituacaoEstoqueMinimoComponent;
  let fixture: ComponentFixture<SituacaoEstoqueMinimoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SituacaoEstoqueMinimoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SituacaoEstoqueMinimoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
