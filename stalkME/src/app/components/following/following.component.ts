import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from "@angular/router";
import { Follow } from "../models/follows";
import { User } from "../models/user";
import { UserService } from "../../services/user.service";
import { FollowService } from "../../services/follow.service";
import { global } from "../../services/global";
import { AlertService } from "../../services/alert.service";

@Component({
  selector: 'app-following',
  templateUrl: './following.component.html',
  styleUrls: ['./following.component.css'],
  providers: [UserService, FollowService]
})
export class FollowingComponent implements OnInit {
  identity;
  token: string;
  status: string;
  title: string;
  url: string;
  total: number;
  pages: number;
  page: number;
  nextPage: number;
  prevPage: number;
  follows;
  following;
  followingUserOver;
  userPageId: string;
  user:User;

  constructor(private route: ActivatedRoute, private router: Router, private _userService: UserService, private _followService: FollowService) {
    this.title = 'Usuarios seguidos por';
    this.identity = _userService.getIdentity();
    this.token = _userService.getToken();
    this.url = global.url;
  }

  ngOnInit(): void {
    this.actualPage();
  }

  actualPage() {
    this.route.params.subscribe(params => {
      let page =+ params['page'];
      this.userPageId = params['id'];
      this.page = page;
      if (!params['page']) {
        page = 1;
      }
      if (!page) {
        page = 1;
      } else {
        this.nextPage = page + 1;
        this.prevPage = page - 1;
        
        if (this.prevPage <= 0) {
          this.prevPage = 1;
        }
      }
      this.getUser(this.userPageId, page);
    });
  }

  getFollows(userId:string, page: number) {
    this._followService.getFollowing(this.token, userId, page).subscribe(
      Response => {
        if (!Response.follows) {
          this.status = 'error';
          AlertService.info('404', 'Parece que aun no sigues a nadie');
        } else {
          
          this.total = Response.total;
          this.following = Response.follows;
          this.pages = Response.pages;
          this.follows = Response.usersFollowing;
          if(page > this.pages) {
            this.router.navigate(['/users', 1]);
          }
          this.status = 'success';
        }
      },
      error => {
        let message = <any>error;
        console.log(message);
        AlertService.error('Oh no !', 'Ha ocurrido un error!');
        if (message!= null) {
          this.status = 'error';
          AlertService.error('Oh no !', 'Ha ocurrido un error');
        }
      }
    )
  }

  mouseEnter(user_id){
    this.followingUserOver = user_id;
  }

  mouseLeave(){
    this.followingUserOver = 0;
  }

  followUser(followed) {

    let follow = new Follow('', this.identity._id, followed);

    this._followService.addFollow(this.token, follow).subscribe(
      Response => {
        if (!Response.data.followed) {
          this.status = 'error';          
        } else{
          this.status = 'success';
          this.follows.push(followed);    
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

  unFollowUser(followed){
    this._followService.deleteFollow(this.token, followed).subscribe(
      Response => {
        let search = this.follows.indexOf(followed);
        if(search != -1) {
          this.follows.splice(search, 1);
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


  getUser(id:string, page: number){
    this._userService.getUser(id).subscribe(
      Response => {
        if (Response.user) {          
          this.user = Response.user;
          this.getFollows(this.userPageId, page);
        } else {
          this.router.navigate(['/home']);
          AlertService.info('404', 'Ese usuario no existe!');
        }

      }, error => {
        let message = <any>error;
        console.log(message);
        if (message!= null) {
          this.status = 'error';
        }
      }
    );
  }

}
