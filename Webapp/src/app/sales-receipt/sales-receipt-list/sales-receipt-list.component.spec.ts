import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesReceiptListComponent } from './sales-receipt-list.component';

describe('SalesReceiptListComponent', () => {
  let component: SalesReceiptListComponent;
  let fixture: ComponentFixture<SalesReceiptListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalesReceiptListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SalesReceiptListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
