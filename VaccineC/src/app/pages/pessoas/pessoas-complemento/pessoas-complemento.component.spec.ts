import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PessoasComplementoComponent } from './pessoas-complemento.component';

describe('PessoasComplementoComponent', () => {
  let component: PessoasComplementoComponent;
  let fixture: ComponentFixture<PessoasComplementoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PessoasComplementoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PessoasComplementoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
