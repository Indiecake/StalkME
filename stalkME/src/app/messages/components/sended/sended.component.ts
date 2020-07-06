import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute, Params } from "@angular/router";
import { Message } from "../../../models/message";
import { Follow } from "../../../models/follows";
import { FollowService } from 'src/app/services/follow.service';
import { MessageService } from "../../../services/message.service";
import { UserService } from "../../../services/user.service";
import { global } from "../../../services/global";
import { AlertService } from "../../../services/alert.service";

@Component({
  selector: 'app-sended',
  templateUrl: './sended.component.html',
  styleUrls: ['./sended.component.css'],
  providers: [MessageService, FollowService, UserService]
})
export class SendedComponent implements OnInit {
  title: string;
  messages: Message [];
  identity;
  token: string;
  url: string;
  status: string;
  follows: Follow[];
  page: number;
  prevPage: number;
  nextPage: number;
  pages: number;

  constructor(private titleService: Title, 
              private _messageService: MessageService,
              private _userService: UserService) {
    this.title = 'Mensajes enviados';
    this.titleService.setTitle(`${this.title} | StalkMe`);
    this.identity = this._userService.getIdentity();
    this.url = global.url;
    this.token = this._userService.getToken(); 
    this.page = 1;
   }

  ngOnInit(): void {
    this.getMessages(1);   
  }

  getMessages(page: number){
    this._messageService.sendedMessages(this.token, page).subscribe(
      Response => {        
        if (Response.messages) {          
          this.messages = Response.messages;
        }
      }, error => {
        console.log(<any>error);
        
        AlertService.error('Oh no!', 'Ha ocurrido un error');
      }
    )
  }

}
