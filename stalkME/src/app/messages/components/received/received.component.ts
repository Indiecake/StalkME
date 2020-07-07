import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { MessageService } from '../../../services/message.service';
import { AlertService } from '../../../services/alert.service';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { global } from "../../../services/global";


@Component({
  selector: 'app-received',
  templateUrl: './received.component.html',
  styleUrls: ['./received.component.css'],
  providers: [UserService, MessageService]
})
export class ReceivedComponent implements OnInit {
  title: string;
  messages: Message[];
  identity;
  token: string;
  page: number;
  pages: number;
  prevPage: number;
  nextPage: number;
  url:string;

  constructor(private titleService: Title,
              private _messageService: MessageService,
              private route: ActivatedRoute,
              private _userService: UserService) {
    this.title = 'Mensajes recibidos ';
    titleService.setTitle(`${this.title} | StalkMe`);
    this.token = _userService.getToken();
    this.url = global.url;
    this.identity = _userService.getIdentity();
   }

  ngOnInit(): void {
    this.actualPage(this.token)
  }

  getRecievedMessages(token: string, page: number) {
    this._messageService.receivedMessages(token, page).subscribe(
      Response => {
        if (Response.messages) {
          this.messages = Response.messages;
          this.pages = Response.pages;
          
        }
      },
      error => {
        console.log(<any>error);
        AlertService.error('Error', 'error');
      }
    );
  }

  actualPage(token: string) {
    this.route.params.subscribe(params => {
      let page =+ params['page'];
      this.page = page;
      if (!params['page']) {
        page = 1;
      }

      if (!page) {
        page = 1
      } else {
        this.nextPage = page + 1;
        this.prevPage = page - 1;
        if (this.page <= 0) {
          this.prevPage =1
        }
      }
      this.getRecievedMessages(token, page);
    });
  }

}
