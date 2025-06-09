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
  isMarkingAsPaid = signal<boolean>(false);
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
    
    } else {
      this.error.set(`Invoice with ID ${this.invoiceId()} not found`);
  
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

  markAsPaid(): void {
    if (!this.invoiceDetails) {
      this.error.set('Cannot mark as paid: Invoice not found');
      return;
    }

    if (this.invoiceDetails.status === 'paid') {
      this.error.set('Invoice is already marked as paid');
      return;
    }

    this.isMarkingAsPaid.set(true);
    this.error.set(null);

    try {
      const updatedInvoice = { ...this.invoiceDetails, status: 'paid' as const };
      this.invoiceService.updateInvoice(updatedInvoice);
      this.invoiceDetails = updatedInvoice;
      this.isMarkingAsPaid.set(false);
    } catch (err) {
      console.error('Error marking invoice as paid:', err);
      this.error.set('Failed to mark invoice as paid. Please try again.');
      this.isMarkingAsPaid.set(false);
    }
  }
}
