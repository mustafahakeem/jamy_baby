import { Injectable } from '@angular/core';
import { ToasterService, Toast } from 'angular2-toaster/angular2-toaster';

@Injectable()
export class NotificationService {
  constructor(private toastr: ToasterService) { }

  public success = (body: string, title = 'Operation successful'): Toast => {
   return this.toastr.pop({
     body: body,
     title: title,
     type: 'success',
     onShowCallback : (toast) : void =>{

     },
     onHideCallback : (toast) : void =>{

     },
     clickHandler : (toast, isCloseButton) : boolean =>{

       return true;
     }
   });
  }

  public error = (body: string, title = 'An error occured'): Toast => {
    return this.toastr.pop({ body: body, title: title, type: 'error'});
  }

  public warning = (body: string, title = 'Something went wrong'): Toast => {
    return this.toastr.pop({ body: body, title: title, type: 'warning'});
  }

  public clear = (): void => {
    this.toastr.clear();
  }
}
