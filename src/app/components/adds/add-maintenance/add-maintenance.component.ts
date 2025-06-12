import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PopoverController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-add-maintenance',
  templateUrl: './add-maintenance.component.html',
  styleUrls: ['./add-maintenance.component.scss'],
  standalone: false,
})
export class AddMaintenanceComponent implements OnInit {

  @Output() maintenanceAdded = new EventEmitter<void>();
  @Input() maintenanceId: number | null = null;

  maintenanceForm: FormGroup;
  isEditMode: boolean = false;
  vehicles: any[] = [];
  maintenanceFields: any[] = [];

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private popoverController: PopoverController
  ) {

    const today = new Date().toISOString().split('T')[0];

    this.maintenanceForm = this.fb.group({
      plate: ['', Validators.required],
      maintenance_description: ['', Validators.required],
      date: [today, Validators.required],
      mileage: ['', Validators.required],
      paid: ['', Validators.required]
    });
  }

  async ngOnInit() {
    await this.loadVehicles();

    if (this.maintenanceId) {
      this.isEditMode = true;
      await this.loadMaintenanceDetails(this.maintenanceId);
    } else {
      if (this.vehicles.length > 0) {
        this.maintenanceForm.patchValue({
          plate: this.vehicles[0].plate
        });
      }
    }

    this.generateMaintenanceFields();
  }

  async loadVehicles(): Promise<void> {
    try {
      this.vehicles = (await this.api.getVehicles() as any[]) || [];
    } catch (error) {
      console.error('Error al cargar los vehículos:', error);
    }
  }

  generateMaintenanceFields() {
    this.maintenanceFields = [
      {
        type: 'select',
        label: 'Vehículo',
        placeholder: 'Placa',
        controlName: 'plate',
        options: this.vehicles.map((v: any) => ({ value: v.plate, label: v.plate }))
      },
      { type: 'input', label: 'Fecha', inputType: 'date', controlName: 'date' },
      { type: 'textarea', label: 'Descripción', placeholder: 'Campo obligatorio*', controlName: 'maintenance_description' },
      { type: 'input', label: 'Kilometraje', inputType: 'number', placeholder: 'Ej: 6000km', controlName: 'mileage' },
      { type: 'input', label: 'Valor', inputType: 'number', placeholder: 'Costo del mantenimiento', controlName: 'paid' }
    ];
  }

  async loadMaintenanceDetails(maintenanceId: number): Promise<void> {
    try {
      const response = await this.api.getMaintenanceById(maintenanceId);
      this.maintenanceForm.setValue({
        plate: response.plate,
        maintenance_description: response.maintenance_description,
        date: response.date,
        mileage: response.mileage,
        paid: response.paid
      });
    } catch (error) {
      console.error('Error al cargar los detalles del mantenimiento: ', error);
    }
  }

  async onSubmit(): Promise<void> {
    if (this.maintenanceForm.invalid) {
      this.maintenanceForm.markAllAsTouched();
      return;
    }

    const maintenanceData = this.maintenanceForm.value;

    try {
      if (this.isEditMode) {
        await this.api.updateMaintenance(this.maintenanceId!, maintenanceData);
      } else {
        await this.api.addMaintenance(maintenanceData);
      }

      this.maintenanceAdded.emit();
      await this.popoverController.dismiss({ maintenanceAdded: true });
    } catch (error) {
      console.error('Error al guardar el mantenimiento: ', error);
    }
  }
}
