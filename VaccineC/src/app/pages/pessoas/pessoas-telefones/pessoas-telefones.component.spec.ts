import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PessoasTelefonesComponent } from './pessoas-telefones.component';

describe('PessoasTelefonesComponent', () => {
  let component: PessoasTelefonesComponent;
  let fixture: ComponentFixture<PessoasTelefonesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PessoasTelefonesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PessoasTelefonesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
