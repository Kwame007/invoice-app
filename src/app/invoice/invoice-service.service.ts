import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Invoice } from '../app.module';

@Injectable({
  providedIn: 'root',
})
export class InvoiceService {
  private invoicesSubject = new BehaviorSubject<Invoice[]>([]);
  public invoices$: Observable<Invoice[]> = this.invoicesSubject.asObservable();
  private isLoaded = false;
  private readonly STORAGE_KEY = 'invoices';

  constructor(private http: HttpClient) {
    this.loadAllInvoices();
  }

  getInvoices(id: string): Invoice | undefined {
    // If not loaded yet, try to load from localStorage first
    if (!this.isLoaded) {
      const storedInvoices = this.loadFromLocalStorage();
      if (storedInvoices.length > 0) {
        this.invoicesSubject.next(storedInvoices);
        this.isLoaded = true;
      }
    }

    const currentInvoices = this.invoicesSubject.getValue();
    const invoice = currentInvoices.find(inv => inv.id === id);
    if (!invoice) {
      console.error('Invoice not found:', id);
      return undefined;
    }
    return invoice;
  }

  private loadFromLocalStorage(): Invoice[] {
    const storedData = localStorage.getItem(this.STORAGE_KEY);
    if (storedData) {
      try {
        return JSON.parse(storedData);
      } catch (error) {
        console.error('Error parsing stored invoices:', error);
        return [];
      }
    }
    return [];
  }

  private saveToLocalStorage(invoices: Invoice[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(invoices));
    } catch (error) {
      console.error('Error saving invoices to localStorage:', error);
    }
  }

  loadAllInvoices(): void {
    if (!this.isLoaded) {
      // First try to load from localStorage
      const storedInvoices = this.loadFromLocalStorage();
      if (storedInvoices.length > 0) {
        this.invoicesSubject.next(storedInvoices);
        this.isLoaded = true;
      }

      // Then load from API to ensure we have the latest data
      this.http.get<Invoice[]>('/assets/data.json').subscribe({
        next: data => {
          this.invoicesSubject.next(data);
          this.saveToLocalStorage(data);
          this.isLoaded = true;
        },
        error: error => {
          console.error('Error loading invoices:', error);
          // If API fails and we don't have data from localStorage, set empty array
          if (!this.isLoaded) {
            this.invoicesSubject.next([]);
            this.isLoaded = true;
          }
        },
      });
    }
  }

  addInvoice(invoice: Invoice): void {
    const currentInvoices = this.invoicesSubject.getValue();
    const newInvoices = [...currentInvoices, invoice];
    this.invoicesSubject.next(newInvoices);
    this.saveToLocalStorage(newInvoices);
  }

  updateInvoice(invoice: Invoice): void {
    const currentInvoices = this.invoicesSubject.getValue();
    const toBeUpdatedInvoice = currentInvoices.filter(inv => inv.id === invoice.id)[0];
    if (!toBeUpdatedInvoice) {
      console.error('Invoice not found for update:', invoice.id);
      return;
    }
    const updatedInvoices = currentInvoices.map(inv =>
      inv.id === invoice.id ? { ...inv, ...invoice } : inv,
    );
    this.invoicesSubject.next(updatedInvoices);
    this.saveToLocalStorage(updatedInvoices);
  }

  deleteInvoice(id: string): void {
    const currentInvoices = this.invoicesSubject.getValue();
    const updatedInvoices = currentInvoices.filter(inv => inv.id !== id);
    this.invoicesSubject.next(updatedInvoices);
    this.saveToLocalStorage(updatedInvoices);
  }
}
