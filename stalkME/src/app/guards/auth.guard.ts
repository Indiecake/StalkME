import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(
    private router: Router, private _userService: UserService
  ){

  }
  
  canActivate() {
      let identity = this._userService.getIdentity();
      
      if (identity && (identity.role == 'ROLE_USER' || identity.role == 'ROLE_ADMIN')) {
        return true;
      } else {
        this.router.navigate(['/signIn']);
        return false;
      }
  }
  
}
