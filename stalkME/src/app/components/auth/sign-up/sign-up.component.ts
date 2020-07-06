import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from "@angular/router";
import { User } from "../../../models/user";
import { FormGroup } from '@angular/forms';
import { UserService } from "../../../services/user.service";
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
  providers: [UserService]
})
export class SignUpComponent implements OnInit {
  public title: string;
  public user: User;
  public status: string;
  registerForm: FormGroup;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private _userService: UserService,
    private titleService: Title) {

    //this.createRegisterForm();
    this.title = "Registro";
    this.titleService.setTitle(`${this.title} | StalkMe`);
    this.user = new User('',
      '',
      '',
      '',
      '',
      '',
      'ROLE_USER',
      ''
    );
  }

  ngOnInit(): void {
  }

  // private createRegisterForm() {
  //   this.registerForm = this.formBuilder.group({
  //     name: ['', Validators.required],
  //     surname: ['', Validators.required],
  //     nick: ['', Validators.required],
  //     email: ['', Validators.email],
  //     password: ['', Validators.required]
  //   });
  // }

  onSubmit(form) {
    this._userService.register(this.user).subscribe(
      Response => {
        if (Response.user && Response.user._id) {
          this.status = 'success';
          form.reset();
        } else {
          this.status = 'error';
        }
      },
      error => {
        console.log(<any>error);

      }
    );
  }

}
