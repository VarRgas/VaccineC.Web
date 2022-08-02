import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OcupacoesComponent } from './ocupacoes.component';

describe('OcupacoesComponent', () => {
  let component: OcupacoesComponent;
  let fixture: ComponentFixture<OcupacoesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OcupacoesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OcupacoesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
