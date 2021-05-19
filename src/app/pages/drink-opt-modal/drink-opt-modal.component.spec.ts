import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrinkOptModalComponent } from './drink-opt-modal.component';

describe('DrinkOptModalComponent', () => {
  let component: DrinkOptModalComponent;
  let fixture: ComponentFixture<DrinkOptModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DrinkOptModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DrinkOptModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
