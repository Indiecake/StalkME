import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Post } from "../../models/post";
import { UserService } from "../../services/user.service";
import { global } from "../../services/global";
import { ActivatedRoute, Router, Params } from "@angular/router";
import { PostService } from "../../services/post.service";
import { AlertService } from "../../services/alert.service";
import * as $ from 'jquery';
import { Title } from '@angular/platform-browser';


@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css'],
  providers: [UserService, PostService]
})
export class PostsComponent implements OnInit {
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
  itemsPerPage: number;
  showImage;

  constructor(private _userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private _postService: PostService,
    private titleService: Title) {
      this.title = 'Linea del tiempo';
      this.url = global.url;
      this.identity = this._userService.getIdentity();
      this.token = this._userService.getToken();
      this.page = 1;
      this.noPagesLeft = false;
  }

  ngOnInit(): void {
    this.getPosts(this.page);
    this.titleService.setTitle(`${this.title} | StalkMe`);
  }


  getPosts(page: number, adding: boolean = false) {
    this._postService.getPosts(this.token, page).subscribe(
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
      this.getPosts(this.page, true);
    }

  }

  refresh(event) {
    if (event.send) {
      this.getPosts(1);
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
          this.getPosts(1);
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

  updateMetrics(){
    this._userService.getMetrics(this.identity._id).toPromise().then(response => {
      localStorage.setItem('stats', JSON.stringify(response));
    }).catch(err => {
      console.log(err);
    });

  }

}
