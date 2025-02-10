import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PopoverController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-add-income',
  templateUrl: './add-income.component.html',
  styleUrls: ['./add-income.component.scss'],
  standalone: false,
})
export class AddIncomeComponent implements OnInit {
  @Output() incomeAdded = new EventEmitter<void>();
  @Input() movementId: number | null = null;

  incomeForm: FormGroup;
  isEditMode: boolean = false;
  incomeId: number | null = null;
  clients: any[] = [];

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private popoverController: PopoverController
  ) {
    const today = new Date().toISOString().split('T')[0];

    this.incomeForm = this.fb.group({
      movement_date: [today, Validators.required],
      category_id: ['29', Validators.required],
      details: [''],
      income: ['', Validators.required],
      selectedClient: [null, Validators.required],
      receiptNumber: ['', Validators.required],
      additionalDetails: ['']
    });
  }

  ngOnInit() {
    this.loadClients();
    if (this.movementId) {
      this.isEditMode = true;
      this.loadMovementDetails(this.movementId);
    }
  }

  async loadClients() {
    try {
      const response: any = await this.api.getClient();
      this.clients = response;
    } catch (error) {
      console.error('Error loading clients:', error);
    }
  }

  loadMovementDetails(movementId: number): void {
    this.api.getIncomeById(movementId).then(response => {
      const income = response.income[0];
      
      // Parse the details string
      const details = income.details;
      let clientName = '';
      let receiptNumber = '';
      let additionalDetails = '';

      if (details) {
        // Extract client name (everything before " - #")
        const clientMatch = details.match(/(.*?) - #/);
        clientName = clientMatch ? clientMatch[1] : '';

        // Extract receipt number (between "- #" and optional " (")
        const receiptMatch = details.match(/- #(\d+)(?:\s+\(.*\))?$/);
        receiptNumber = receiptMatch ? receiptMatch[1] : '';

        // Extract additional details (everything between parentheses)
        const detailsMatch = details.match(/\((.*?)\)$/);
        additionalDetails = detailsMatch ? detailsMatch[1] : '';
      }

      // Find the client in the clients array
      const selectedClient = this.clients.find(c => c.client_name === clientName);

      // Ensure category_id is a string
      const categoryId = income.category_id?.toString() || '29';

      this.incomeForm.patchValue({
        movement_date: income.movement_date,
        category_id: categoryId,
        income: income.value,
        selectedClient: selectedClient,
        receiptNumber: receiptNumber,
        additionalDetails: additionalDetails
      });

      // Force change detection for category_id
      this.incomeForm.get('category_id')?.updateValueAndValidity();
    }).catch(error => {
      console.error('Error al cargar los detalles del movimiento', error);
    });
  }

  async onSubmit(): Promise<void> {
    if (this.incomeForm.invalid) {
      return;
    }

    const formValues = this.incomeForm.value;
    const clientName = formValues.selectedClient?.client_name || '';
    const receiptNumber = formValues.receiptNumber || '';
    const additionalDetails = formValues.additionalDetails || '';

    // Concatenate the details
    const concatenatedDetails = `${clientName} - #${receiptNumber}${additionalDetails ? ` (${additionalDetails})` : ''}`;
    
    const incomeData = {
      movement_date: formValues.movement_date,
      category_id: formValues.category_id,
      details: concatenatedDetails,
      income: formValues.income
    };

    try {
      if (this.isEditMode) {
        this.api.updateIncome(this.movementId!, incomeData).then(response => {
          console.log('Ingreso actualizado:', response);
        }).catch(error => {
          console.error('Error al actualizar ingreso:', error);
        });
      } else {
        const response = await this.api.addIncome(incomeData);
        console.log('Ingreso agregado:', response);
      }

      this.incomeAdded.emit();

      await this.popoverController.dismiss();
    } catch (error) {
      console.error('Error al agregar ingreso:', error);
    }
  }
}
