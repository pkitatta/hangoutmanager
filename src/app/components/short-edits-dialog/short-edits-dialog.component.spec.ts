import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShortEditsDialogComponent } from './short-edits-dialog.component';

describe('ShortEditsDialogComponent', () => {
  let component: ShortEditsDialogComponent;
  let fixture: ComponentFixture<ShortEditsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShortEditsDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShortEditsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
