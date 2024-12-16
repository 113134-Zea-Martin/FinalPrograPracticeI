import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Mode } from '../interfaces/mode';
import { Status } from '../interfaces/status';

@Injectable({
  providedIn: 'root'
})
export class PanelService {

  //https://674531d6b4e2e04abea50775.mockapi.io/alarm-mode
  public static API_URL = 'https://674531d6b4e2e04abea50775.mockapi.io/alarm-mode';
  public static ALARM_STATUS = 'https://6317ca93f6b281877c5d7785.mockapi.io/alarm-status';

  constructor(private http: HttpClient) { }

  getAlarms(): Observable<Mode[]> {
    return this.http.get<Mode[]>(PanelService.API_URL);
  }

  getAlarmStatus(): Observable<Status[]> {
    return this.http.get<Status[]>(PanelService.ALARM_STATUS);
  }

  postAlarmStatus(status: Status): Observable<Status> {
    return this.http.post<Status>(PanelService.ALARM_STATUS, status);
  }

}
