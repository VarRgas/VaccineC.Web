import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalErrorDialogComponent } from './global-error-dialog.component';

describe('GlobalErrorDialogComponent', () => {
  let component: GlobalErrorDialogComponent;
  let fixture: ComponentFixture<GlobalErrorDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GlobalErrorDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GlobalErrorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
