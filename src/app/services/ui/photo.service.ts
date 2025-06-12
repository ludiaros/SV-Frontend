import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  constructor(private apiService: ApiService) { }

  public async addNewToGallery(source: CameraSource = CameraSource.Camera): Promise<string> {
    try {
      const capturedPhoto = await Camera.getPhoto({
        resultType: CameraResultType.Base64,
        source: source,
        quality: 10,
        allowEditing: false
      });

      // Verificar que la imagen existe
      if (!capturedPhoto.base64String) {
        throw new Error('No image data available');
      }

      // Crear un objeto FormData con la imagen
      const photoData = {
        image: capturedPhoto.base64String,
        format: capturedPhoto.format
      };

      // Enviar la imagen al backend y obtener la URL
      const response = await this.apiService.uploadPhoto(photoData);
      return response;
    } catch (error) {
      console.error('Error capturing/uploading photo:', error);
      throw error;
    }
  }
}