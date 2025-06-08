import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Invoice } from '../../app.module';


@Component({
  selector: 'app-invoice-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './invoice-card.component.html',
  styleUrl: './invoice-card.component.scss',
})
export class InvoiceCardComponent {
  @Input({ required: true }) invoice!: Invoice;

  constructor(private router: Router) {}

  navigateToInvoice(id: string): void {
    this.router.navigate(['/invoices', id]);
  }
}
