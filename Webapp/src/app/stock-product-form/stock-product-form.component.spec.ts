import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockProductFormComponent } from './stock-product-form.component';

describe('StockProductFormComponent', () => {
  let component: StockProductFormComponent;
  let fixture: ComponentFixture<StockProductFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StockProductFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StockProductFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
