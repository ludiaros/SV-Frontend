import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PopoverController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-add-income',
  templateUrl: './add-income.component.html',
  styleUrls: ['./add-income.component.scss'],
})
export class AddIncomeComponent implements OnInit {
  @Output() incomeAdded = new EventEmitter<void>();
  @Input() movementId: number | null = null;

  incomeForm: FormGroup;
  isEditMode: boolean = false;
  incomeId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private popoverController: PopoverController
  ) {
    const today = new Date().toISOString().split('T')[0];

    this.incomeForm = this.fb.group({
      movement_date: [today, Validators.required],
      category_id: ['29', Validators.required],
      details: ['', Validators.required],
      income: ['', Validators.required],
    });
  }

  ngOnInit() {
    if (this.movementId) {
      this.isEditMode = true;
      this.loadMovementDetails(this.movementId);
    }
  }

  loadMovementDetails(movementId: number): void {
    this.api.getIncomeById(movementId).then(response => {
      
      this.incomeForm.setValue({
        movement_date: response.income[0].movement_date,
        category_id: response.income[0].category_id,
        details: response.income[0].details,
        income: response.income[0].value
      })
    }).catch(error => {
      console.error('Error al cargar los detalles del movimiento', error);
    });
  }

  async onSubmit(): Promise<void> {
    if (this.incomeForm.invalid) {
      return;
    }

    const incomeData = this.incomeForm.value;

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
