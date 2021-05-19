import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TakeawayServiceComponent } from './takeaway-service.component';

describe('TakeawayServiceComponent', () => {
  let component: TakeawayServiceComponent;
  let fixture: ComponentFixture<TakeawayServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TakeawayServiceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TakeawayServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
