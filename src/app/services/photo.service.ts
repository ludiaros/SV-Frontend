import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  constructor() { }

  public async addNewToGallery(source: CameraSource = CameraSource.Camera): Promise<string> {
    try {
      // Tomar foto o seleccionar de galería
      const capturedPhoto = await Camera.getPhoto({
        resultType: CameraResultType.Base64,
        source: source,
        quality: 75,
        allowEditing: false
      });

      // Retornar la foto en base64
      return `data:image/${capturedPhoto.format};base64,${capturedPhoto.base64String}`;
    } catch (error) {
      console.error('Error capturing photo:', error);
      throw error;
    }
  }
}