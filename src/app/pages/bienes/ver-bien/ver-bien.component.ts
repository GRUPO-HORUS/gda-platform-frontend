import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { BienesService } from '../bienes.service';
import { Router, NavigationEnd } from '@angular/router';
@Component({
  selector: 'app-ver-bien',
  templateUrl: './ver-bien.component.html',
  styleUrls: ['./ver-bien.component.scss']
})
export class VerBienComponent implements OnInit {
  displayedColumns: string[] = ['anno', 'valorRevaluo', 'valorDepreciacion', 'valorNetoFiscal'];
  dataSource;
  rolesDrop: any[] = [];
  formGroup: FormGroup;
  detallesList;
  detalle: string;

  basicoForm: FormGroup;
  asignacionForm: FormGroup;
  contableForm: FormGroup;
  mantenimientoForm: FormGroup;
  bienVisualizado;
  length: number=10;

  constructor(private bienesService: BienesService, private fb: FormBuilder, private router: Router) {
      if(this.router.getCurrentNavigation().extras.state !== undefined){
          this.bienVisualizado = this.router.getCurrentNavigation().extras.state.bienP;
          console.log(this.bienVisualizado);
      }
  }

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  ngOnInit(): void {
    this.initForm();
    /*this.detalle = this.data.detalle;
    this.bienesService.getDetallesBien(this.data.id).subscribe(detalles => { 
      this.detallesList = detalles.atributoValorBienDTOS;
    });*/
    
  }

  initForm() {
    this.basicoForm = this.fb.group(
      {
        categoria: [
         ''
        ],
        rotulado: [
          this.bienVisualizado.rotulado
         ],
        subcategoria: [
          this.bienVisualizado.gdaCategoriaBienId.descripcion
        ],
        tipo: [
          this.bienVisualizado.gdaBienTipo.descripcion
        ],
        detalle: [
          this.bienVisualizado.detalle
        ],
        valorIncorporacion: [
          ''
          //this.bienVisualizado.valorIncorporacion
        ],
        fechaIncorporacion: [
          this.bienVisualizado.fechaIncorporacion
        ],

        unidad: [
          this.bienVisualizado.gdaUnidadUbicacionId.nombre
        ],
        usuarioResponsable: [
          this.bienVisualizado.gdaUsuarioResponsableId.nombre+' '+this.bienVisualizado.gdaUsuarioResponsableId.apellidos
        ], 
      },
    );

    this.asignacionForm = this.fb.group(
    {
      unidad: [
        this.bienVisualizado.gdaUnidadUbicacionId.nombre
      ],
      usuarioResponsable: [
        this.bienVisualizado.gdaUsuarioResponsableId.nombre+' '+this.bienVisualizado.gdaUsuarioResponsableId.apellidos
      ], 
    });

    this.mantenimientoForm = this.fb.group(
    {
        fechaMantenimiento: [
          null
        ], 
    });

    this.bienesService.getDatosContables().subscribe(bienes => {
      this.dataSource = new MatTableDataSource<ContableData>(bienes.content);
      this.dataSource.paginator = this.paginator;
      this.length =bienes.totalElements;
      
    });
  }
}

export interface ContableData {
  id: number;
  anno: number;
  valorRevaluo: number;
  valorDepreciacion: number;
  valorNetoFiscal: number;
}