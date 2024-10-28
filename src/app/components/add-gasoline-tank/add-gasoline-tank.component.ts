import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-gasoline-tank',
  templateUrl: './add-gasoline-tank.component.html',
  styleUrls: ['./add-gasoline-tank.component.scss'],
})
export class AddGasolineTankComponent  implements OnInit {

  tankForm: FormGroup;
  isEditMode: boolean = false;

  constructor(private fb: FormBuilder) {
    this.tankForm = this.fb.group({
      plate: ['', Validators.required],
      refill_date: ['', Validators.required],
      mileage: ['', Validators.required],
      value: ['', Validators.required],
      
    });
   }

  ngOnInit() {}

  async onSubmit(): Promise<void> {
    if (this.tankForm.invalid) {
      return;
    }

    const tankData = this.tankForm.value;

    try {
      
    } catch (error) {
      console.error('Error al agregar tanqueo:', error);
    }
  }

}
