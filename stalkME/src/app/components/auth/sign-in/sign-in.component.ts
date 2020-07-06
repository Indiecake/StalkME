import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from "@angular/router";
import { User } from "../../../models/user";
import { UserService } from "../../../services/user.service";
import { Title } from '@angular/platform-browser';

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

  constructor(private route: ActivatedRoute, 
              private router:Router, 
              private _userServie:UserService,
              private titleService: Title ) {
    this.title = 'Bienvenido';
    this.titleService.setTitle('Iniciar sesion | StalkMe');
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
          localStorage.setItem('identity', JSON.stringify(this.identity));
          
          this.getToken();
 
        }
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
          
          localStorage.setItem('token', this.token);
          
          this.getMetrics();
        }
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

  getMetrics(){
    this._userServie.getMetrics().subscribe(
      Response => {
        localStorage.setItem('stats', JSON.stringify(Response));
        this.status = 'success';
        this.router.navigate(['/']);
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
