import { Component, OnInit, ViewChild } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { BienesService } from './bienes.service';
import { TipoBienModel } from './model/tipo-bien.model';
import { CategoriaModel } from './model/categoria.model';
import { UnidadModel } from './model/unidad.model';
import { Router, NavigationEnd } from '@angular/router';
import { VerBienComponent } from './ver-bien/ver-bien.component';
import { MatDialog } from '@angular/material/dialog';

import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-bienes',
  templateUrl: './bienes.component.html',
  styleUrls: ['./bienes.component.scss']
})
export class BienesComponent implements OnInit {
  displayedColumns: string[] = [ 'rotulado', 'fechaIncorporacion', 'valorIncorporacion','gdaCategoriaBienId', 'gdaUnidadUbicacionId','acciones'];
  //'detalle', 'gdaCategoriaBienId', 'gdaTipoBien'
  dataSource;
  length: number=10;
  bandera: boolean= false;

  nuevoBien;
  nuevoBien2;

  cantNuevos;
  edicion:boolean;

  estado;

  constructor(private bienesService: BienesService, private router: Router, private dialog: MatDialog, private activatedRoute:ActivatedRoute) {

    this.activatedRoute.queryParams.subscribe(params => {
      this.estado = params['estado'];
    });
    /*if(this.router.getCurrentNavigation().extras.state !== undefined){
        this.nuevoBien = this.router.getCurrentNavigation().extras.state.bien;
        this.bandera = true;
        //this.nuevoBien2 = localStorage.getItem(this.nuevoBien.id);
        localStorage.setItem(this.nuevoBien.id, JSON.stringify(this.nuevoBien));
    }*/
    
    /*router.events.subscribe((event) => {
      if(event instanceof NavigationEnd) {
        if(this.router.getCurrentNavigation().extras.state !== undefined){
          //console.log(event.url);
          this.nuevoBien = this.router.getCurrentNavigation().extras.state.bien;
          this.edicion = this.router.getCurrentNavigation().extras.state.editar;
          this.bandera = true;
        }
      }
    });*/
    
  }
  /*constructor(private bienesService: BienesService, private router: Router) {
    if(this.router.getCurrentNavigation().extras.state !== undefined){
        //console.log(this.router.getCurrentNavigation().extras.state.bien);
        this.nuevoBien = this.router.getCurrentNavigation().extras.state.bien;
        this.bandera = true;
        this.cantNuevos = localStorage.getItem('cantNuevos') || 1;
        let cantNro = +this.cantNuevos;
        localStorage.setItem('cantNuevos',cantNro+'');
        localStorage.setItem(cantNro+'', JSON.stringify(this.nuevoBien));
    }
  }*/

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  ngOnInit(): void {
    //this.dataSource = new MatTableDataSource<BienData>(BIEN_DATA);
    
    this.bienesService.getAllBienes().subscribe(bienes => {
      
      /*bienes.content.push({id:2, rotulado: '0000-0001-002', detalle: 'Monitor Samsung', fechaIncorporacion: new Date(), valorIncorporacion: 700000, 
      gdaCategoriaBienId:{id:'7fdfbc99-a168-4f31-b794-a7d7ac02bd00', descripcion: 'UNIDAD CENTRAL DE PROCESAMIENTO (CPU)'}, gdaUnidadUbicacionId:{id:'7fdfbc99-a168-4f31-b794-a7d7ac02bd00', nombre: 'Gestión de Proyectos'}});*/
      /*if(this.bandera){
        if(!this.edicion){
          this.length = bienes.totalElements+1;
          bienes.content.push(this.nuevoBien);
        }else{
          bienes.content.shift();
          bienes.content.push(this.nuevoBien);
          this.length = bienes.totalElements;
        }
      }else{
        this.length = bienes.totalElements;
      }*/

      let bienesTotal = bienes.content;

      if(this.estado == 'TODOS'){
        this.dataSource = new MatTableDataSource<BienData>(bienes.content);
        this.length =bienes.totalElements;
      }else if(this.estado == 'PENDIENTE_ETIQUETADO'){
        let bienesPendEtiquetado = [];
        for(let bien of bienesTotal){
          if(bien.bienEstado == 'PENDIENTE_ETIQUETADO'){
            bienesPendEtiquetado.push(bien);
          }
        }
        this.dataSource = new MatTableDataSource<BienData>(bienesPendEtiquetado);
        this.length =bienesPendEtiquetado.length;
      }else if(this.estado == 'PENDIENTE_APROBACION'){
        let bienesPendAprobacion = [];
        for(let bien of bienesTotal){
          if(bien.bienEstado == 'PENDIENTE_APROBACION'){
            bienesPendAprobacion.push(bien);
          }
        }
        this.dataSource = new MatTableDataSource<BienData>(bienesPendAprobacion);
        this.length =bienesPendAprobacion.length;
      }
      
      this.dataSource.paginator = this.paginator;

      this.dataSource.filterPredicate = (data: BienData, filter: string): boolean => {

        const dataStr = Object.keys(data).reduce((currentTerm: string, key: string) => {
          //return (currentTerm + (data as { [key: string]: any })[key] + '◬');
          return key === 'gdaCategoriaBienId' ? currentTerm + data.gdaCategoriaBienId.descripcion : key === 'gdaUnidadUbicacionId' ? currentTerm + data.gdaUnidadUbicacionId.nombre : currentTerm + data[key];

        }, '').normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  
        const transformedFilter = filter.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  
        return dataStr.indexOf(transformedFilter) != -1;
      }
      
    });
  }

  verBien(bien){
    //const dialogRef = this.dialog.open(DetalleBienComponent, { data: {id: id, detalle: detalle} ,height: '350px', width: '450px'});
    this.router.navigate(['/bienes/ver'],{ state: { bienP: bien } });
  }

  editarBien(bien){
    //console.log(bien);
    this.router.navigate(['/bienes/editar'],{ state: { bienP: bien } });
  }

  filtrar(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}

export interface BienData {
  id: number;
  rotulado: string;
  detalle: string;
  fechaIncorporacion: Date;
  valorIncorporacion: number;
  gdaCategoriaBienId: CategoriaModel;
  gdaUnidadUbicacionId: UnidadModel;
  bienEstado: string;
  //gdaTipoBien: TipoBienModel;
  /*setBien(bien: any) {
    this.id = '';
    this.rotulado = '';
    this.detalle = '';
    this.fechaIncorporacion = new Date();
    this.valorIncorporacion = 0;
    this.gdaCategoriaBienId = null;
    this.gdaUnidadUbicacionId = null;
  }*/
}
/*const BIEN_DATA: BienData[] = [
  {id:1, rotulado: '18.01.001', detalle: 'Teclado', fechaIncorporacion: new Date(), valorIncorporacion: 500000, gdaCategoriaBienId: 'EQUIPOS DE COMPUTACION', gdaTipoBien: 'DE CONSUMO'},
  {id:2, rotulado: '18.01.002', detalle: 'Monitor', fechaIncorporacion: new Date(), valorIncorporacion: 700000, gdaCategoriaBienId: 'EQUIPOS DE COMPUTACION', gdaTipoBien: 'DE CONSUMO'},
  {id:3, rotulado: '18.01.003', detalle: 'Mouse', fechaIncorporacion: new Date(), valorIncorporacion: 400000, gdaCategoriaBienId: 'EQUIPOS DE COMPUTACION', gdaTipoBien: 'DE CONSUMO'},
  {id:4, rotulado: '18.01.004', detalle: 'Impresora', fechaIncorporacion: new Date(), valorIncorporacion: 300000, gdaCategoriaBienId: 'EQUIPOS DE COMPUTACION', gdaTipoBien: 'DE CONSUMO'},
  {id:5, rotulado: '18.01.005', detalle: 'Notebook', fechaIncorporacion: new Date(), valorIncorporacion: 500000, gdaCategoriaBienId: 'EQUIPOS DE COMPUTACION', gdaTipoBien: 'DE CONSUMO'}
]*/
