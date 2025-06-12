import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CameraSource } from '@capacitor/camera';
import { PopoverController, ActionSheetController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { PhotoService } from 'src/app/services/ui/photo.service';

@Component({
  selector: 'app-add-gasoline-tank',
  templateUrl: './add-gasoline-tank.component.html',
  styleUrls: ['./add-gasoline-tank.component.scss'],
  standalone: false,
})
export class AddGasolineTankComponent implements OnInit {

  @Output() tankAdded = new EventEmitter<void>();
  @Input() tankId: number | null = null;

  tankForm: FormGroup;
  isEditMode: boolean = false;
  isLoaded = false;
  selectedImage: string | null = null;
  vehicles: any = [];
  photoUrl: any;

  tankFields: any[] = [];

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private popoverController: PopoverController,
    public photoService: PhotoService,
    private actionSheetController: ActionSheetController
  ) {
    const today = new Date().toISOString().split('T')[0];

    this.tankForm = this.fb.group({
      plate: ['', Validators.required],
      tank_description: [''],
      date: [today, Validators.required],
      mileage: ['', Validators.required],
      paid: ['', Validators.required],
      photo_path: ['', Validators.required],
    });
  }

  async ngOnInit() {
    await this.loadVehicles();

    this.generateTankFields();

    if (this.tankId) {
      this.isEditMode = true;
      this.loadTankDetails(this.tankId);
    } else {
      if (this.vehicles.length > 0) {
        this.tankForm.patchValue({
          plate: this.vehicles[0].plate
        });
      }
    }
    // Mostramos el contenido después de que todo cargue
    setTimeout(() => {
      this.isLoaded = true;
    }, 100); // Pequeño delay para evitar el saltoF
  }

  async loadVehicles(): Promise<void> {
    try {
      this.vehicles = await this.api.getVehicles();
    } catch (error) {
      console.error('Error al cargar los vehículos:', error);
    }
  }

  generateTankFields() {
    this.tankFields = [
      {
        type: 'select',
        label: 'Vehículo',
        placeholder: 'Placa',
        controlName: 'plate',
        options: this.vehicles.map((v: any) => ({ value: v.plate, label: v.plate }))
      },
      { type: 'input', label: 'Fecha', inputType: 'date', controlName: 'date' },
      { type: 'textarea', label: 'Descripción', placeholder: '(No obligatorio)', controlName: 'tank_description' },
      { type: 'input', label: 'Kilometraje', inputType: 'number', placeholder: 'Ej: 6000km', controlName: 'mileage' },
      { type: 'input', label: 'Valor', inputType: 'number', placeholder: 'Costo del tanqueo', controlName: 'paid' },
      { type: 'button', label: 'Seleccionar Foto', icon: 'image-outline', action: () => this.selectImageSource() },
      { type: 'image', src: this.selectedImage }
    ];
  }

  async loadTankDetails(tankId: number): Promise<void> {
    try {
      const response = await this.api.getTankById(tankId);
      this.tankForm.setValue({
        plate: response.plate,
        tank_description: response.tank_description,
        date: response.date,
        mileage: response.mileage,
        paid: response.paid,
        photo_path: response.photo_path,
      });
      if (response.photo_path) {
        this.selectedImage = response.photo_path;
        this.generateTankFields(); // Refrescar campos con imagen cargada
      }
    } catch (error) {
      console.error('Error al cargar los detalles del movimiento: ', error);
    }
  }

  async selectImageSource() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Seleccionar fuente',
      buttons: [
        {
          text: 'Tomar Foto',
          icon: 'camera',
          handler: () => this.takePhoto()
        },
        {
          text: 'Seleccionar de Galería',
          icon: 'image',
          handler: () => this.selectFromGallery()
        },
        {
          text: 'Cancelar',
          icon: 'close',
          role: 'cancel'
        }
      ]
    });

    await actionSheet.present();
  }

  async takePhoto() {
    try {
      this.photoUrl = await this.photoService.addNewToGallery(CameraSource.Camera);
      this.tankForm.patchValue({
        photo_path: this.photoUrl.path
      });
      this.selectedImage = this.photoUrl.url;
      this.generateTankFields(); // Refrescar campos con imagen seleccionada
    } catch (error) {
      console.error('Error tomando la foto:', error);
    }
  }

  async selectFromGallery() {
    try {
      this.photoUrl = await this.photoService.addNewToGallery(CameraSource.Photos);
      this.tankForm.patchValue({
        photo_path: this.photoUrl.path
      });
      this.selectedImage = this.photoUrl.url;
      this.generateTankFields(); // Refrescar campos con imagen seleccionada
    } catch (error) {
      console.error('Error seleccionando la foto:', error);
    }
  }

  async onSubmit(): Promise<void> {
    if (this.tankForm.invalid) {
      this.tankForm.markAllAsTouched();
      return;
    }

    const tankData = this.tankForm.value;
    try {
      if (this.isEditMode) {
        await this.api.updateTank(this.tankId!, tankData);
      } else {
        await this.api.addTank(tankData);
      }

      this.tankAdded.emit();
      await this.popoverController.dismiss({ tankAdded: true });
    } catch (error) {
      console.error('Error al agregar tanqueo:', error);
    }
  }
}
