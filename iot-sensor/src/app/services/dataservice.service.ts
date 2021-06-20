import { Injectable } from '@angular/core';
import {webSocket, WebSocketSubject} from 'rxjs/webSocket'
import { catchError, tap, switchAll, filter,map, switchMap, retryWhen, delay } from 'rxjs/operators';
import {EMPTY, Observable, of, Subject} from 'rxjs'
export const WS_ENDPOINT = 'ws://localhost:3000'

@Injectable({
  providedIn: 'root'
})
export class DataserviceService {
  connection$:WebSocketSubject<any>
  RETRY_SECONDS = 30
  constructor(){}
  
  connect():Observable<any>{
    return of('http://localhost:3000').pipe(
      filter(apiUrl => !!apiUrl),
      map(apiUrl => apiUrl.replace(/^http/,'ws')),
      switchMap(wsUrl=>{
        if(this.connection$){
          return this.connection$
        }else{
          this.connection$ = webSocket(wsUrl)
          return this.connection$
        }
      }),
      retryWhen((erros)=>erros.pipe(delay(this.RETRY_SECONDS)))

    )
  }
  send(data:any){
    if(this.connection$){
      this.connection$.next(data)
    }else{
      console.error("Can't send data")
    }
  }

  closeConnection(){
    if(this.connection$){
      this.connection$.complete()
    }
  }
  ngOnDestroy(){
    this.closeConnection()
  }
}
