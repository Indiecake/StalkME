import { Injectable } from '@angular/core';
import { global } from "./global";

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  public url:string;
  
  constructor() {
    this.url = global.url;
   }

   makeFileRequest(url: string, param: Array<string>, files:Array<File>, token: string, name: string){

    return new Promise( (resolve, reject) => {
      let formData:FormData = new FormData();
      let xhr = new XMLHttpRequest();
      
      for (const file of files) {
        formData.append(name, file, file.name);
      }

      xhr.onreadystatechange = function(){
        if (xhr.readyState == 4) {
          if(xhr.status == 200){
            resolve(JSON.parse(xhr.response));
          }else {
            reject(xhr.response);
          }
        }
      }

      xhr.open('PUT', url, true);
      xhr.setRequestHeader('Authorization', token);
      xhr.send(formData);

    }); 
   }
}
