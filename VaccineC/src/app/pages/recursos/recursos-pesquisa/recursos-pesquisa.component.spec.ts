import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecursosPesquisaComponent } from './recursos-pesquisa.component';

describe('RecursosPesquisaComponent', () => {
  let component: RecursosPesquisaComponent;
  let fixture: ComponentFixture<RecursosPesquisaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecursosPesquisaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecursosPesquisaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
