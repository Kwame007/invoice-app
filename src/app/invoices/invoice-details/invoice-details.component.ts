import { Component, EventEmitter, inject, OnInit, Output, signal } from '@angular/core';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { InvoiceService } from '../../invoice/invoice-service.service';
import { Invoice } from '../../app.module';
import { ConfirmationModalComponent } from "../../shared/confirmation-modal/confirmation-modal.component";



@Component({
  selector: 'app-invoice-details',
  standalone: true,
  imports: [CommonModule, RouterModule, ConfirmationModalComponent],
  templateUrl: './invoice-details.component.html',
  styleUrl: './invoice-details.component.scss',
})
export class InvoiceDetailsComponent {
  @Output() delete = new EventEmitter();

  // Using Angular signals to manage state
  // invoiceId will hold the ID of the invoice from the route parameters
  invoiceId = signal<string>('');
  invoiceDetails: Invoice | null = null;
  isLoading = signal<boolean>(true);
  isDeleting = signal<boolean>(false);
  error = signal<string | null>(null);
  showDeleteModal = signal<boolean>(false);
  private isDestroyed = signal<boolean>(false);

  //injecting activatedRoute to access route parameters
  private activatedRoute = inject(ActivatedRoute);
  private invoiceService = inject(InvoiceService);
  private router = inject(Router);

  // Constructor to subscribe to route parameters
  // and update the invoiceId signal accordingly
  // This allows the component to reactively update when the route changes
  constructor() {
    this.activatedRoute.params.subscribe({
      next: params => {
        if (!this.isDestroyed()) {
          this.invoiceId.set(params['id']);
          this.loadInvoice();
        }
      },
      error: err => {
        if (!this.isDestroyed()) {
          this.error.set('Error loading invoice');
          this.isLoading.set(false);
          console.error('Error loading route params:', err);
        }
      },
    });
  }

  private loadInvoice(): void {
    if (this.isDestroyed()) return;

    this.isLoading.set(true);
    this.error.set(null);

    const invoice = this.invoiceService.getInvoices(this.invoiceId());
    if (invoice) {
      this.invoiceDetails = invoice;
      console.log('Invoice details loaded:', this.invoiceDetails);
    } else {
      this.error.set(`Invoice with ID ${this.invoiceId()} not found`);
      console.error('Invoice not found:', this.invoiceId());
    }
    this.isLoading.set(false);
  }

  onDelete(): void {
    if (!this.invoiceDetails) {
      this.error.set('Cannot delete: Invoice not found');
      return;
    }
    this.showDeleteModal.set(true);
  }

  onDeleteConfirm(): void {
    this.isDeleting.set(true);
    this.error.set(null);
    this.isDestroyed.set(true);

    try {
      this.invoiceService.deleteInvoice(this.invoiceId());
      this.showDeleteModal.set(false);
      this.router.navigate(['/']);
    } catch (err) {
      this.isDestroyed.set(false);
      console.error('Error deleting invoice:', err);
      this.error.set('Failed to delete invoice. Please try again.');
      this.isDeleting.set(false);
    }
  }

  onDeleteCancel(): void {
    this.showDeleteModal.set(false);
  }
}
