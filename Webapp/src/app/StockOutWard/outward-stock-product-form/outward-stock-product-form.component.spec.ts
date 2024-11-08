import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutwardStockProductFormComponent } from './outward-stock-product-form.component';

describe('OutwardStockProductFormComponent', () => {
  let component: OutwardStockProductFormComponent;
  let fixture: ComponentFixture<OutwardStockProductFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OutwardStockProductFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OutwardStockProductFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
