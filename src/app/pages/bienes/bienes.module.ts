import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BienesComponent } from './bienes.component';
import { CrearBienComponent } from './crear-bien.component';
import { MatPaginatorModule } from '@angular/material/paginator';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { AuthGuard } from '../../modules/auth/_services/auth.guard';
//import { DashboardsModule } from 'src/app/_metronic/partials/content/dashboards/dashboards.module';

@NgModule({
  declarations: [BienesComponent, CrearBienComponent],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
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
})
export class BienesModule {}
