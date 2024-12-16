import { Routes } from '@angular/router';
import { HomeComponent } from './componentes/home/home.component';
import { LoginComponent } from './componentes/login/login.component';
import { PanelComponent } from './componentes/panel/panel.component';
import { NuevoModoComponent } from './componentes/nuevo-modo/nuevo-modo.component';
import { loginGuard } from './guards/login.guard';

export const routes: Routes = [
    {path: '', component: LoginComponent},
    {path: 'home', component: HomeComponent, canActivate: [loginGuard], children: [
        {path: '', redirectTo: 'panel', pathMatch: 'full'},
        {path: 'panel', component: PanelComponent},
        {path: 'nuevo', component: NuevoModoComponent}
    ]},
    {path: 'login', component: LoginComponent},
];
