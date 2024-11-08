import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesIssueComponent } from './sales-issue.component';

describe('SalesIssueComponent', () => {
  let component: SalesIssueComponent;
  let fixture: ComponentFixture<SalesIssueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalesIssueComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SalesIssueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
