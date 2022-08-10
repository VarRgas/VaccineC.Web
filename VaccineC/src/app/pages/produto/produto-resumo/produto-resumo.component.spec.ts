import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdutoResumoComponent } from './produto-resumo.component';

describe('ProdutoResumoComponent', () => {
  let component: ProdutoResumoComponent;
  let fixture: ComponentFixture<ProdutoResumoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProdutoResumoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProdutoResumoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
