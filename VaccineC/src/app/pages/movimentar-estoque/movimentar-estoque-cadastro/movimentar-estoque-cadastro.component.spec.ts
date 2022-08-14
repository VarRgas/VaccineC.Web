import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovimentarEstoqueCadastroComponent } from './movimentar-estoque-cadastro.component';

describe('MovimentarEstoqueCadastroComponent', () => {
  let component: MovimentarEstoqueCadastroComponent;
  let fixture: ComponentFixture<MovimentarEstoqueCadastroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MovimentarEstoqueCadastroComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MovimentarEstoqueCadastroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
