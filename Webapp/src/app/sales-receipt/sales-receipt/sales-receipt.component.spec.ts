import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesReceiptComponent } from './sales-receipt.component';

describe('SalesReceiptComponent', () => {
  let component: SalesReceiptComponent;
  let fixture: ComponentFixture<SalesReceiptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalesReceiptComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SalesReceiptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
