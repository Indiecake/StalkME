import { HttpHeaders } from "@angular/common/http";

export 
let global = {
    url: 'http://localhost:3000/api/',
    headers: new HttpHeaders().set('content-Type', 'application/JSON')
}