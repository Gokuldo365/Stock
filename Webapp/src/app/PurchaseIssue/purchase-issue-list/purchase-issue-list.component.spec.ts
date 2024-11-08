import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseIssueListComponent } from './purchase-issue-list.component';

describe('PurchaseIssueListComponent', () => {
  let component: PurchaseIssueListComponent;
  let fixture: ComponentFixture<PurchaseIssueListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurchaseIssueListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PurchaseIssueListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
