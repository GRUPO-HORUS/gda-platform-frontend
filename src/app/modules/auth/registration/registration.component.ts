import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { AuthService } from '../_services/auth.service';
import { Router } from '@angular/router';
import { ConfirmPasswordValidator } from './confirm-password.validator';
import { UserModel } from '../_models/user.model';
import { first } from 'rxjs/operators';
import { AuthHTTPService } from '../_services/auth-http';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent implements OnInit, OnDestroy {
  registrationForm: FormGroup;
  hasError: boolean;
  isLoading$: Observable<boolean>;

  rolesDrop: any[] = [];
  errorMsg: string;

  entidadForm: FormGroup;
  unidadForm: FormGroup;

  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,

    private authHttpService: AuthHTTPService
  ) {
    this.isLoading$ = this.authService.isLoading$;
    // redirect to home if already logged in
    if (this.authService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    this.initForm();
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.registrationForm.controls;
  }

  initForm() {
    /*this.authService.getAllRols().subscribe(roles => {
      for (let i = 0; i < roles.length; i++) {
          let r = roles[i];
          this.rolesDrop.push({ label: r.nombre, value: r.id });
      }
      
    });
    this.rolesDrop = [{label: 'ADMINISTRADOR', value: 1}];*/

    this.registrationForm = this.fb.group(
      {
        /*fullname: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(100),
          ]),
        ],*/
        nombreUsuario: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(100),
          ]),
        ],
        email: [
          '',
          Validators.compose([
            Validators.required,
            Validators.email,
            Validators.minLength(3),
            Validators.maxLength(320), // https://stackoverflow.com/questions/386294/what-is-the-maximum-length-of-a-valid-email-address
          ]),
        ],
        credencial: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(60),
          ]),
        ],
        nombre: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(100),
          ]),
        ],
        apellidos: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(100),
          ]),
        ],
        cedula: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(100),
          ]),
        ],
        telefono: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(9),
            Validators.maxLength(100),
          ]),
        ],
        celular: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(100),
          ]),
        ],
        /*rol: [
          '',
        ],*/
        /*cPassword: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(100),
          ]),
        ],
        agree: [false, Validators.compose([Validators.required])],*/
      },
      /*{
        validator: ConfirmPasswordValidator.MatchPassword,
      }*/
    );

    this.entidadForm = this.fb.group(
      {
        entidad: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(100),
          ]),
        ],
      });

      this.unidadForm = this.fb.group(
        {
          unidad: [
            '',
            Validators.compose([
              Validators.required,
              Validators.minLength(3),
              Validators.maxLength(100),
            ]),
          ],
      });
  }

  submit() {
    this.hasError = false;
    const result = {};
    Object.keys(this.f).forEach(key => {
      result[key] = this.f[key].value;
    });
    const newUser = new UserModel();
    newUser.setUser(result);
    const registrationSubscr = this.authService
      .registration(newUser)
      .pipe(first())
      //.subscribe((user: UserModel) => {
        //if (user) {
      .subscribe((user: any) => {
        if (user.id) {
          this.router.navigate(['/']);
        } else {
          this.hasError = true;
          this.errorMsg = user.message;
        }
      });
    this.unsubscribe.push(registrationSubscr);
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
