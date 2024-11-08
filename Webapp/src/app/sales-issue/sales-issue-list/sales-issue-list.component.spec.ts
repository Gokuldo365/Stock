import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesIssueListComponent } from './sales-issue-list.component';

describe('SalesIssueListComponent', () => {
  let component: SalesIssueListComponent;
  let fixture: ComponentFixture<SalesIssueListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalesIssueListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SalesIssueListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
