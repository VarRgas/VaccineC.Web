import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovimentarEstoqueComponent } from './movimentar-estoque.component';

describe('MovimentarEstoqueComponent', () => {
  let component: MovimentarEstoqueComponent;
  let fixture: ComponentFixture<MovimentarEstoqueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MovimentarEstoqueComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MovimentarEstoqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
