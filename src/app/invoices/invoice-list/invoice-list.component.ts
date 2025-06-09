import { Component, OnInit } from '@angular/core';
import { Invoice } from '../../app.module';
import { InvoiceService } from '../../invoice/invoice-service.service';
import { Router } from '@angular/router';
import { InvoiceGroupComponent } from "../invoice-group/invoice-group.component";
import { InvoiceCardComponent } from "../invoice-card/invoice-card.component";
import { InvoiceEmptyComponent } from "../invoice-empty/invoice-empty.component";

@Component({
  selector: 'app-invoice-list',
  imports: [InvoiceGroupComponent, InvoiceCardComponent, InvoiceEmptyComponent],
  templateUrl: './invoice-list.component.html',
  styleUrl: './invoice-list.component.scss'
})
export class InvoiceListComponent implements OnInit {
  invoices: Invoice[] = [];
  filteredInvoices: Invoice[] = [];

  constructor(
    private invoiceService: InvoiceService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.invoiceService.invoices$.subscribe(invoices => {
      this.invoices = invoices;
      this.filteredInvoices = invoices;
      console.log('Invoices loaded:', this.invoices);
    });
  }

  onNewInvoice() {
    this.router.navigate([{ outlets: { modal: ['invoices', 'new'] } }]);
  }

  onFilterChange(filters: string[]) {
    if (filters.length === 0) {
      this.filteredInvoices = this.invoices;
    } else {
      this.filteredInvoices = this.invoices.filter(invoice =>
        filters.includes(invoice.status.toLowerCase()),
      );
    }
  }
}
