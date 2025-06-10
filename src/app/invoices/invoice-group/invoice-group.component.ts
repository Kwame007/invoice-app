import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Invoice } from '../../app.module';
import { ClickOutsideDirective } from '../../shared/directives/click-outside.directive';

@Component({
  selector: 'app-invoice-group',
  imports: [ClickOutsideDirective],
  templateUrl: './invoice-group.component.html',
  styleUrl: './invoice-group.component.scss'
})
export class InvoiceGroupComponent {

  @Input() invoices: Invoice[] = [];


  @Output() filterChange = new EventEmitter<string[]>();
  selectedFilters: string[] = [];
  isDropdownOpen = false;

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

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  onOutsideClick() {
    if (this.isDropdownOpen) {
      this.isDropdownOpen = false;
    }
  }

}
