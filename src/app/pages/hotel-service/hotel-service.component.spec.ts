import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelServiceComponent } from './hotel-service.component';

describe('HotelServiceComponent', () => {
  let component: HotelServiceComponent;
  let fixture: ComponentFixture<HotelServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HotelServiceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HotelServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
