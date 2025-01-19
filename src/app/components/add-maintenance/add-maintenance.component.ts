import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PopoverController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-add-maintenance',
  templateUrl: './add-maintenance.component.html',
  styleUrls: ['./add-maintenance.component.scss'],
})
export class AddMaintenanceComponent implements OnInit {

  @Output() maintenanceAdded = new EventEmitter<void>();
  @Input() maintenanceId: number | null = null;

  maintenanceForm: FormGroup;
  isEditMode: boolean = false;
  vehicles: any;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private popoverController: PopoverController) {
    this.maintenanceForm = this.fb.group({
      plate: ['', Validators.required],
      maintenance_description: [''],
      date: ['', Validators.required],
      mileage: ['', Validators.required],
      paid: ['', Validators.required]
    });
  }

  async ngOnInit() {

    await this.loadVehicles();

    if (this.maintenanceId) {
      this.isEditMode = true;
      this.loadMaintenanceDetails(this.maintenanceId);
    } else {
      if (this.vehicles.length > 0) {
        this.maintenanceForm.patchValue({
          plate: this.vehicles[0].plate
        });
      }
    }
  }

  async loadVehicles(): Promise<void> {
    try {
      this.vehicles = await this.api.getVehicles();
    } catch (error) {
      console.error('Error al cargar los vehículos:', error);
    }
  }

  async loadMaintenanceDetails(maintenanceId: number): Promise<void> {
    this.api.getMaintenanceById(maintenanceId).then(response => {
      this.maintenanceForm.setValue({
        plate: response.plate,
        maintenance_description: response.maintenance_description,
        date: response.date,
        mileage: response.mileage,
        paid: response.paid
      });
    }).catch(error => {
      console.error('Error al cargar los detalles del mantenimiento: ', error);
    });
  }

  async onSubmit(): Promise<void> {
    if (this.maintenanceForm.invalid) {
      return;
    }

    const maintenanceData = this.maintenanceForm.value;
    if (this.isEditMode) {
      await this.api.updateMaintenance(this.maintenanceId!, maintenanceData).then(() => {

      }).catch(error => {
        console.error('Error al actualizar el mantenimiento: ', error);
      });
    } else {

      this.api.addMaintenance(this.maintenanceForm.value).then(() => {
        
      }).catch(error => {
        console.error('Error al agregar el mantenimiento: ', error);
      });
    }
    this.maintenanceAdded.emit();
    await this.popoverController.dismiss({ maintenanceAdded: true });
  }
}
