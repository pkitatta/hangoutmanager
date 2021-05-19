import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HangoutAddComponent } from './hangout-add.component';

describe('HangoutAddComponent', () => {
  let component: HangoutAddComponent;
  let fixture: ComponentFixture<HangoutAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HangoutAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HangoutAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
