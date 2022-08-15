import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AplicacaoPesquisaComponent } from './aplicacao-pesquisa.component';

describe('AplicacaoPesquisaComponent', () => {
  let component: AplicacaoPesquisaComponent;
  let fixture: ComponentFixture<AplicacaoPesquisaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AplicacaoPesquisaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AplicacaoPesquisaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
