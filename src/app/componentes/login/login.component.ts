import { Component, OnDestroy } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnDestroy {

  suscriptions: Subscription[] = [];

  constructor(private loginService: LoginService, private router: Router) { }

  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(10),
      Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#\\$%\\^&\\*]).+$'),
    ]),
  });

  login() {
    const sus = this.loginService.getUsers().subscribe((users) => {
      users.forEach((user) => {
        if (user.email === this.loginForm.value.email) {
          if (user.password === this.loginForm.value.password) {
            this.loginService.setUserLogin(user);
            console.log('logeado');
            this.router.navigate(['/home']);
          }
        }
      });
    });
    this.suscriptions.push(sus);
  }


  ngOnDestroy(): void {
    this.suscriptions.forEach((sus) => {
      sus.unsubscribe();
    });
  }
}
