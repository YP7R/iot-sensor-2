import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import {map,catchError,tap, takeUntil} from 'rxjs/operators'
import { DataserviceService } from 'src/app/services/dataservice.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {
  private liveData$:Observable<any>;
  destroyed$ = new Subject();


  constructor(private dataservice:DataserviceService) {
   }

  ngOnInit(): void {
    this.dataservice.connect().subscribe()
    this.sendMessage()

  }
  sendMessage() {
    this.dataservice.send({ message: "Salut"});
  }
  
}
