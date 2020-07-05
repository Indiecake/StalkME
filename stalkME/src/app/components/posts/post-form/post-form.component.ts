import { Component, OnInit, EventEmitter, Input, Output, ViewChild, ElementRef } from '@angular/core';
import { Post } from "../../models/post";
import { UserService } from "../../../services/user.service";
import { FormGroup, FormControl } from '@angular/forms';
import { PostService } from "../../../services/post.service";
import { Router, Params, ActivatedRoute } from "@angular/router";
import { UploadService } from "../../../services/upload.service";
import { global } from "../../../services/global";

@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.css'],
  providers: [UserService, PostService, UploadService]
})
export class PostFormComponent implements OnInit {
  post: Post;
  identity;
  token: string;
  status: string;
  postForm: FormGroup;
  url: string;

  constructor(private _userService: UserService,
    private _postService: PostService,
    private router: Router,
    private route: ActivatedRoute,
    private _uploadService: UploadService) {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.post = new Post('', '', '', '', this.identity._id);
    this.url = global.url;
  }

  ngOnInit(): void {

  }

  @ViewChild('fileInput')
  inptFile: ElementRef;

  onSubmit(form, $event) {
    this._postService.addPost(this.token, this.post).subscribe(
      Response => {
        if (Response.postStored) {
          if (this.filesToUpload && this.filesToUpload.length) {

            this._uploadService.makeFileRequest(`${this.url}uploadPostImage/${Response.postStored._id}`, [], this.filesToUpload, this.token, 'image')
              .then((result: any) => {

                this.post.file = result.image;
                form.reset();
                this.inptFile.nativeElement.value = "";
                this.router.navigate(['/timeline']);
                this.status = 'success';
                this.sended.emit({ send: true });
              });

          } else {
            form.reset();
            this.inptFile.nativeElement.value = "";
            this.router.navigate(['/timeline']);
            this.status = 'success';
            this.sended.emit({ send: true });
          }

        } else {
          this.status = 'error';
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

  filesToUpload: File[];

  fileChangeEvent(fileInput) {
    this.filesToUpload = <Array<File>>fileInput.target.files;
  }

  @Output() sended = new EventEmitter();
  sendPost(event) {
    this.sended.emit({ send: true });
    //this.sended.emit(this.post);
  }

}
