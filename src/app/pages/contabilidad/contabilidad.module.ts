import { NgModule, LOCALE_ID } from '@angular/core';

import { CommonModule, registerLocaleData } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatPaginatorModule } from '@angular/material/paginator';
import {MatDialogModule} from '@angular/material/dialog';
import {MatTabsModule} from '@angular/material/tabs';
import {MatSnackBarModule} from '@angular/material/snack-bar';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { AuthGuard } from '../../modules/auth/_services/auth.guard';
//import { DashboardsModule } from 'src/app/_metronic/partials/content/dashboards/dashboards.module';

import es from '@angular/common/locales/es';
import { CargarCoeficienteComponent } from './cargar-coeficiente.component';
registerLocaleData(es);
@NgModule({
  declarations: [CargarCoeficienteComponent],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule,
    MatTabsModule,
    MatSnackBarModule,
    CommonModule,
    RouterModule.forChild([
      {
        path: 'coeficiente',
        component: CargarCoeficienteComponent,
        canActivate: [AuthGuard],
      },
    ]),
    //DashboardsModule,
  ],
  providers: [
    {provide: LOCALE_ID, useValue: "es-ES"}
  ]
})
export class ContabilidadModule {}
