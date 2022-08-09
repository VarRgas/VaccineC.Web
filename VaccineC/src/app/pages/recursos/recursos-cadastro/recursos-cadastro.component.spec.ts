import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecursosCadastroComponent } from './recursos-cadastro.component';

describe('RecursosCadastroComponent', () => {
  let component: RecursosCadastroComponent;
  let fixture: ComponentFixture<RecursosCadastroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecursosCadastroComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecursosCadastroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
