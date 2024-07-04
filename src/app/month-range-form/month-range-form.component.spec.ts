import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthRangeFormComponent } from './month-range-form.component';

describe('MonthRangeFormComponent', () => {
  let component: MonthRangeFormComponent;
  let fixture: ComponentFixture<MonthRangeFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonthRangeFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonthRangeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
