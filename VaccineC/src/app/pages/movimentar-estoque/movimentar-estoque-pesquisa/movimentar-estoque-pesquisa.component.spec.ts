import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovimentarEstoquePesquisaComponent } from './movimentar-estoque-pesquisa.component';

describe('MovimentarEstoquePesquisaComponent', () => {
  let component: MovimentarEstoquePesquisaComponent;
  let fixture: ComponentFixture<MovimentarEstoquePesquisaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MovimentarEstoquePesquisaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MovimentarEstoquePesquisaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
