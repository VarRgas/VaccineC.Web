import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpresaAgendaComponent } from './empresa-agenda.component';

describe('EmpresaAgendaComponent', () => {
  let component: EmpresaAgendaComponent;
  let fixture: ComponentFixture<EmpresaAgendaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmpresaAgendaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmpresaAgendaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
