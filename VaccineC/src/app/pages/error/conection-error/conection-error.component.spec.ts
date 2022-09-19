import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConectionErrorComponent } from './conection-error.component';

describe('ConectionErrorComponent', () => {
  let component: ConectionErrorComponent;
  let fixture: ComponentFixture<ConectionErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConectionErrorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConectionErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
