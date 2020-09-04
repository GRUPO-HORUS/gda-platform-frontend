import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { AuthService } from '../../modules/auth/_services/auth.service';
import { BienesService } from './bienes.service';
import { Router } from '@angular/router';
import { BienModel } from './model/bien.model';

@Component({
  selector: 'app-crear-bien',
  templateUrl: './crear-bien.component.html',
  styleUrls: ['./crear-bien.component.scss']
})
export class CrearBienComponent implements OnInit {
  crearBienForm: FormGroup;
  isLoading$: Observable<boolean>;
  usuariosDrop: any[] = [];
  errorMsg: string;
  guardo: boolean;

  categoriasDrop: any[] = [];
  subCategoriasDrop: any[] = [];
  tiposBienDrop: any[] = [];

  hoy: Date;
  tipoSelect: boolean= false;

  constructor(private authService: AuthService, private fb: FormBuilder, private bienesService: BienesService, private router: Router) { }

  ngOnInit(): void {
    this.initForm();
  }

  get f() {
    return this.crearBienForm.controls;
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

    this.authService.getAllUsers().subscribe(usuarios => {
      let usuariosD = usuarios.content;
      for (let i = 0; i < usuariosD.length; i++) {
          let r = usuariosD[i];
          this.usuariosDrop.push({ label: r.nombre+' '+r.apellidos, value: r.id });
      }     
    });

    this.hoy = new Date();

    this.crearBienForm = this.fb.group(
      {
        /*fullname: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(100),
          ]),
        ],*/
        categoria: [
          '',
          [Validators.required],
        ],
        subcategoria: [
          '',
          /*Validators.compose([
            Validators.required
          ]),*/
        ],
        tipo: [
          '',
          [Validators.required],
        ],
        detalle: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(250),
          ]),
        ],
        valorIncorporacion: [
          null,
          Validators.compose([
            Validators.required,
          ]),
        ],
        fechaIncorporacion: [
          '',
          Validators.compose([
            Validators.required,
          ]),
        ],
      },
      /*{
        validator: ConfirmPasswordValidator.MatchPassword,
      }*/
    );
  }

  getCategoriasHijas($event){
    //console.log($event.target.value);
    this.bienesService.getAllCategoriasHijas($event.target.value).subscribe(categorias => {
      console.log(categorias.content);
      let categoriasD = categorias.content;
      for (let i = 0; i < categoriasD.length; i++) {
          let cates = categoriasD[i].gdaCategoriaBienList;
          for(let c of cates){
            this.subCategoriasDrop.push({ label: c.descripcion, value: c.id });
          }
      }
    });
  }

  selectTipo() {
    //console.log('cancelando');
  }

  submit() {
    this.guardo = true;

    const result = {};
    Object.keys(this.f).forEach(key => {
      result[key] = this.f[key].value;
    });
    const nuevoBien = new BienModel();
    nuevoBien.rotulado = '0000-0001-003';
    nuevoBien.detalle = this.crearBienForm.controls.detalle.value;
    nuevoBien.fechaIncorporacion = this.crearBienForm.controls.fechaIncorporacion.value;
    nuevoBien.valorIncorporacion = this.crearBienForm.controls.valorIncorporacion.value;
    nuevoBien.gdaCategoriaBienId= {id: '7fdfbc99-a168-4f31-b794-a7d7ac02bd00', descripcion: 'UNIDAD CENTRAL DE PROCESAMIENTO (CPU)'};
    nuevoBien.gdaUnidadUbicacionId= {id: '7fdfbc99-a168-4f31-b794-a7d7ac02bd00', nombre: 'Gestion de Proyectos'};

    setTimeout (() => {
      this.router.navigate(['/bienes'], { state: {bien: nuevoBien} });
    }, 3000);
  }

  


}
