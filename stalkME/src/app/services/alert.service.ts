import { Injectable } from '@angular/core';
import Swal, { SweetAlertResult } from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor() {

  }

  static error(title: string, text): Promise<SweetAlertResult> {
    return Swal.fire({
      title,
      text,
      icon: 'error',
      confirmButtonText: 'Aceptar'
    });
  }

  static async confirm(title: string,
    text: string,
    confirmButtonText: string = 'Aceptar',
    cancelButtonText: string = 'Cancelar'): Promise<boolean> {
    return await Swal.fire({
      title,
      text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText,
      cancelButtonText
    }).then((result) => {
      return !!result.value;
    });
  }

  static toastError(title: string, text: string, html?: string): void {
    // @ts-ignore
    Swal.fire({
      title,
      text,
      html,
      toast: true,
      type: 'error',
      position: 'bottom',
      showConfirmButton: false,
      timer: 10000
    });
  }

  static toastSuccess(title: string, text: string, html?: string): void {
    // @ts-ignore
    Swal.fire({
      title,
      text,
      html,
      toast: true,
      type: 'success',
      position: 'bottom',
      showConfirmButton: false,
      timer: 10000
    });
  }
  
}


