import { Component, OnInit, ViewChild } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { UbicacionService } from '../ubicacion.service';
import { UnidadModel } from '../model/unidad.model';
import { Router, NavigationEnd } from '@angular/router';
//import { CategoriaModel } from './model/categoria.model';
//import { VerBienComponent } from './ver-bien/ver-bien.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-movimientos',
  templateUrl: './movimientos.component.html',
  styleUrls: ['./movimientos.component.scss']
})
export class MovimientosComponent implements OnInit {
  displayedColumns: string[] = [ 'rotulado', 'fechaMovimiento', 'unidadOrigen','unidadDestino','acciones'];
  dataSource;
  length: number=10;
  bandera: boolean= false;

  nuevoBien;
  nuevoBien2;
  cantNuevos;
  edicion:boolean;

  constructor(private ubicacionService: UbicacionService, private router: Router, private dialog: MatDialog) {
    /*if(this.router.getCurrentNavigation().extras.state !== undefined){
        //console.log(this.router.getCurrentNavigation().extras.state.bien);
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
    
    this.ubicacionService.getAllMovimientos().subscribe(movimientos => {
      /*bienes.content.push({id:2, rotulado: '0000-0001-002', detalle: 'Monitor Samsung', fechaIncorporacion: new Date(), valorIncorporacion: 700000, 
      gdaCategoriaBienId:{id:'7fdfbc99-a168-4f31-b794-a7d7ac02bd00', descripcion: 'UNIDAD CENTRAL DE PROCESAMIENTO (CPU)'}, gdaUnidadUbicacionId:{id:'7fdfbc99-a168-4f31-b794-a7d7ac02bd00', nombre: 'Gestión de Proyectos'}});*/

      //this.dataSource = new MatTableDataSource<MovimientoData>(movimientos.content);
      this.dataSource = new MatTableDataSource<MovimientoData>(MOVIMIENTO_DATA);
      this.dataSource.paginator = this.paginator;
      this.length =movimientos.totalElements;

      this.dataSource.filterPredicate = (data: MovimientoData, filter: string): boolean => {

        const dataStr = Object.keys(data).reduce((currentTerm: string, key: string) => {
          return (currentTerm + (data as { [key: string]: any })[key] + '◬');
          //return key === 'gdaCategoriaBienId' ? currentTerm + data.gdaCategoriaBienId.descripcion : key === 'gdaUnidadUbicacionId' ? currentTerm + data.gdaUnidadUbicacionId.nombre : currentTerm + data[key];

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

export interface MovimientoData {
  rotulado: string;
  detalle: string;
  fechaMovimiento: Date;
  unidadOrigen: string;
  unidadDestino: string;
  //gdaCategoriaBienId: CategoriaModel;
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
const MOVIMIENTO_DATA: MovimientoData[] = [
  {rotulado: '18.01.001', detalle: 'Teclado', fechaMovimiento: new Date(), unidadOrigen: 'PRESIDENCIA', unidadDestino: 'PRESIDENCIA'},
  {rotulado: '18.01.002', detalle: 'Monitor', fechaMovimiento: new Date(), unidadOrigen: 'PRESIDENCIA', unidadDestino: 'PRESIDENCIA'},
  {rotulado: '18.01.003', detalle: 'Mouse', fechaMovimiento: new Date(), unidadOrigen: 'PRESIDENCIA', unidadDestino: 'PRESIDENCIA'},
  {rotulado: '18.01.004', detalle: 'Impresora', fechaMovimiento: new Date(), unidadOrigen: 'PRESIDENCIA', unidadDestino: 'PRESIDENCIA'},
  {rotulado: '18.01.005', detalle: 'Notebook', fechaMovimiento: new Date(), unidadOrigen: 'PRESIDENCIA', unidadDestino: 'PRESIDENCIA'}
]
