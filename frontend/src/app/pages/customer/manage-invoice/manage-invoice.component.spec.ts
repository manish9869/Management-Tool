import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageInvoiceComponent } from './manage-invoice.component';

describe('ManageInvoiceComponent', () => {
  let component: ManageInvoiceComponent;
  let fixture: ComponentFixture<ManageInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageInvoiceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
