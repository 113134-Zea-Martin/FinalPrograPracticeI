import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Zona } from '../../interfaces/zona';
import { NuevoModoService } from '../../services/nuevo-modo.service';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { User } from '../../interfaces/user';
import { Subscription } from 'rxjs';
import { Mode } from '../../interfaces/mode';

@Component({
  selector: 'app-nuevo-modo',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './nuevo-modo.component.html',
  styleUrl: './nuevo-modo.component.css'
})
export class NuevoModoComponent implements OnInit, OnDestroy {
  submit() {
    if (this.nuevoModoForm.valid) {
      const mode: Mode = {
        userId: this.loginService.user?.id as string,
        name: this.nuevoModoForm.get('nombre')?.value as string,
        zones: this.nuevoModoForm.get('zonasFA')?.value.map((zona: { zona: string }) => zona.zona) as string[],
        creationDate: Date.now(),
        id: ''
      };
      const sus = this.nuevoModoService.createMode(mode).subscribe({
        next: (mode: Mode) => {
          console.log('Modo creado', mode);
          this.router.navigate(['/home/panel']);
        },
        error: (error) => {
          console.error('Error al crear el modo', error);
        }
      });
      this.subscriptions.push(sus);
    }
  }

  subscriptions: Subscription[] = [];

  //boton Cancelar redirigir a la pagina de inicio
  cancel() {
    this.router.navigate(['/home/panel']);
  }

  constructor(private nuevoModoService: NuevoModoService, private router: Router, private loginService: LoginService) { }

  ngOnInit(): void {
    this.loadZonas();
    this.getUser();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  user: User | undefined;
  getUser() {
    this.user = this.loginService.user;

    // Establecer el valor del control "usuario" después de obtener el usuario
    if (this.user?.email) {
      this.nuevoModoForm.get('usuario')?.setValue(this.user.email);
    }
  }

  nuevoModoForm = new FormGroup({
    usuario: new FormControl('', []),
    nombre: new FormControl('', [Validators.required, Validators.minLength(5)]),
    zonasFA: new FormArray([], [Validators.required, this.uniqueZonasValidator])
  });

  get zonasFormArray(): FormArray {
    return this.nuevoModoForm.get('zonasFA') as FormArray;
  }

  addZona() {
    const zona = new FormGroup({
      zona: new FormControl('', [Validators.required])
    });
    this.zonasFormArray.push(zona);
  }

  removeZona(index: number): void {
    this.zonasFormArray.removeAt(index);
  }

  zonas: Zona[] = [];
  loadZonas() {
    const sus = this.nuevoModoService.getZonas().subscribe({
      next: (zonas: Zona[]) => {
        this.zonas = zonas;
      },
      error: (error) => {
        console.error('Error al cargar las zonas', error);
      }
    });
    this.subscriptions.push(sus);
  }

  //Implementar un validador sincrónico personalizado para el FormArray de zonas que:
  // Valide que no existan zonas duplicados seleccionados
  // Debe implementarse usando la siguiente estructura:
  // uniqueProductsValidator(control: FormArray): ValidationErrors | null {
  //   const selectedProductsIds = control.controls.map(
  //     (c) => c.get('productId')?.value as Number
  //   );
  //   const hasDuplicates = selectedProductsIds.some(
  //     (productId, index) => selectedProductsIds.indexOf(productId) !== index
  //   );
  //   return hasDuplicates ? { uniqueProducts: true } : null;
  // }
  uniqueZonasValidator(control: FormArray): ValidationErrors | null {
    const selectedZonasIds = control.controls.map(
      (c) => c.get('zona')?.value as Number
    );
    const hasDuplicates = selectedZonasIds.some(
      (zona, index) => selectedZonasIds.indexOf(zona) !== index
    );
    return hasDuplicates ? { uniqueZonas: true } : null;
  }

}
