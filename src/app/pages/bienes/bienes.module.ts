import { NgModule, LOCALE_ID } from '@angular/core';

import { CommonModule, registerLocaleData } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BienesComponent } from './bienes.component';
import { CrearBienComponent } from './crear-bien.component';
import { DetalleBienComponent } from './detalle-bien/detalle-bien.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import {MatDialogModule} from '@angular/material/dialog';
import {MatTabsModule} from '@angular/material/tabs';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { AuthGuard } from '../../modules/auth/_services/auth.guard';
//import { DashboardsModule } from 'src/app/_metronic/partials/content/dashboards/dashboards.module';

import es from '@angular/common/locales/es';
registerLocaleData(es);
@NgModule({
  declarations: [BienesComponent, CrearBienComponent, DetalleBienComponent],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule,
    MatTabsModule,
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: BienesComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'nuevo',
        component: CrearBienComponent,
        canActivate: [AuthGuard],
      },
    ]),
    //DashboardsModule,
  ],
  providers: [
    {provide: LOCALE_ID, useValue: "es-ES"}
  ]
})
export class BienesModule {}
