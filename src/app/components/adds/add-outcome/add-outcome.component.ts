import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-add-outcome',
  templateUrl: './add-outcome.component.html',
  styleUrls: ['./add-outcome.component.scss'],
  standalone: false,
})
export class AddOutcomeComponent implements OnInit {

  @Output() outcomeAdded = new EventEmitter<void>();
  @Input() movementId: number | null = null;

  outcomeForm: FormGroup;
  isEditMode: boolean = false;
  outcomeId: number | null = null;

  outcomeFields = [
    { type: 'input', label: 'Fecha', inputType: 'date', controlName: 'movement_date' },
    { type: 'textarea', label: 'Detalles', placeholder: 'Campo obligatorio*', controlName: 'details' },
    { type: 'input', label: 'Valor', inputType: 'number', placeholder: 'Ingrese el gasto', controlName: 'outcome' },
    {
      type: 'select', label: 'Categoría', placeholder: '', controlName: 'category_id', options: [
        { value: 3, label: 'Gastos' },
        { value: 24, label: 'Compras' }
      ]
    }
  ];

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private popoverController: PopoverController,
  ) {
    const today = new Date().toISOString().split('T')[0];
    this.outcomeForm = this.fb.group({
      movement_date: [today, Validators.required],
      category_id: ['3', Validators.required],
      details: ['', Validators.required],
      outcome: ['', Validators.required]
    });
  }

  ngOnInit() {
    if (this.movementId) {
      this.isEditMode = true;
      this.loadMovementDetails(this.movementId);
    }
  }

  loadMovementDetails(movementId: number): void {
    this.api.getOutcomeById(movementId).then(response => {

      this.outcomeForm.setValue({
        movement_date: response.outcome[0].movement_date,
        category_id: response.outcome[0].category_id,
        details: response.outcome[0].details,
        outcome: response.outcome[0].value
      })
    }).catch(error => {
      console.error('Error al cargar los detalles del movimiento', error);
    });
  }

  async onSubmit(): Promise<void> {
    if (this.outcomeForm.invalid) {
      return;
    }

    const outcomeData = this.outcomeForm.value;

    try {
      if (this.isEditMode) {
        this.api.updateOutcome(this.movementId!, outcomeData).then(response => {
          console.log('Gasto actualizado:', response);
        }).catch(error => {
          console.error('Error al actualizar gasto:', error);
        });
      } else {
        const response = await this.api.addOutcome(outcomeData);
        console.log('Gasto agregado:', response);
      }

      this.outcomeAdded.emit();

      await this.popoverController.dismiss();
    } catch (error) {
      console.error('Error al agregar gasto:', error);
    }
  }
}
