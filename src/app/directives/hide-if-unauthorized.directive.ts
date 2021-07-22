import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Directive({
  selector: '[appHideIfUnauthorized]'
})

export class HideIfUnauthorizedDirective implements OnInit {
  @Input('appHideIfUnauthorized') permission: string[];

  constructor(private el: ElementRef, private authorizationService: AuthService) { }

  ngOnInit() {
      if (!this.authorizationService.isAuthorized(this.permission)) {
         this.el.nativeElement.style.display = 'none';
      }
  }
}