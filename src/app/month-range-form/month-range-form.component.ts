import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MonthService } from '../month.service';

const date = new Date(),
  month = ("0" + (date.getMonth() + 1)).slice(-2),
  year = date.getFullYear()

const getMonths = (start: string, end: string) => {
  const startDate = new Date(start),
    endDate = new Date(end),
    months = [];

  while (startDate <= endDate) {
    const month = startDate.getMonth() + 1;
    const year = startDate.getFullYear();
    months.push(year + "-" + (month < 10 ? "0" + month : month));
    startDate.setMonth(startDate.getMonth() + 1);
  }

  return months;
}

@Component({
  selector: 'app-month-range-form',
  templateUrl: './month-range-form.component.html',
  standalone: true,
  imports: [FormsModule]
})
export class MonthRangeFormComponent {
  constructor(private monthService: MonthService) { }

  model = {
    startingMonth: `${year}-${month}`,
    endingMonth: `${year}-${month}`
  }

  validRange = true;

  validateChange() {
    this.validRange = this.model.endingMonth >= this.model.startingMonth
  }

  onSubmit() {
    if (!this.validRange)
      return

    this.monthService.setMonths(getMonths(this.model.startingMonth, this.model.endingMonth))
  }
}
