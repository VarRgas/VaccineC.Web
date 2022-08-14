import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrcamentoPesquisaComponent } from './orcamento-pesquisa.component';

describe('OrcamentoPesquisaComponent', () => {
  let component: OrcamentoPesquisaComponent;
  let fixture: ComponentFixture<OrcamentoPesquisaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrcamentoPesquisaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrcamentoPesquisaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
