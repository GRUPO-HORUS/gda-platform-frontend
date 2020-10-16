import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { BienesService } from '../bienes.service';
import { Router, NavigationEnd } from '@angular/router';

import { CatHija } from '../model/cat-hija.model';
import { AuthService } from '../../../modules/auth/_services/auth.service';

import { DatePipe } from '@angular/common'
import { BienModel } from '../model/bien.model';
import { UbicacionService } from '../../ubicacion/ubicacion.service';
@Component({
  selector: 'app-editar-bien',
  templateUrl: './editar-bien.component.html',
  styleUrls: ['./editar-bien.component.scss'],
  providers: [DatePipe]
})
export class EditarBienComponent implements OnInit {
  dataSource;
  rolesDrop: any[] = [];
  formGroup: FormGroup;
  atributosList: any[] = [];
  detalle: string;

  basicoForm: FormGroup;
  asignacionForm: FormGroup;
  contableForm: FormGroup;
  adicionalForm: FormGroup;
  mantenimientoForm: FormGroup;
  bienVisualizado;
  length: number=10;

  imagenPath: string="";

  categoriasDrop: any[] = [];
  tiposBienDrop: any[] = [];
  guardo:boolean;
  unidadesDrop: any[] = [];
  usuarioResponsableDrop: any[] = [];
  usuarioAsignadoDrop:any[] = [];
  usuarioAprobadorDrop: any[] = [];
  usuarioControlDrop: any[] = [];
  usuarioRegistroDrop: any[] = [];

  catHijas: any[] = [];
  subCategoriasDrop: any[] = [];

  asignacionesList: any[] = [];

  estadosDrop = [{label:'Muy Bueno',value:'MUY_BUENO'}, {label:'Bueno',value:'BUENO'}, {label:'Regular',value:'REGULAR'}, {label:'Malo',value:'MALO'}];
  existenciaDrop = [{label:'No Registrado',value:'NO_REGISTRADO'}, {label:'Faltante',value:'FALTANTE'}, {label:'Conforme',value:'CONFORME'}];

  usuarioResponsable;
  usuarioAsignado;
  usuarioAprobador;
  usuarioControl;
  usuarioRegistro;
  fechaIncor: string;
  categoriaPadreId;
  categoriaHijaId;
  unidadesD;

  url: string = '';
  selectedFile;
  ultimaCategoria: any;
  
  constructor(private authService: AuthService, private bienesService: BienesService, private ubicacionService: UbicacionService, 
              private fb: FormBuilder, private router: Router, private dp: DatePipe) {
      if(this.router.getCurrentNavigation().extras.state !== undefined){
          this.bienVisualizado = this.router.getCurrentNavigation().extras.state.bienP;

          this.bienesService.getAtributosBien(this.bienVisualizado.id).subscribe(atributos => { 
              this.atributosList = atributos.atributoValorBienDTOS;
              for(let detalle of this.atributosList){
                this.adicionalForm.addControl(detalle.atributo,this.fb.control(detalle.valor));
              }
          });

          this.bienesService.getAsignacionesBien(this.bienVisualizado.id).subscribe(asignaciones => { 
            for(let asignacion of asignaciones.content){
              if(asignacion.tipoAsignacion == 'RESPONSABLE'){
                this.usuarioResponsable = asignacion.usuario.id;
              }

              if(asignacion.tipoAsignacion == 'ASIGNADO'){
                this.usuarioAsignado = asignacion.usuario.id;
              }
              
              if(asignacion.tipoAsignacion == 'APROBADOR'){
                this.usuarioAprobador = asignacion.usuario.id;
              }

              if(asignacion.tipoAsignacion == 'CONTROL'){
                this.usuarioControl = asignacion.usuario.id;
              }

              if(asignacion.tipoAsignacion == 'REGISTRO'){
                this.usuarioRegistro = asignacion.usuario.id;
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
    this.guardo = false;
    this.fechaIncor = this.dp.transform(this.bienVisualizado.fechaIncorporacion,'yyyy-MM-dd', 'es-ES');

    this.bienesService.getAllTiposBien().subscribe(tipos => {
      let tiposD = tipos.content;
      for (let i = 0; i < tiposD.length; i++) {
          let t = tiposD[i];
          if(this.bienVisualizado.gdaBienTipo.id === t.id){
            this.tiposBienDrop.push({ label: t.descripcion, value: t.id, isSelected: true});
          }else{
            this.tiposBienDrop.push({ label: t.descripcion, value: t.id, isSelected: false});
          }
      }
    });

    let usu = this.authService.getUserFromLocalStorage();
    //this.unidadesDrop.push({ label: 'PRESIDENCIA', value: '7fdfbc99-a168-4f31-b794-a7d7ac02bd00' });
    
    this.ubicacionService.getAllUnidadesEntidad(usu.entidad).subscribe(unidades => {
      
      this.unidadesD = unidades;
      for (let uni of unidades) {
          this.unidadesDrop.push({ label: uni.nombre, value: uni.id });

          for(let uniHija of uni.unidades_hijas){
            this.unidadesDrop.push({ label: uniHija.nombre, value: uniHija.id });
          }
      }
    });

    this.authService.getAllUsers().subscribe(usuarios => {
      let usuariosD = usuarios.content;
      //console.log(usuariosD);
      for(let usu of usuariosD){
          if (usu.roles.filter(r => r.nombre.toUpperCase() === 'BIEN_RESPONSABLE').length > 0) {
            this.usuarioResponsableDrop.push({ label: usu.nombre+' '+usu.apellidos, value: usu.id });
            /*if(this.usuarioResponsable == usu.id ){
              this.usuarioResponsableDrop.push({ label: usu.nombre+' '+usu.apellidos, value: usu.id, selected: true });
            }else{
              this.usuarioResponsableDrop.push({ label: usu.nombre+' '+usu.apellidos, value: usu.id, selected: false });
            }*/
          }
          if (usu.roles.filter(r => r.nombre.toUpperCase() === 'BIEN_ASIGNADO').length > 0) {
            this.usuarioAsignadoDrop.push({ label: usu.nombre+' '+usu.apellidos, value: usu.id });
          }
          if (usu.roles.filter(r => r.nombre.toUpperCase() === 'BIEN_APROBADOR').length > 0) {
            this.usuarioAprobadorDrop.push({ label: usu.nombre+' '+usu.apellidos, value: usu.id });
          }
          if (usu.roles.filter(r => r.nombre.toUpperCase() === 'BIEN_CONTROL').length > 0) {
            this.usuarioControlDrop.push({ label: usu.nombre+' '+usu.apellidos, value: usu.id });
          }
          if (usu.roles.filter(r => r.nombre.toUpperCase() === 'BIEN_REGISTRO').length > 0) {
            this.usuarioRegistroDrop.push({ label: usu.nombre+' '+usu.apellidos, value: usu.id });
          }
      }     
    });

    this.bienesService.getAllCategorias().subscribe(categorias => {
      let categoriasD = categorias.content;
      for (let i = 0; i < categoriasD.length; i++) {
          let c = categoriasD[i];
          this.categoriasDrop.push({ label: c.descripcion, value: c.id });
      }
    });

    if(this.bienVisualizado.gdaCategoriaBienId.categoriaPadre == null){
      this.categoriaPadreId = this.bienVisualizado.gdaCategoriaBienId.id;
    }else{
      this.categoriaHijaId = this.bienVisualizado.gdaCategoriaBienId.id;
      if(this.bienVisualizado.gdaCategoriaBienId.categoriaPadre.categoriaPadre == null){
        this.categoriaPadreId = this.bienVisualizado.gdaCategoriaBienId.categoriaPadre.id;

        this.getCategoriasHijas(this.categoriaPadreId, this.categoriaHijaId);
      }else{
        this.categoriaHijaId = this.bienVisualizado.gdaCategoriaBienId.categoriaPadre.id;
        if(this.bienVisualizado.gdaCategoriaBienId.categoriaPadre.categoriaPadre.categoriaPadre == null){
          this.categoriaPadreId = this.bienVisualizado.gdaCategoriaBienId.categoriaPadre.categoriaPadre.id;

          this.getCategoriasHijas(this.categoriaPadreId, this.categoriaHijaId);

          this.getCategoriasHijas(this.bienVisualizado.gdaCategoriaBienId.categoriaPadre.id, this.bienVisualizado.gdaCategoriaBienId.id);
        }
      }
    }

    this.basicoForm = this.fb.group(
      {
        categoria: [
          this.categoriaPadreId
        ],
        /*subcategoria: [
          this.bienVisualizado.gdaCategoriaBienId.descripcion
        ],*/
        rotulado: [
          this.bienVisualizado.rotulado
         ],
        tipo: [
          this.bienVisualizado.gdaBienTipo.id
        ],
        detalle: [
          this.bienVisualizado.detalle
        ],
        valorIncorporacion: [
          this.bienVisualizado.valorIncorporacion
        ],
        fechaIncorporacion: [
          //this.bienVisualizado.fechaIncorporacion
          this.fechaIncor
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

    this.adicionalForm = this.fb.group({
      //Se cargan los atributos dinámicos
    });

    this.mantenimientoForm = this.fb.group(
    {
      fechaMantenimiento: [
        this.fechaIncor
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

  getCategoriasHijas(idPadre, idHija){
    this.bienesService.getAllCategoriasHijas(idPadre).subscribe(categorias => {
      if(categorias.content.length > 0){
        let catHija = new CatHija();
        catHija.subcategorias = [];
        catHija.nombre = 'subcategoria'+this.catHijas.length;

        let categoriasD = categorias.content;
        let cates = [];
        for (let i = 0; i < categoriasD.length; i++) {
            //let cates = categoriasD[i].gdaCategoriaBienList;
            //let cates = [];
            /*if(categoriasD[i].gdaCategoriaBienList.length > 0 ){
              cates = categoriasD[i].gdaCategoriaBienList;
            }else{
              cates = categoriasD[i].gdaBienList;
            }*/

            this.subCategoriasDrop = [];
            //for(let c of cates){
              //if(c.gdaCategoriaBienId !== undefined){
                this.subCategoriasDrop.push({ label: categoriasD[i].descripcion, value: categoriasD[i].id });
              //} 
           //}
        }
        catHija.subcategorias = this.subCategoriasDrop;
        //this.catHijas.push('subcategoria'+this.catHijas.length);
        this.catHijas.push(catHija);

        for(let hija of this.catHijas){
          //console.log(hija);
          this.basicoForm.addControl(hija.nombre,this.fb.control(idHija));
        }
      }
     
    });
  }

  getHijasAlCambiar($event, band){
      if(band==='base'){
        this.catHijas = [];
      }
      this.subCategoriasDrop = [];
      this.bienesService.getAllCategoriasHijas($event.target.value).subscribe(categorias => {
        if(categorias.content.length > 0){
          let catHija = new CatHija();
          catHija.nombre = 'subcategoria'+this.catHijas.length;
          let categoriasD = categorias.content;
          for (let i = 0; i < categoriasD.length; i++) {
            this.subCategoriasDrop.push({ label: categoriasD[i].descripcion, value: categoriasD[i].id });
          }

          catHija.subcategorias = this.subCategoriasDrop;
          //this.catHijas.push('subcategoria'+this.catHijas.length);
          this.catHijas.push(catHija);

          for(let hija of this.catHijas){
            //console.log(hija);
            this.basicoForm.addControl(hija.nombre,this.fb.control(''));
          }
        }else{
          this.ultimaCategoria = $event.target.value;

          this.bienesService.getAtributosCategoria(this.ultimaCategoria).subscribe(atributos => { 
            this.atributosList = atributos.atributoFormularioBien;
            for(let atributo of this.atributosList){
              if(atributo.requerido){
                this.adicionalForm.addControl(atributo.nombre,this.fb.control('',  [Validators.required]));
              }else{
                this.adicionalForm.addControl(atributo.nombre,this.fb.control(''));
              }
            }
          });
        }
      });
  }

  /*getHijasAlCambiarOrig($event, band){
    if(band==='base'){
      this.catHijas = [];
    }
    this.subCategoriasDrop = [];
    this.bienesService.getAllCategoriasHijas($event.target.value).subscribe(categorias => {
      if(categorias.content.length > 0){
        let catHija = new CatHija();
        catHija.nombre = 'subcategoria'+this.catHijas.length;

        let categoriasD = categorias.content;
        for (let i = 0; i < categoriasD.length; i++) {
            //let cates = categoriasD[i].gdaCategoriaBienList;
            let cates = [];
            if(categoriasD[i].gdaCategoriaBienList.length > 0 ){
              cates = categoriasD[i].gdaCategoriaBienList;
            }else{
              cates = categoriasD[i].gdaBienList;
            }
            
            for(let c of cates){
              //this.subCategoriasDrop.push({ label: c.descripcion, value: c.id });
              if(c.gdaCategoriaBienId !== undefined){
                this.subCategoriasDrop.push({ label: c.gdaCategoriaBienId.descripcion, value: c.gdaCategoriaBienId.id });
              } 
            }
        }
        catHija.subcategorias = this.subCategoriasDrop;
        //this.catHijas.push('subcategoria'+this.catHijas.length);
        this.catHijas.push(catHija);

        for(let hija of this.catHijas){
          this.basicoForm.addControl(hija.nombre,this.fb.control(''));
        }
      }else{
        this.ultimaCategoria = $event.target.value;

        this.bienesService.getAtributosCategoria(this.ultimaCategoria).subscribe(atributos => { 
          this.atributosList = atributos.atributoFormularioBien;
          for(let atributo of this.atributosList){
            if(atributo.requerido){
              this.adicionalForm.addControl(atributo.nombre,this.fb.control('',  [Validators.required]));
            }else{
              this.adicionalForm.addControl(atributo.nombre,this.fb.control(''));
            }
          }
      });
      }
     
    });
  }*/

  /*getHijasAlCambiar($event, band){
    if(band==='base'){
      this.catHijas = [];
    }
    this.subCategoriasDrop = [];
    this.bienesService.getAllCategoriasHijas($event.target.value).subscribe(categorias => {
      if(categorias.content.length > 0){
        let catHija = new CatHija();
        catHija.subcategorias = [];
        catHija.nombre = 'subcategoria'+this.catHijas.length;
        let categoriasD = categorias.content;
        for (let i = 0; i < categoriasD.length; i++) {
            //let cates = categoriasD[i].gdaCategoriaBienList;
            let cates = [];
            if(categoriasD[i].gdaCategoriaBienList.length > 0 ){
              cates = categoriasD[i].gdaCategoriaBienList;
            }else{
              cates = categoriasD[i].gdaBienList;
              console.log(cates);
            }
            
            for(let c of cates){
              //this.subCategoriasDrop.push({ label: c.descripcion, value: c.id });
              if(c.gdaCategoriaBienId !== undefined){
                this.subCategoriasDrop.push({ label: c.gdaCategoriaBienId.descripcion, value: c.gdaCategoriaBienId.id });
              } 
            }
        }
        catHija.subcategorias = this.subCategoriasDrop;
        //this.catHijas.push('subcategoria'+this.catHijas.length);
        this.catHijas.push(catHija);

        //this.basicoForm.removeControl('subcategoria1');

        for(let hija of this.catHijas){
          this.basicoForm.addControl(hija.nombre,this.fb.control(''));
          //this.basicoForm.setControl(hija.nombre,this.fb.control(''));
        }
      }
     
    });
  }*/

  public addFile(event: any) {
    if (event.target.files && event.target.files[0]) {
        this.selectedFile = event.target.files[0];
            var reader = new FileReader();
            reader.onload = (event: any) => {
                this.url = event.target.result;
                
            }
        reader.readAsDataURL(event.target.files[0]);
    }
  }

  public addPreview() {
    this.url = this.url;   
  }

  deleteFile(){
    this.url ='';
    this.selectedFile = null;
  }

  submit() {
    this.guardo = true;
    const nuevoBien = new BienModel();
    nuevoBien.rotulado = '0000-0001-002';
    nuevoBien.detalle = this.basicoForm.controls.detalle.value;
    nuevoBien.fechaIncorporacion = this.basicoForm.controls.fechaIncorporacion.value;
    nuevoBien.valorIncorporacion = this.basicoForm.controls.valorIncorporacion.value;
    nuevoBien.gdaCategoriaBienId= {id: '7fdfbc99-a168-4f31-b794-a7d7ac02bd00', descripcion: 'UNIDAD CENTRAL DE PROCESAMIENTO (CPU)', gdaCategoriaBienId:{}};
    nuevoBien.gdaUnidadUbicacionId= {id: '7fdfbc99-a168-4f31-b794-a7d7ac02bd00', nombre: 'PRESIDENCIA', unidades_hijas:[]};

    //console.log(this.asignacionForm.controls.usuarioResponsable.value);
    setTimeout (() => {
      this.router.navigate(['/bienes'], { state: {bien: nuevoBien, editar: true} });
    }, 3000);
  }
}


export interface ContableData {
  id: number;
  anno: number;
  valorRevaluo: number;
  valorDepreciacion: number;
  valorNetoFiscal: number;
}