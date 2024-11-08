import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StickyPageHeaderComponent } from './sticky-page-header.component';

describe('StickyPageHeaderComponent', () => {
  let component: StickyPageHeaderComponent;
  let fixture: ComponentFixture<StickyPageHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StickyPageHeaderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StickyPageHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
