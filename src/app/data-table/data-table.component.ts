import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { MonthService } from '../month.service';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../icon/icon.component';
import { TYPES } from '../constants';

interface ICateogires {
  name: string,
  data: (number | null)[]
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.scss',
  imports: [FormsModule, IconComponent]
})
export class DataTableComponent {
  months: string[] = [];
  private subscription: Subscription;

  TYPES = TYPES;

  incomeCategories: ICateogires[] = [];
  operationalExpensesCategories: ICateogires[] = [];
  expensesCategories: ICateogires[] = [];

  incomeTotal: (number | null)[] = [];
  operationalExpensesTotal: (number | null)[] = [];
  normalExpensesTotal: (number | null)[] = [];
  expensesTotal: (number | null)[] = [];

  profitLoss: (number | null)[] = [];
  openingBalance: (number | null)[] = [0];
  closingBalance: (number | null)[] = [];

  constructor(private monthService: MonthService) {
    this.subscription = this.monthService.monthSubject.subscribe((months) => {
      this.months = months
      this.resetData()
    });
  }

  resetData() {
    this.incomeCategories = [];
    this.operationalExpensesCategories = [];
    this.expensesCategories = [];

    this.incomeTotal = [];
    this.operationalExpensesTotal = [];
    this.normalExpensesTotal = []
    this.expensesTotal = [];

    this.profitLoss = [];
    this.openingBalance = [0];
    this.closingBalance = [];
  }

  addCategory(type: string) {
    let dataAttr = '', rowIndex = 0

    const category: ICateogires = {
      name: '',
      data: this.months.map(() => null)
    }

    switch (type) {
      case TYPES.INCOME:
        this.incomeCategories.push(category)
        rowIndex = this.incomeCategories.length
        dataAttr = 'income'
        break
      case TYPES.OPERARTION_EXPENSES:
        this.operationalExpensesCategories.push(category)
        rowIndex = this.operationalExpensesCategories.length
        dataAttr = 'operational'
        break
      case TYPES.EXPENSES:
        this.expensesCategories.push(category)
        rowIndex = this.expensesCategories.length
        dataAttr = 'expense'
    }

    setTimeout(() => {
      document.querySelector<HTMLInputElement>(`[data-tab='${dataAttr}-name-${rowIndex - 1}']`)?.focus()
    }, 100)
  }

  calculateTotal(type: string, index: number) {
    const calculateResult = (arr: (null | number)[]) => {
      return arr.reduce((acc, curr) => {
        const accumulator = acc ?? 0,
          currrent = curr ?? 0
        return accumulator + currrent
      }, 0)
    }
    switch (type) {
      case TYPES.INCOME:
        const incomeArr = this.incomeCategories.map(x => x.data[index])
        this.incomeTotal[index] = calculateResult(incomeArr)
        break
      case TYPES.OPERARTION_EXPENSES:
        const operArr = this.operationalExpensesCategories.map(x => x.data[index]),
          exp = this.normalExpensesTotal[index] ?? 0,
          tempOper = calculateResult(operArr) ?? 0,
          operReusult = tempOper + (tempOper / 6)
        this.operationalExpensesTotal[index] = operReusult
        this.expensesTotal[index] = operReusult + exp
        break
      case TYPES.EXPENSES:
        const expArr = this.expensesCategories.map(x => x.data[index]),
          oper = this.operationalExpensesTotal[index] ?? 0,
          expReusult = calculateResult(expArr) ?? 0
        this.normalExpensesTotal[index] = expReusult
        this.expensesTotal[index] = oper + expReusult
    }

    for (let i = 0; i < this.months.length; i++) {
      let income = this.incomeTotal[i] ?? 0,
        expense = this.expensesTotal[i] ?? 0,
        open = this.openingBalance[i] ?? 0,
        profitLoss = income - expense

      this.profitLoss[i] = profitLoss

      if (i > 0) {
        this.openingBalance[i] = this.closingBalance[i - 1]
        open = this.openingBalance[i] ?? 0
      }


      this.closingBalance[i] = open + profitLoss
    }
  }

  handleTab(e: any, type: string, index: number, rowIndex: number) {
    let arr: ICateogires[] = [];

    switch (type) {
      case TYPES.INCOME:
        arr = this.incomeCategories
        break
      case TYPES.OPERARTION_EXPENSES:
        arr = this.operationalExpensesCategories
        break
      case TYPES.EXPENSES:
        arr = this.expensesCategories
    }

    if (rowIndex === arr.length - 1 && index === arr[rowIndex].data.length - 1) {
      e.preventDefault();
      this.addCategory(type);
    };
  }

  deleteCategory(type: string, index: number) {
    let arr: ICateogires[] = [],
      typeChanged: string = ''

    switch (type) {
      case TYPES.INCOME:
        arr = this.incomeCategories
        typeChanged = TYPES.INCOME
        break
      case TYPES.OPERARTION_EXPENSES:
        arr = this.operationalExpensesCategories
        typeChanged = TYPES.OPERARTION_EXPENSES
        break
      case TYPES.EXPENSES:
        arr = this.expensesCategories
        typeChanged = TYPES.EXPENSES
    }

    arr.splice(index, 1)

    this.months.forEach((mont, index) => {
      this.calculateTotal(typeChanged, index)
    })
  }

  formatDate(date: string) {
    const options: Intl.DateTimeFormatOptions = { year: '2-digit', month: 'short' };
    return new Date(date).toLocaleDateString("en-US", options);
  }

  ngOnDestroy() {
    // Unsubscribe to prevent memory leaks
    this.subscription.unsubscribe();
  }
}
