import { Component } from '@angular/core';
import { MonthRangeFormComponent } from './month-range-form/month-range-form.component';
import { DataTableComponent } from './data-table/data-table.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [MonthRangeFormComponent, DataTableComponent]
})
export class AppComponent {
  title = 'BUDGET-BUILDER';
}
