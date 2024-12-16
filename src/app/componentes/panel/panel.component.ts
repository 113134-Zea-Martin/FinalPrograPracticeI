import { Component, OnDestroy, OnInit } from '@angular/core';
import { PanelService } from '../../services/panel.service';
import { Mode } from '../../interfaces/mode';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Status } from '../../interfaces/status';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-panel',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './panel.component.html',
  styleUrl: './panel.component.css'
})
export class PanelComponent implements OnInit, OnDestroy {

  form = new FormGroup({
    select: new FormControl('', [Validators.required]),
  });

  statuses: Status[] = [];
  status: boolean = false;
  statusSelected: Status | undefined;

  send() {
    const status: Status = {
      activated: !this.status,
      userId: this.loginService.user?.id || null,
      lastUpdateDate: new Date(),
      modeId: this.form.get('select')?.value || '',
      id: ''
    }

    const sus = this.panelService.postAlarmStatus(status).subscribe({
      next: (responseStatus: Status) => {
        // Actualiza directamente el estado con la respuesta del servidor
        this.status = responseStatus.activated;

        // Opcional: actualiza la lista de statuses
        this.getAlarmStatus();
      },
      error: (error) => {
        console.error('Error al actualizar el estado', error);
      }
    });

    this.suscriptions.push(sus);
  }

  suscriptions: Subscription[] = [];
  alarms: Mode[] = [];

  constructor(private panelService: PanelService, private loginService: LoginService) { }

  ngOnInit(): void {
    this.getAlarms();
    this.getAlarmStatus();

    const sus = this.form.get('select')?.valueChanges.subscribe((value) => {
      if (value) {
        console.log(value);

        // Filtrar los estados que coinciden con el modeId seleccionado
        const filteredStatuses = this.statuses.filter((status) => status.modeId === value);

        // Encontrar el estado con la fecha más reciente
        this.statusSelected = filteredStatuses.reduce((latest, current) => {
          return new Date(current.lastUpdateDate || 0) > new Date(latest.lastUpdateDate || 0) ? current : latest;
        }, filteredStatuses[0]);

        console.log(this.statusSelected);
      }

      // Actualizar el estado basado en el statusSelected
      this.status = this.statusSelected?.activated || false;
    });
    if (sus) {
      this.suscriptions.push(sus);
    }
  }

  ngOnDestroy(): void {
    this.suscriptions.forEach(sus => sus.unsubscribe());
  }

  getAlarms() {
    const sus = this.panelService.getAlarms().subscribe((alarms: Mode[]) => {
      this.alarms = alarms;
    });
    this.suscriptions.push(sus);
  }

  getAlarmStatus() {
    const sus = this.panelService.getAlarmStatus().subscribe({
      next: (statuses: Status[]) => {
        this.statuses = statuses;

        // Si hay un modo seleccionado, actualiza el estado
        if (this.form.get('select')?.value) {
          const filteredStatuses = statuses.filter((status) => status.modeId === this.form.get('select')?.value);

          this.statusSelected = filteredStatuses.reduce((latest, current) => {
            return new Date(current.lastUpdateDate || 0) > new Date(latest.lastUpdateDate || 0) ? current : latest;
          }, filteredStatuses[0]);

          this.status = this.statusSelected?.activated || false;
        }
      },
      error: (error) => {
        console.error('Error al obtener el estado de la alarma', error);
      }
    });

    this.suscriptions.push(sus);
  }

}
