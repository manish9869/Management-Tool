import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewStaffMemberComponent } from './view-staff-member.component';

describe('ViewStaffMemberComponent', () => {
  let component: ViewStaffMemberComponent;
  let fixture: ComponentFixture<ViewStaffMemberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewStaffMemberComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewStaffMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
