import { Routes } from '@angular/router';
import { InvoiceListComponent } from './invoices/invoice-list/invoice-list.component';
import { InvoiceDetailsComponent } from './invoices/invoice-details/invoice-details.component';
import { NewInvoiceFormComponent } from './invoices/new-invoice/new-invoice.component';

export const routes: Routes = [
  { path: '', component: InvoiceListComponent },
  { path: 'invoices/:id', component: InvoiceDetailsComponent },
  { path: 'invoices/new', component: NewInvoiceFormComponent, outlet: 'modal' },
  { path: '**', redirectTo: '' },
];
