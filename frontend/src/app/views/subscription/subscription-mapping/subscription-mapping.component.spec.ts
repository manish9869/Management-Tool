import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionMappingComponent } from './subscription-mapping.component';

describe('SubscriptionMappingComponent', () => {
  let component: SubscriptionMappingComponent;
  let fixture: ComponentFixture<SubscriptionMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubscriptionMappingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
