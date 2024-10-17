import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PopoverController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-add-observation',
  templateUrl: './add-observation.component.html',
  styleUrls: ['./add-observation.component.scss'],
})
export class AddObservationComponent  implements OnInit {

  observationForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private popoverController: PopoverController
  ) {
    this.observationForm = this.fb.group({ 
      observation: ['', Validators.required],
     });
   }

  ngOnInit() {
    return 0
  }

  async onSubmit(): Promise<void> {
    if (this.observationForm.invalid) {
      return;
    }

    const observationData = this.observationForm.value;

    try {
      await this.api.addObservation(observationData);
      this.popoverController.dismiss();
    } catch (error) {
      console.error('Error al guardar la observación', error);
    }
  }

}
