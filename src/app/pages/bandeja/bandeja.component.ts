import { Component, OnInit, ViewChild } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { BienesService } from '../bienes/bienes.service';
import { CategoriaModel } from '../bienes/model/categoria.model';
import { UnidadModel } from '../bienes/model/unidad.model';
import { Router, NavigationEnd } from '@angular/router';
import { VerBienComponent } from '../bienes/ver-bien/ver-bien.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-bandeja',
  templateUrl: './bandeja.component.html',
  styleUrls: ['./bandeja.component.scss']
})
export class BandejaComponent implements OnInit {
  displayedColumns: string[] = [ 'remitente', 'asunto', 'fechaIncorporacion','acciones'];
  //'detalle', 'gdaCategoriaBienId', 'gdaTipoBien'
  dataSource;
  length: number=10;
  bandera: boolean= false;

  nuevoBien;
  nuevoBien2;
  cantNuevos;

  constructor(private bienesService: BienesService, private router: Router, private dialog: MatDialog) {
    /*if(this.router.getCurrentNavigation().extras.state !== undefined){
        //console.log(this.router.getCurrentNavigation().extras.state.bien);
        this.nuevoBien = this.router.getCurrentNavigation().extras.state.bien;
        this.bandera = true;
        //this.nuevoBien2 = localStorage.getItem(this.nuevoBien.id);
        localStorage.setItem(this.nuevoBien.id, JSON.stringify(this.nuevoBien));
    }*/
    
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
      
      //this.nuevoBien2 = JSON.parse(localStorage.getItem(this.nuevoBien.id));
      this.dataSource = new MatTableDataSource<BienData>(bienes.content);
      this.dataSource.paginator = this.paginator;
      this.length =bienes.totalElements;
      
    });
  }

  verBien(bien){
    //const dialogRef = this.dialog.open(DetalleBienComponent, { data: {id: id, detalle: detalle} ,height: '350px', width: '450px'});
    this.router.navigate(['/bienes/ver'],{ state: { bienP: bien } });
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
