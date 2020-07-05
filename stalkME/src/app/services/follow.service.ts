import { Injectable } from '@angular/core';
import { global } from "../services/global";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Follow } from "../components/models/follows";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FollowService {

  public url: string;

  constructor(private http: HttpClient) {
    this.url = global.url;
  }

  addFollow(token: string, follow: Follow): Observable<any> {
    let params = JSON.stringify(follow);
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);

    return this.http.post(`${this.url}follow`, params, { headers: headers })
  }

  deleteFollow(token: string, id: string): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);

    return this.http.delete(`${this.url}follow/${id}`, { headers: headers });
  }

  getFollowing(token: string, userId: string = null, page: number = 1): Observable<any> {
    let headers = global.headers.set('Authorization', token);

    let url = `${this.url}following`;
    if (userId != null) {
      url = `${url}/${userId}/${page}`;
    }

    return this.http.get(url, {headers: headers});
  }

  getFollowers(token: string, userId: string = null, page: number = 1): Observable<any> {
    let headers = global.headers.set('Authorization', token);

    let url = `${this.url}followers`;
    if (userId != null) {
      url = `${url}/${userId}/${page}`;
    }

    return this.http.get(url, {headers: headers});
  }

}
