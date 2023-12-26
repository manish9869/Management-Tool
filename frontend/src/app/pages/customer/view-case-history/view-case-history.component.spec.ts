import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCaseHistoryComponent } from './view-case-history.component';

describe('ViewCaseHistoryComponent', () => {
  let component: ViewCaseHistoryComponent;
  let fixture: ComponentFixture<ViewCaseHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewCaseHistoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewCaseHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
