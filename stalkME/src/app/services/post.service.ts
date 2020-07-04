import { Injectable } from '@angular/core';
import { global } from "./global";
import { Post } from "../models/post";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  url: string;


  constructor(private http: HttpClient) {
    this.url = global.url;
  }

  addPost(token, post): Observable<any> {
    let params = JSON.stringify(post);
    let headers = new HttpHeaders().set('content-Type', 'application/JSON').set('Authorization', token);

    return this.http.post(`${this.url}savePost`, params, { headers: headers });
  }

  getPosts(token, page = 1): Observable<any> {
    let headers = global.headers.set('Authorization', token);

    return this.http.get(`${this.url}posts/${page}`, {headers: headers});
  }

  deletePost(token, id): Observable<any>{
    let headers = global.headers.set('Authorization', token);

    return this.http.delete(`${this.url}deletePost/${id}`, {headers: headers})
  }

  getPostPerUser(token, userId, page = 1): Observable<any> {
    let headers = global.headers.set('Authorization', token);

    return this.http.get(`${this.url}posts/user/${userId}/${page}`, {headers: headers});
  }
}
