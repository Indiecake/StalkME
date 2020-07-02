import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { Post } from "../../models/post";
import { UserService } from "../../services/user.service";
import { FormGroup, FormControl } from '@angular/forms';
import { PostService } from "../../services/post.service";
import { Router, Params, ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.css'],
  providers: [UserService, PostService]
})
export class PostFormComponent implements OnInit {
  post: Post;
  identity;
  token: string;
  status: string;
  postForm: FormGroup;

  constructor( private _userService: UserService,
               private _postService: PostService,
               private router: Router,
               private route: ActivatedRoute) {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.post = new Post('', '', '', '', this.identity._id);
   }

  ngOnInit(): void {

  }

  onSubmit(form) {
    this._postService.addPost(this.token, this.post).subscribe(
      Response => {
        if (Response.postStored) {
          //this.post = Response.postStored;
          form.reset();
          //this.router.navigate(['/timeline']);
          this.status = 'success';
        } else {
          this.status = 'error';
        }
      },
      error => {
        let message = <any>error;
        console.log(message);
        if (message!= null) {
          this.status = 'error';
        }
      }
    );
  }

  fileChangeEvent(any){
    
  }

  @Output() sended = new EventEmitter();
  sendPost(event){
    this.sended.emit({send: true});
    //this.sended.emit(this.post);
  }

}
