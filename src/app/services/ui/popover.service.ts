import { Injectable } from '@angular/core';
import { PopoverController, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class PopoverService {

  constructor(
    private popoverController: PopoverController,
    private toastController: ToastController
  ) { }

  /**
   * Muestra un popover centrado en la pantalla.
   * @param component Componente que se mostrará dentro del popover.
   * @param props Props opcionales a pasar al componente.
   * @param onDismiss Callback opcional cuando se cierra el popover.
   * @param cssClass Clase CSS opcional para personalizar estilos.
   */
  async showPopover(component: any, props: any = {}, onDismiss: () => Promise<void> = async () => { }, cssClass: string = 'custom-popover') {
    const popover = await this.popoverController.create({
      component,
      cssClass,
      showBackdrop: true,
      backdropDismiss: true,
      componentProps: props,
      event: undefined, // 👈 Obligatorio para que no calcule posición
      reference: 'event', // 👈 Obligatorio para que no busque un trigger
      side: 'top', // Opcional, posición base
      alignment: 'center' // Opcional, centra horizontalmente
    });

    popover.onDidDismiss().then(() => onDismiss());
    await popover.present();
  }

  /**
   * Muestra un toast de confirmación con botones personalizados.
   * @param message Texto a mostrar en el toast.
   * @param buttons Botones personalizados (por ejemplo: aceptar, cancelar).
   * @param onDismiss Callback opcional cuando se cierra el toast.
   * @param cssClass Clase CSS opcional para personalizar estilos.
   */
  async showConfirmationToast(message: string, buttons: any[], onDismiss: () => void = () => { }, cssClass: string = 'custom-toast') {
    const toast = await this.toastController.create({
      position: 'middle',
      message,
      color: 'warning',
      buttons,
      cssClass
    });

    toast.onDidDismiss().then(() => onDismiss());
    await toast.present();
  }
}
