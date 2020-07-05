import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { User } from "../components/models/user";
import { global } from "./global";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public url: string;
  public identity;
  public token: string
  stats: any;

  constructor(public http: HttpClient) {
    this.url = global.url;
  }

  register(user: User): Observable<any> {
    let params = JSON.stringify(user);
    let headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.http.post(`${this.url}register`, params, { headers: headers });
  }

  logIn(user, getToken = null): Observable<any> {
    if (getToken != null) {
      user.getToken = getToken;
    }
    let params = JSON.stringify(user);
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post(`${this.url}login`, params, { headers: headers })
  }

  getIdentity(){
    let identity = JSON.parse(localStorage.getItem('identity'));
    if (identity != undefined) {
      this.identity = identity;
    } else{
      this.identity = null;
    }
    return this.identity;
  }

  getToken(){
    let token = localStorage.getItem('token');
    if (token != undefined) {
      this.token = token;
    } else {
      this.token = null;
    }
    return this.token;
  }

  getStats(){
    let stats = JSON.parse(localStorage.getItem('stats'));

    if (stats != undefined) {
      this.stats = stats;
    } else {
      this.stats = null;
    }
    return this.stats;
  }

  getMetrics(userId = null):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type', 'application/json')
      .set('Authorization', this.getToken());
    if(userId!= null) {
      return this.http.get(`${this.url}metrics/${userId}`, {headers: headers});
    } else {
      return this.http.get(`${this.url}metrics`, {headers: headers});
    }
  }

  updateUser(user:User): Observable<any>{ 
    //let params = JSON.stringify(user);
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', this.getToken());

    return this.http.put(`${this.url}updateUser/${user._id}`, user, {headers:headers});
  }

  getUsers(page:number): Observable<any> {
    let headers =  new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', this.getToken());
    return this.http.get(`${this.url}users/${page}`, {headers: headers});
  }

  getUser(userId: string): Observable<any> {
    let headers =  new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', this.getToken());
    return this.http.get(`${this.url}user/${userId}`, {headers: headers});
  }


}
