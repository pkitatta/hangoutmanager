import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuOptModalComponent } from './menu-opt-modal.component';

describe('MenuOptModalComponent', () => {
  let component: MenuOptModalComponent;
  let fixture: ComponentFixture<MenuOptModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenuOptModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuOptModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
