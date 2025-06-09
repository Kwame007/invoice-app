import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Invoice } from '../../app.module';


@Component({
  selector: 'app-invoice-group',
  imports: [],
  templateUrl: './invoice-group.component.html',
  styleUrl: './invoice-group.component.scss'
})
export class InvoiceGroupComponent {

  @Input() invoices: Invoice[] = [];


  @Output() filterChange = new EventEmitter<string[]>();
  selectedFilters: string[] = [];

  constructor(private router: Router) {}

  onNewInvoice() {
    console.log('Creating a new invoice');
    this.router.navigate([{ outlets: { modal: ['invoices', 'new'] } }]);
  }

  onFilterSelect(status: string) {
    const index = this.selectedFilters.indexOf(status);
    if (index === -1) {
      this.selectedFilters.push(status);
    } else {
      this.selectedFilters.splice(index, 1);
    }
    this.filterChange.emit(this.selectedFilters);
  }

}
