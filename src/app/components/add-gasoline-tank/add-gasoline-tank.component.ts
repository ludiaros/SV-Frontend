import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CameraSource } from '@capacitor/camera';
import { PopoverController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { PhotoService } from 'src/app/services/photo.service';
import { ActionSheetController } from '@ionic/angular';

@Component({
  selector: 'app-add-gasoline-tank',
  templateUrl: './add-gasoline-tank.component.html',
  styleUrls: ['./add-gasoline-tank.component.scss'],
})
export class AddGasolineTankComponent implements OnInit {

  @Output() tankAdded = new EventEmitter<void>();
  @Input() tankId: number | null = null;

  tankForm: FormGroup;
  isEditMode: boolean = false;
  selectedImage: string | null = null;

  constructor(private fb: FormBuilder,
    private api: ApiService,
    private popoverController: PopoverController,
    public photoService: PhotoService,
    private actionSheetController: ActionSheetController) {
    this.tankForm = this.fb.group({
      plate: ['', Validators.required],
      tank_description: [''],
      date: ['', Validators.required],
      mileage: ['', Validators.required],
      paid: ['', Validators.required],
      photo: [''],
    });
  }

  ngOnInit() {
    if (this.tankId) {
      this.isEditMode = true;
      this.loadTankDetails(this.tankId);
    }
  }

  async loadTankDetails(tankId: number): Promise<void> {
    this.api.getTankById(tankId).then(response => {
      this.tankForm.setValue({
        plate: response.plate,
        tank_description: response.tank_description,
        date: response.date,
        mileage: response.mileage,
        paid: response.paid,
        photo: response.photo,
      });
      if (response.photo) {
      this.selectedImage = response.photo;
    }    
    }).catch(error => {
      console.error('Error al cargar los detalles del movimiento: ', error);
    });
  }

  async addPhotoToGallery(source: CameraSource = CameraSource.Camera) {
    try {
      const base64Image = await this.photoService.addNewToGallery(source);
      this.selectedImage = base64Image;
      this.tankForm.patchValue({
        photo: base64Image
      });
    } catch (error) {
      console.error('Error adding photo:', error);
    }
  }

  async selectImageSource() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Seleccionar fuente',
      buttons: [
        {
          text: 'Tomar Foto',
          icon: 'camera',
          handler: () => {
            this.addPhotoToGallery(CameraSource.Camera);
          }
        },
        {
          text: 'Seleccionar de Galería',
          icon: 'image',
          handler: () => {
            this.addPhotoToGallery(CameraSource.Photos);
          }
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

  async onSubmit(): Promise<void> {
    if (this.tankForm.invalid) {
      return;
    }
    
    const tankData = this.tankForm.value;
    try {
      if (this.isEditMode) {
        await this.api.updateTank(this.tankId!, tankData);
      } else {
        await this.api.addTank(tankData);
      }
      
      // Emitir el evento después de agregar/actualizar
      this.tankAdded.emit();
      await this.popoverController.dismiss({ tankAdded: true });
    } catch (error) {
      console.error('Error al agregar tanqueo:', error);
    }
  }

}
