import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrinkAddComponent } from './drink-add.component';

describe('DrinkAddComponent', () => {
  let component: DrinkAddComponent;
  let fixture: ComponentFixture<DrinkAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DrinkAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DrinkAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
