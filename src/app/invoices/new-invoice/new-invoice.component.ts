import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { InvoiceService } from '../../invoice/invoice-service.service';
import { SideBarComponent } from '../../header/side-bar/side-bar.component';
import { HeaderNavComponent } from '../../header/header-nav/header-nav.component';
import { Invoice } from '../../app.module';

@Component({
  selector: 'app-new-invoice-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, SideBarComponent, HeaderNavComponent],
  templateUrl: './new-invoice.component.html',
  styleUrl: './new-invoice.component.scss',
})
export class NewInvoiceFormComponent implements OnInit {
  invoiceForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private invoiceService: InvoiceService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.invoiceForm = this.fb.group({
      clientName: ['', Validators.required],
      clientEmail: ['', [Validators.required, Validators.email]],
      status: ['draft'], // Default status
      senderAddress: this.fb.group({
        street: ['', Validators.required],
        city: ['', Validators.required],
        postCode: ['', Validators.required],
        country: ['', Validators.required],
      }),
      clientAddress: this.fb.group({
        street: ['', Validators.required],
        city: ['', Validators.required],
        postCode: ['', Validators.required],
        country: ['', Validators.required],
      }),
      items: this.fb.array([]),
      paymentTerms: [1, Validators.required],
      description: ['', Validators.required],
      createdAt: ['', Validators.required],
      paymentDue: ['', Validators.required],
      total: [{ value: 0, disabled: true }],
    });

    // Add a default item row
    this.addItem();

    // Set default date to today
    const today = new Date().toISOString().split('T')[0];
    this.invoiceForm.patchValue({
      createdAt: today,
    });
    this.onDateOrTermsChange();
  }

  get items(): FormArray {
    return this.invoiceForm.get('items') as FormArray;
  }

  newItem(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      price: [0, [Validators.required, Validators.min(0)]],
      total: [{ value: 0, disabled: true }],
    });
  }

  addItem(): void {
    this.items.push(this.newItem());
  }

  removeItem(i: number): void {
    this.items.removeAt(i);
    this.calculateGrandTotal();
  }

  closeForm(): void {
    this.router.navigate(['/']);
  }

  saveAsDraft(): void {
    const draftInvoice: Invoice = {
      ...this.invoiceForm.getRawValue(),
      id: Math.random().toString(36).substring(2, 8).toUpperCase(),
      status: 'draft',
    };

    // Set creation date if not set
    if (!draftInvoice.createdAt) {
      draftInvoice.createdAt = new Date().toISOString().split('T')[0];
    }

    // Calculate payment due date
    const createdAtDate = new Date(draftInvoice.createdAt);
    createdAtDate.setDate(createdAtDate.getDate() + draftInvoice.paymentTerms);
    draftInvoice.paymentDue = createdAtDate.toISOString().split('T')[0];

    // Calculate totals
    draftInvoice.items.forEach(item => {
      item.total = item.quantity * item.price;
    });
    draftInvoice.total = draftInvoice.items.reduce((sum, item) => sum + item.total, 0);

    this.invoiceService.addInvoice(draftInvoice);
    this.router.navigate(['/']);
  }

  onSubmit(): void {
    if (this.invoiceForm.valid) {
      const newInvoice: Invoice = {
        ...this.invoiceForm.getRawValue(),
        id: Math.random().toString(36).substring(2, 8).toUpperCase(),
        status: 'pending',
      };

      // Set creation date if not set
      if (!newInvoice.createdAt) {
        newInvoice.createdAt = new Date().toISOString().split('T')[0];
      }

      // Calculate payment due date
      const createdAtDate = new Date(newInvoice.createdAt);
      createdAtDate.setDate(createdAtDate.getDate() + newInvoice.paymentTerms);
      newInvoice.paymentDue = createdAtDate.toISOString().split('T')[0];

      // Calculate totals
      newInvoice.items.forEach(item => {
        item.total = item.quantity * item.price;
      });
      newInvoice.total = newInvoice.items.reduce((sum, item) => sum + item.total, 0);

      this.invoiceService.addInvoice(newInvoice);
      this.router.navigate(['/']);
    }
  }

  calculateItemTotal(itemControl: AbstractControl): void {
    const quantity = itemControl.get('quantity')?.value || 0;
    const price = itemControl.get('price')?.value || 0;
    itemControl.get('total')?.setValue(quantity * price, { emitEvent: false });
    this.calculateGrandTotal();
  }

  calculateGrandTotal(): void {
    const itemsTotal = this.items.controls.reduce((sum, itemControl) => {
      const itemTotal = itemControl.get('total')?.value || 0;
      return sum + itemTotal;
    }, 0);
    this.invoiceForm.get('total')?.setValue(itemsTotal, { emitEvent: false });
  }

  onQuantityChange(itemControl: AbstractControl): void {
    this.calculateItemTotal(itemControl);
  }

  onPriceChange(itemControl: AbstractControl): void {
    this.calculateItemTotal(itemControl);
  }

  onDateOrTermsChange(): void {
    const createdAt = this.invoiceForm.get('createdAt')?.value;
    const paymentTerms = this.invoiceForm.get('paymentTerms')?.value;

    if (createdAt && paymentTerms) {
      const createdAtDate = new Date(createdAt);
      createdAtDate.setDate(createdAtDate.getDate() + paymentTerms);
      this.invoiceForm
        .get('paymentDue')
        ?.setValue(createdAtDate.toISOString().split('T')[0], { emitEvent: false });
    }
  }
}
