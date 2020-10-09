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
  atributosList;
  detalle: string;

  basicoForm: FormGroup;
  asignacionForm: FormGroup;
  contableForm: FormGroup;
  adicionalForm: FormGroup;
  mantenimientoForm: FormGroup;
  bienVisualizado;
  length: number=10;

  imagenPath: string="";

  usuarioResponsable;
  usuarioAsignado;
  usuarioAprobador;
  usuarioControl;
  usuarioRegistro;

  constructor(private bienesService: BienesService, private fb: FormBuilder, private router: Router) {
      if(this.router.getCurrentNavigation().extras.state !== undefined){
          this.bienVisualizado = this.router.getCurrentNavigation().extras.state.bienP;
          console.log(this.bienVisualizado);

          this.bienesService.getAtributosBien(this.bienVisualizado.id).subscribe(atributos => { 
              this.atributosList = atributos.atributoValorBienDTOS;
          });

          this.bienesService.getAsignacionesBien(this.bienVisualizado.id).subscribe(asignaciones => { 
            for(let asignacion of asignaciones.content){
              if(asignacion.tipoAsignacion == 'RESPONSABLE'){
                this.usuarioResponsable = asignacion.usuario.nombre+' '+asignacion.usuario.apellidos;
              }

              if(asignacion.tipoAsignacion == 'ASIGNADO'){
                this.usuarioAsignado = asignacion.usuario.nombre+' '+asignacion.usuario.apellidos;
              }
              
              if(asignacion.tipoAsignacion == 'APROBADOR'){
                this.usuarioAprobador = asignacion.usuario.nombre+' '+asignacion.usuario.apellidos;
              }

              if(asignacion.tipoAsignacion == 'CONTROL'){
                this.usuarioControl = asignacion.usuario.nombre+' '+asignacion.usuario.apellidos;
              }

              if(asignacion.tipoAsignacion == 'REGISTRO'){
                this.usuarioRegistro = asignacion.usuario.nombre+' '+asignacion.usuario.apellidos;
              }

            }
          });
      }
  }

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  ngOnInit(): void {
    this.initForm();
    this.imagenPath = '';
    this.imagenPath = '/assets/media/products/'+this.bienVisualizado.id+'.png';

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
        estadoConservacion: [
          this.bienVisualizado.bienEstadoConservacion
        ],
        existenciaInventario: [
          this.bienVisualizado.existenciaInventario
        ]
        
      },
    );

    this.asignacionForm = this.fb.group(
    {
      unidad: [
        this.bienVisualizado.gdaUnidadUbicacionId.nombre
      ],
      usuarioResponsable: [
        this.usuarioResponsable
        //this.bienVisualizado.gdaUsuarioResponsableId !==null ? this.bienVisualizado.gdaUsuarioResponsableId.nombre+' '+this.bienVisualizado.gdaUsuarioResponsableId.apellidos : ''
      ],
      usuarioAsignado: [
        this.usuarioAsignado
        //this.bienVisualizado.gdaUsuarioResponsableId.nombre+' '+this.bienVisualizado.gdaUsuarioResponsableId.apellidos
      ], 
      usuarioAprobador: [
        this.usuarioAprobador
      ], 
      usuarioControl: [
        this.usuarioControl
      ], 
      usuarioRegistro: [
        this.usuarioRegistro
      ], 
    });

    this.adicionalForm = this.fb.group(
    {
      //Se cargan los atributos dinámicos
    });

    this.mantenimientoForm = this.fb.group(
      {
          fechaMantenimiento: [
            //this.bienVisualizado.fechaMantenimiento
          ],
          periodicidadMantenimiento: [
            '15 días'
          ]
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