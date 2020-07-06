import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { global } from "./global";
import { Message } from "../models/message";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  url: string;

  constructor(private http: HttpClient) { 
    this.url = global.url;
  }

  newMessage(token:string, message:Message): Observable<any>{
    let params = JSON.stringify(message);
    let headers = global.headers.set('Authorization', token);

    return this.http.post(`${this.url}message`, params, {headers: headers});
  }

  receivedMessages(token:string, page: number = 1): Observable<any> {
    let headers = global.headers.set('Authorization', token);
    return this.http.get(`${this.url}messages/received/${page}`, {headers: headers});
  }

  sendedMessages(token:string, page: number = 1): Observable<any> {
    let headers = global.headers.set('Authorization', token);
    return this.http.get(`${this.url}messages/sended/${page}`, {headers: headers});
  }



}
