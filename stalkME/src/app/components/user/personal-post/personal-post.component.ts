import { Component, OnInit, Input } from '@angular/core';
import { Post } from "../../models/post";
import { UserService } from "../../../services/user.service";
import { global } from "../../../services/global";
import { ActivatedRoute, Router, Params } from "@angular/router";
import { PostService } from "../../../services/post.service";
import { AlertService } from "../../../services/alert.service";
import * as $ from 'jquery';

@Component({
  selector: 'app-personal-post',
  templateUrl: './personal-post.component.html',
  styleUrls: ['./personal-post.component.css'],
  providers: [UserService, PostService]
})
export class PersonalPostComponent implements OnInit {
  posts: Post[];
  identity;
  token: string;
  status: string;
  title: string;
  url: string;
  page: number;
  pages: number;
  total: number;
  noPagesLeft: boolean;
  itemsPerPage: string;
  showImage: number;

  constructor(private _userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private _postService: PostService) {
    this.title = 'Linea del tiempo';
    this.url = global.url;
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.page = 1;
    this.noPagesLeft = false;
  }

  ngOnInit(): void {
    this.getPosts(this.userId, this.page);
  }

  @Input() userId: string;

  getPosts(user: string, page: number, adding: boolean = false) {
    this._postService.getPostPerUser(this.token, user, page).subscribe(
      Response => {
        if (Response.posts) {
          this.total = Response.totalItems;
          this.pages = Response.pages;
          this.itemsPerPage = Response.itemsPerPage;
          if (!adding) {
            this.posts = Response.posts;
          } else {
            let loadedRecords = this.posts;
            let nextPage = Response.posts;
            this.posts = loadedRecords.concat(nextPage);

            $("html, body").animate({ scrollTop: $("body").prop("scrollHeight") }, 500);
          }


          if (page > this.pages) {
            this.router.navigate(['/home']);
          }
          this.status = 'success';
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

  viewMorePosts() {
    if (this.page == this.pages) {
      this.noPagesLeft = true;
      //alertSevice
    } else {
      this.page += 1;
      this.getPosts(this.userId, this.page, true);
    }

  }

  refresh(event) {
    if (event.send) {
      this.getPosts(this.userId, 1);
      //this.posts.unshift(event.post);
    }

  }

  showPostImage(postId) {
    if (this.showImage == postId) {
      this.showImage = 0;
    } else {
      this.showImage = postId;
    }
  }

  async deletePost(id) {
    if (await AlertService.confirm('Eliminar', 'Estas seguro de que quieres eliminar esta publicacion')) {
      this._postService.deletePost(this.token, id).subscribe(
        Response => {
          this.status = 'success';
          this.updateMetrics();
          this.getPosts(this.userId, 1);
          AlertService.toastSuccess('Se eliminó correctamente', '');
        },
        error => {
          let message = <any>error;
          AlertService.toastError('No se pudo eliminar', '');
          if (message != null) {
            this.status = 'error';
          }
        }
      );
    }
  }

  updateMetrics() {
    this._userService.getMetrics(this.identity._id).toPromise().then(response => {
      localStorage.setItem('stats', JSON.stringify(response));
    }).catch(err => {
      console.log(err);
    });
  }
  
}