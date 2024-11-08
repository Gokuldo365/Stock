import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseIssueComponent } from './purchase-issue.component';

describe('PurchaseIssueComponent', () => {
  let component: PurchaseIssueComponent;
  let fixture: ComponentFixture<PurchaseIssueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurchaseIssueComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PurchaseIssueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
