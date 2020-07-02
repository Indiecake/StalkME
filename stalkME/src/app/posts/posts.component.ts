import { Component, OnInit } from '@angular/core';
import { Post } from "../models/post";
import { UserService } from "../services/user.service";
import { global } from "../services/global";
import { ActivatedRoute, Router, Params } from "@angular/router";
import { PostService } from "../services/post.service";
import * as $ from 'jquery';

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
    this.getPosts(this.page);
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

            $("html, body").animate({scrollTop: $("body").prop("scrollHeight")}, 500);
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
    if ( this.page == this.pages ) {
      this.noPagesLeft = true;
      //alertSevice
    } else {
      this.page += 1;
      this.getPosts(this.page, true);
    }

  }

  refresh(event){    
    if (event.send) {
      this.getPosts(1);
      //this.posts.unshift(event.post);
    }
    
  }

}
