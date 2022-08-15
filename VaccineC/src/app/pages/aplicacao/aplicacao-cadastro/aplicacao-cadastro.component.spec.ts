import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AplicacaoCadastroComponent } from './aplicacao-cadastro.component';

describe('AplicacaoCadastroComponent', () => {
  let component: AplicacaoCadastroComponent;
  let fixture: ComponentFixture<AplicacaoCadastroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AplicacaoCadastroComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AplicacaoCadastroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
