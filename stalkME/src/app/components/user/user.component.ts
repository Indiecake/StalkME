import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from "@angular/router";
import { User } from "../../models/user";
import { UserService } from "../../services/user.service";
import { FollowService } from "../../services/follow.service";
import { global } from "../../services/global";
import { Follow } from '../../models/follows';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
  providers: [UserService, FollowService]
})
export class UserComponent implements OnInit {
  public title: string;
  public identity;
  public token: string;
  public page: number;
  public nextPage: number;
  public prevPage: number;
  public status: string;
  public total: number;
  public pages: number;
  public users: User[];
  public url: string;
  public follows;
  public followingUserOver;

  constructor(private route: ActivatedRoute, 
              private router: Router, 
              private _userService: UserService, 
              private _followService: FollowService,
              private titleService: Title) {
    this.title = 'Gente';
    this.titleService.setTitle(`${this.title} | StalkMe`);
    this.identity = _userService.getIdentity();
    this.token = _userService.getToken();
    this.url = global.url;
  }

  ngOnInit(): void {
    this.actualPage()
  }

  actualPage() {
    this.route.params.subscribe(params => {
      let page = +params['page'];
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
      this.getUsers(page)
    });
  }

  getUsers(page: number) {
    this._userService.getUsers(page).subscribe(
      Response => {
        if (!Response.users) {
          this.status = 'error';
        } else {
          this.total = Response.total;
          this.users = Response.users;
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
        if (message!= null) {
          this.status = 'error';
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

}
