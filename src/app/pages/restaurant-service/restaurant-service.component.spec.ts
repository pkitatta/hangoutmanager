import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestaurantServiceComponent } from './restaurant-service.component';

describe('RestaurantServiceComponent', () => {
  let component: RestaurantServiceComponent;
  let fixture: ComponentFixture<RestaurantServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RestaurantServiceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RestaurantServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
