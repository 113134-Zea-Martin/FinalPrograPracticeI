import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Zona } from '../interfaces/zona';
import { Mode } from '../interfaces/mode';

@Injectable({
  providedIn: 'root'
})
export class NuevoModoService {

  static ZONAS_URL = 'https://674531d6b4e2e04abea50775.mockapi.io/alarm-zones';
  static MODE_URL = 'https://674531d6b4e2e04abea50775.mockapi.io/alarm-mode';

  constructor(private http:HttpClient) { }

  getZonas(): Observable<Zona[]> {
    return this.http.get<Zona[]>(NuevoModoService.ZONAS_URL);
  }

  createMode(alarmMode: Mode): Observable<Mode> {
    return this.http.post<Mode>(NuevoModoService.MODE_URL, alarmMode);
  }
}
