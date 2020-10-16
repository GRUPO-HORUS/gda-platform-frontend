import { NgModule, LOCALE_ID } from '@angular/core';

import { CommonModule, registerLocaleData } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatPaginatorModule } from '@angular/material/paginator';
import {MatDialogModule} from '@angular/material/dialog';
import {MatTabsModule} from '@angular/material/tabs';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthGuard } from '../../modules/auth/_services/auth.guard';
//import { DashboardsModule } from 'src/app/_metronic/partials/content/dashboards/dashboards.module';

import es from '@angular/common/locales/es';
import { BandejaComponent } from './bandeja.component';
import { CrearSolicitudComponent } from './crear-solicitud/crear-solicitud.component';
import {MatSnackBarModule} from '@angular/material/snack-bar';
registerLocaleData(es);
@NgModule({
  declarations: [BandejaComponent, CrearSolicitudComponent],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: BandejaComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'nuevo',
        component: CrearSolicitudComponent,
        canActivate: [AuthGuard],
      },
      /*{
        path: 'ver',
        component: VerBienComponent,
        canActivate: [AuthGuard],
      },*/
    ]),
    //DashboardsModule,
  ],
  providers: [
    {provide: LOCALE_ID, useValue: "es-ES"}
  ]
})
export class BandejaModule {}
