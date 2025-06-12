import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PopoverController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-add-observation',
  templateUrl: './add-observation.component.html',
  styleUrls: ['./add-observation.component.scss'],
  standalone: false,
})
export class AddObservationComponent implements OnInit {

  observationForm: FormGroup;
  observationFields = [
    {
      type: 'textarea',
      label: 'Observaciones',
      placeholder: '(No obligatorio)',
      controlName: 'observations'
    }
  ];

  @Output() observationAdded = new EventEmitter<void>();
  @Input() referralType: string | null = null;
  @Input() referralId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private popoverController: PopoverController
  ) {
    this.observationForm = this.fb.group({
      observations: [''],
    });
  }

  ngOnInit() {
    if (this.referralId && this.referralType) {
      this.loadRouteDetails(this.referralType, this.referralId);
    }
  }

  loadRouteDetails(referralType: string, referralId: number): void {
    this.api.getRouteById(referralType, referralId).then(response => {
      this.observationForm.setValue({
        observations: response.referral.observations,
      });
    }).catch(error => {
      console.error('Error al cargar los detalles de la ruta', error);
    });
  }

  async onSubmit(): Promise<void> {
    const observationData = this.observationForm.value;

    try {
      await this.api.addObservation(observationData, this.referralType!, this.referralId!);
      this.observationAdded.emit();
      await this.popoverController.dismiss({ observationAdded: true });

    } catch (error) {
      console.error('Error al guardar la observación', error);
    }
  }

}
