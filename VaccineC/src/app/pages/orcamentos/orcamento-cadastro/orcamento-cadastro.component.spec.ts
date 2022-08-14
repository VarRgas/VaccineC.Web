import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrcamentoCadastroComponent } from './orcamento-cadastro.component';

describe('OrcamentoCadastroComponent', () => {
  let component: OrcamentoCadastroComponent;
  let fixture: ComponentFixture<OrcamentoCadastroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrcamentoCadastroComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrcamentoCadastroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
