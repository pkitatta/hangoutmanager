import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelOkDialogComponent } from './cancel-ok-dialog.component';

describe('CancelOkDialogComponent', () => {
  let component: CancelOkDialogComponent;
  let fixture: ComponentFixture<CancelOkDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CancelOkDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelOkDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
