import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from "@angular/router";
import { User } from "../../models/user";
import { UserService } from "../../services/user.service";
import { error } from 'protractor';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css'],
  providers: [UserService]
})
export class SignInComponent implements OnInit {
  title: string;
  public user:User;
  public status: string;
  public identity;
  public token;

  constructor(private route: ActivatedRoute, router:Router, private _userServie:UserService ) {
    this.title = 'Bienvenido';
    this.user = new User('', '', '', '', '', '', 'ROLE_USER', '');
   }

  ngOnInit(): void {
  }

  onSubmit() {
    this._userServie.logIn(this.user).subscribe(
      Response =>{
        this.identity = Response.user;
        if(!this.identity && !this.identity._id) {
          this.status = 'error';
        } else {
          this.status = 'success';
          
          localStorage.setItem('identity', JSON.stringify(this.identity));
          
          this.getToken();

          
        }
        console.log(Response.user);
        this.status = 'success';
      },
      error => {
        let message = <any>error;
        console.log(message);
        
        if (message != null) {
          this.status = 'error';
        }
      }
    )
  }

  getToken() {
    this._userServie.logIn(this.user, true).subscribe(
      Response =>{
        this.token = Response.token;
        if(this.token.length <= 0) {
          this.status = 'error';
        } else {
          this.status = 'success';
          
          localStorage.setItem('token', this.token);
          
        }
        console.log(Response.user);
        this.status = 'success';
      },
      error => {
        let message = <any>error;
        console.log(message);
        
        if (message != null) {
          this.status = 'error';
        }
      }
    )
  }


}
