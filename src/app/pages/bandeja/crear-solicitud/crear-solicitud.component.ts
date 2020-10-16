import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { AuthService } from '../../../modules/auth/_services/auth.service';
import { BienesService } from '../../bienes/bienes.service';
import { Router } from '@angular/router';
import { BienModel } from '../../bienes/model/bien.model';
import { UbicacionService } from '../../ubicacion/ubicacion.service';

import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-crear-solicitud',
  templateUrl: './crear-solicitud.component.html',
  styleUrls: ['./crear-solicitud.component.scss']
})
export class CrearSolicitudComponent implements OnInit {
  isLoading$: Observable<boolean>;
  usuariosDrop: any[] = [];
  errorMsg: string;
  guardo: boolean = false;
  hasError: boolean = false;

  categoriasDrop: any[] = [];
  
  tiposBienDrop: any[] = [];

  unidadesDrop: any[] = [];

  hoy: Date;
  tipoSelect: boolean= false;

  basicoForm: FormGroup;
  movimientoForm: FormGroup;
  adicionalForm: FormGroup;
  mantenimientoForm: FormGroup;

  unidadesD;

  estadosDrop = [{label:'Muy Bueno',value:'MUY_BUENO'}, {label:'Bueno',value:'BUENO'}, {label:'Regular',value:'REGULAR'}, {label:'Malo',value:'MALO'}];
  existenciaDrop = [{label:'No Registrado',value:'NO_REGISTRADO'}, {label:'Faltante',value:'FALTANTE'}, {label:'Conforme',value:'CONFORME'}];

  tiposSolicDrop = [{label:'Alta',value:'7fdfbc99-a168-4f31-b794-a7d7ac02b4rt'}, {label:'Baja',value:'7fdfbc99-a168-4f31-b794-a7d7ac02b5cc'}, {label:'Donaciones',value:'7fdfbc99-a168-4f31-b794-a7d7ac02b8ll'}, {label:'Compra',value:'7fdfbc99-a168-4f31-b794-a7d7ac02b6ff'},
  {label:'Traspasos',value:'7fdfbc99-a168-4f31-b794-a7d7ac02b3re'}, {label:'Reparación Mayor',value:'7fdfbc99-a168-4f31-b794-a7d7ac02b5cv'}];

  catHijas: any[] = [];
  subCategoriasDrop: any[] = [];

  usuarioResponsableDrop: any[] = [];
  usuarioAsignadoDrop:any[] = [];
  usuarioAprobadorDrop: any[] = [];
  usuarioControlDrop: any[] = [];
  usuarioRegistroDrop: any[] = [];

  ultimaCategoria: any;
  atributosList: any[] = [];
  url: string = '';
  selectedFile;

  visible: boolean = false;

  constructor(private authService: AuthService, private fb: FormBuilder, private bienesService: BienesService, 
    private ubicacionService: UbicacionService, private router: Router, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    let usu = this.authService.getUserFromLocalStorage();
    //this.unidadesDrop.push({ label: 'PRESIDENCIA', value: '7fdfbc99-a168-4f31-b794-a7d7ac02bd00' });
    this.ubicacionService.getAllUnidadesEntidad(usu.entidad).subscribe(unidades => {
      //console.log(unidades);
      this.unidadesD = unidades;

      for (let uni of unidades) {
          this.unidadesDrop.push({ label: uni.nombre, value: uni.id });

        for(let uniHija of uni.unidades_hijas){
          this.unidadesDrop.push({ label: uniHija.nombre, value: uniHija.id });
        } 
      }     
    });
    this.initForm();
  }

  get f() {
    return this.basicoForm.controls;
  }

  initForm() {
    this.guardo = false;

    this.bienesService.getAllCategorias().subscribe(categorias => {
      let categoriasD = categorias.content;
      for (let i = 0; i < categoriasD.length; i++) {
          let c = categoriasD[i];
          this.categoriasDrop.push({ label: c.descripcion, value: c.id });
      }
    });

    this.bienesService.getAllTiposBien().subscribe(tipos => {
      let tiposD = tipos.content;
      for (let i = 0; i < tiposD.length; i++) {
          let t = tiposD[i];
          this.tiposBienDrop.push({ label: t.descripcion, value: t.id });
      }
    });

    /*this.authService.getAllUsers().subscribe(usuarios => {
      let usuariosD = usuarios.content;
      for(let usu of usuariosD){
          if (usu.roles.filter(r => r.nombre.toUpperCase() === 'BIEN_RESPONSABLE').length > 0) {
            this.usuarioResponsableDrop.push({ label: usu.nombre+' '+usu.apellidos, value: usu.id });
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
    });*/

    this.hoy = new Date();

    this.basicoForm = this.fb.group(
      {
        detalle: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(255),
          ]),
        ],
        valorIncorporacion: [
          null,
          Validators.compose([
            Validators.required,
          ]),
        ],
        fechaIncorporacion: [
          new Date().toLocaleDateString('fr-CA'),
          Validators.compose([
            Validators.required,
          ]),
        ],
        estadoConservacion: [
          this.estadosDrop[0].value,
          Validators.compose([
            Validators.required,
          ]),
        ],
        existenciaInventario: [
          this.existenciaDrop[2].value,
          Validators.compose([
            Validators.required,
          ]),
        ],
      },
      /*{
        validator: ConfirmPasswordValidator.MatchPassword,
      }*/
    );

    this.movimientoForm = this.fb.group(
    {
      tipoSolicitud: [
        '',
        [Validators.required],
      ],

      detalle:[
        '',
        [Validators.required]
      ],
      unidad: [
        '',
        /*Validators.compose([
          Validators.required
        ]),*/
      ],
      usuarioResponsable: [
        null
      ],
      usuarioAsignado: [
        null
      ],
      usuarioAprobador: [
        null
      ],
      usuarioControl: [
        null
      ],
      usuarioRegistro: [
        null
      ], 
    });

  }

  getUsuariosUnidad($event){
    this.usuariosDrop = [];
    this.usuarioResponsableDrop = [];
    this.usuarioAsignadoDrop = [];
    this.usuarioAprobadorDrop = [];
    this.usuarioControlDrop = [];
    this.usuarioRegistroDrop = [];

    this.ubicacionService.getUsuariosUnidad($event.target.value, 'BIEN_RESPONSABLE').subscribe(usuarios => {
      let usuariosD = usuarios.content;
      for(let usu of usuariosD){
        this.usuarioResponsableDrop.push({ label: usu.nombre+' '+usu.apellidos, value: usu.id });
      }
    });

    this.ubicacionService.getUsuariosUnidad($event.target.value, 'BIEN_ASIGNADO').subscribe(usuarios => {
      let usuariosD = usuarios.content;
      for(let usu of usuariosD){
        this.usuarioAsignadoDrop.push({ label: usu.nombre+' '+usu.apellidos, value: usu.id });
      }
    });

    this.ubicacionService.getUsuariosUnidad($event.target.value, 'BIEN_APROBADOR').subscribe(usuarios => {
      let usuariosD = usuarios.content;
      for(let usu of usuariosD){
        this.usuarioAprobadorDrop.push({ label: usu.nombre+' '+usu.apellidos, value: usu.id });
      }
    });

    this.ubicacionService.getUsuariosUnidad($event.target.value, 'BIEN_CONTROL').subscribe(usuarios => {
      let usuariosD = usuarios.content;
      for(let usu of usuariosD){
        this.usuarioControlDrop.push({ label: usu.nombre+' '+usu.apellidos, value: usu.id });
      }
    });

    this.ubicacionService.getUsuariosUnidad($event.target.value, 'BIEN_REGISTRO').subscribe(usuarios => {
      let usuariosD = usuarios.content;
      for(let usu of usuariosD){
        this.usuarioRegistroDrop.push({ label: usu.nombre+' '+usu.apellidos, value: usu.id });
      }
    });
    /*for(let uni of this.unidadesD){
      if(uni.id == $event.target.value){
        for(let usu of uni.gdaUsuarioList){
          if (usu.roles.filter(r => r.nombre.toLowerCase() === 'BIEN_RESPONSABLE').length > 0) {
            this.usuarioResponsableDrop.push({ label: usu.nombre+' '+usu.apellidos, value: usu.id });
          }
          if (usu.roles.filter(r => r.nombre.toLowerCase() === 'BIEN_ASIGNADO').length > 0) {
            this.usuarioAsignadoDrop.push({ label: usu.nombre+' '+usu.apellidos, value: usu.id });
          }
          if (usu.roles.filter(r => r.nombre.toLowerCase() === 'BIEN_APROBADOR').length > 0) {
            this.usuarioAprobadorDrop.push({ label: usu.nombre+' '+usu.apellidos, value: usu.id });
          }
          if (usu.roles.filter(r => r.nombre.toLowerCase() === 'BIEN_CONTROL').length > 0) {
            this.usuarioControlDrop.push({ label: usu.nombre+' '+usu.apellidos, value: usu.id });
          }
          if (usu.roles.filter(r => r.nombre.toLowerCase() === 'BIEN_REGISTRO').length > 0) {
            this.usuarioRegistroDrop.push({ label: usu.nombre+' '+usu.apellidos, value: usu.id });
          }
        }
      }
    }*/
  }

  setVisible(event) {
    console.log(event.target);
    if(event.target.value =='7fdfbc99-a168-4f31-b794-a7d7ac02b3re'){
      this.visible = true;
    }else{
      this.visible = false;
    }
  }

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

    const result = {};
    Object.keys(this.f).forEach(key => {
      result[key] = this.f[key].value;
    });
    /*let bienForm = new FormData();
    bienForm.append('bien', JSON.stringify(nuevoBien));
    bienForm.append('imagen', this.selectedFile);
    console.log(bienForm.get('bien'));
    console.log(bienForm.get('imagen'));*/

    /*this.bienesService.crearBien(nuevoBien).subscribe((response:any) =>{
      this._snackBar.open("Se ha guardado correctamente el bien.",null, {
        duration: 2500,
      });

    },error=>{
      this.hasError=true;
      if(error.error.apierror.formatted){
        this.errorMsg=error.error.apierror.message;
      }else{
        this.errorMsg="Ha ocurrido un error.";
      }
      this._snackBar.open(this.errorMsg,null, {
        duration: 3500,
      });
      //this.unsubscribe.push(contabSub);
    });*/
  }


}
