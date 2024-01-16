import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevenueTrackerComponent } from './revenue-tracker.component';

describe('RevenueTrackerComponent', () => {
  let component: RevenueTrackerComponent;
  let fixture: ComponentFixture<RevenueTrackerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RevenueTrackerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RevenueTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
