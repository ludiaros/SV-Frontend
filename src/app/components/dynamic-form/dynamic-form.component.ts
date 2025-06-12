import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss'],
  standalone: false
})
export class DynamicFormComponent {

  @Input() form!: FormGroup;
  @Input() fields: any[] = [];
  @Input() title: string = '';
  @Input() buttonText: string = 'Guardar';
  @Input() isEditMode: boolean = false;
  @Input() dynamicOptions: { [key: string]: any[] } = {}; // key = controlName

  @Output() formSubmit = new EventEmitter<void>();

  onSubmit() {
    if (this.form.valid) {
      this.formSubmit.emit();
    } else {
      this.form.markAllAsTouched();
    }
  }

  getNgSelectOptions(field: any): any[] {
    // Si el campo tiene options estáticas, úsalas
    if (field.options) return field.options;

    // Si es un ng-select, busca las options dinámicas por controlName
    return this.dynamicOptions[field.controlName] || [];
  }
}
