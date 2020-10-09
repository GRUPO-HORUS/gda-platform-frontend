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
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { AuthGuard } from '../../modules/auth/_services/auth.guard';
//import { DashboardsModule } from 'src/app/_metronic/partials/content/dashboards/dashboards.module';

import es from '@angular/common/locales/es';
import { MovimientosComponent } from './movimientos/movimientos.component';
import { CrearMovimientoComponent } from './movimientos/crear-movimiento/crear-movimiento.component';
registerLocaleData(es);
@NgModule({
  declarations: [MovimientosComponent, CrearMovimientoComponent],
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
    MatProgressSpinnerModule,
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: MovimientosComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'nuevo',
        component: CrearMovimientoComponent,
        canActivate: [AuthGuard],
      },
    ]),
    //DashboardsModule,
  ],
  providers: [
    {provide: LOCALE_ID, useValue: "es-ES"}
  ]
})
export class UbicacionModule {}
