import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PessoasEnderecosComponent } from './pessoas-enderecos.component';

describe('PessoasEnderecosComponent', () => {
  let component: PessoasEnderecosComponent;
  let fixture: ComponentFixture<PessoasEnderecosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PessoasEnderecosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PessoasEnderecosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
