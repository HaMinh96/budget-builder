import { EventEmitter, Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MonthService {
  private months: string[] = [];
  monthSubject = new Subject<string[]>();
  monthEvent = new EventEmitter<string[]>();

  setMonths(month: string[]) {
    this.months = month;
    this.monthSubject.next(this.months);
    this.monthEvent.emit(month)
  }

  getMonths() {
    return [...this.months]
  }
}
