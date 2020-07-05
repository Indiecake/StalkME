import { Component, OnInit } from '@angular/core';
import { Router, Params, ActivatedRoute } from "@angular/router";
import { User } from "../../models/user";
import { UserService } from "../../../services/user.service";
import { UploadService } from "../../../services/upload.service";
import { global } from "../../../services/global";

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css'],
  providers: [UserService, UploadService]
})
export class EditUserComponent implements OnInit {
  public title: string;
  public status: string;
  public user:User;
  public identity;
  public token;
  public url: string;
  public filesToUpload: Array<File>;

  constructor(private route: ActivatedRoute, 
              private router: Router, 
              private _userService: UserService,
              private _uploadService: UploadService) { 
    this.title = 'Actualizar mis datos';
    this.user = this._userService.getIdentity();
    this.identity = this.user;
    this.token = this._userService.getToken();
    this.url = global.url;
  }

  ngOnInit(): void {
    
  }

  onSubmit(){
    this._userService.updateUser(this.user).subscribe(
      Response => {
        if (!Response.user) {
          this.status = 'error';
        } else {
          this.status = 'success';
          localStorage.setItem('identity', JSON.stringify(this.user));
          this.identity = this.user;

          //upload image
          this._uploadService.makeFileRequest(`${this.url}uploadAvatar/${this.user._id}`, [], this.filesToUpload, this.token, 'image')
          .then((result: any) => {
            this.user.image = result.user.image;
            localStorage.setItem('identity', JSON.stringify(this.user));
          });
        }
      },
      error => {
        let message = <any>error;
        console.log(message);
        if (message != null) {
          this.status = 'error'; 
        }
      }
    );
  }
  
  fileChangeEvent(fileInput:any){
    this.filesToUpload = <Array<File>>fileInput.target.files;
  }

}
