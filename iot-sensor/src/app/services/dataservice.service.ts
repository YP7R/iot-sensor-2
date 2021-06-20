import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket'
import { catchError, tap, switchAll, filter, map, switchMap, retryWhen, delay } from 'rxjs/operators';
import { combineLatest } from 'rxjs'
import { EMPTY, Observable, of, Subject } from 'rxjs'
export const WS_ENDPOINT = 'ws://localhost:3000'

@Injectable({
  providedIn: 'root'
})
export class DataserviceService {

  private socket$: WebSocketSubject<any>
  public messages = []

  constructor() {
    this.connect()
  }

  connect(): void {
    if (!this.socket$ || this.socket$.closed) {
      this.socket$ = webSocket('ws://localhost:3000')
      this.socket$.pipe(tap(e=> console.log(e)), catchError(_ => EMPTY)).subscribe(x=>{
        this.messages = x
        })
      this.socket$.next({'id':'new_client'})
    }
    // this.connection$ = webSocket('ws://localhost:3000')
    // return this.connection$
    /*
    return of('http://localhost:3000').pipe(
      filter(apiUrl => !!apiUrl),
      map(apiUrl => apiUrl.replace(/^http/,'ws')),
      switchMap(wsUrl=>{
        if(this.connection$){ 
          console.log("connectin exist")
          return this.connection$
        }else{
          console.log("connectin doesn't exist")

          this.connection$ = webSocket(wsUrl)
          return this.connection$
        }
      }),
      retryWhen((erros)=>erros.pipe(delay(this.RETRY_SECONDS)))
      
    )*/
  }

  ngOnDestroy() {
    this.socket$.complete()
  }
}
