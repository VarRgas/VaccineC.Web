import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpresaPesquisaComponent } from './empresa-pesquisa.component';

describe('EmpresaPesquisaComponent', () => {
  let component: EmpresaPesquisaComponent;
  let fixture: ComponentFixture<EmpresaPesquisaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmpresaPesquisaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmpresaPesquisaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
