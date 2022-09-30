import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';

import { url } from 'src/environments/environment';
import { User } from '../../models/user.model';
import { SnackbarToastService } from './snackbar-toast.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userData: any;
  enviromentUrl = url;
  test = 'http://localhost:8080/api';

  private _usuario!: User;

  constructor(
    public afs: AngularFirestore, // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,
    public ngZone: NgZone, // NgZone service to remove outside scope warning
    private _snackbar: SnackbarToastService
  ) {
    /* Saving user data in localstorage when
            logged in and setting up null when logged out */
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));

        JSON.parse(localStorage.getItem('user')!);
      } else {
        localStorage.setItem('user', 'null');
        JSON.parse(localStorage.getItem('user')!);
      }
    });
  }

  SignIn(email: string, password: string) {
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        //console.log('result login', result);

        this.ngZone.run(() => {
          this.router.navigate(['dashboard']);
        });
        //this.prueba();
        this.getToken();
        //this.SetUserData(result.user);
      })
      .catch((error) => {
        console.log(error);
        this._snackbar.status(101, 'Error', 'Usuario o Contraseña Incorrecto');
      });
  }

  // Sign up with email/password
  SignUp(email: string, password: string, form: any) {
    return this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        this.SetUserData(form);
        return result;
      })
      .catch((error) => {
        window.alert(error.message);
      });
  }

  SetUserData(user: any) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${user.uid}`
    );
    const userData: User = {
      usu_per_identificacion: user.id,
      usu_email: user.email,
      usu_rol: user.role,
    };

    return userRef.set(userData, {
      merge: true,
    });
  }

  // TODO: Tomar los datos de inicio de sesion del localstorage y voler a llamar a la funcion de login
  // antes de actualizar o eliminar o reestablecer contraseñas
  updateUserFirebase(email: string) {
    return this.afAuth.currentUser.then((user) => {
      user
        ?.updateEmail(email)
        .then(() => {
          // Email updated!
          console.log('Email Actualizado...');
        })
        .catch((error) => {
          // An error occurred
          console.log('Email No Actualizado: ', error);
        });
    });
  }

  async sendPasswordResetEmail(email: string): Promise<void> {
    try {
      return this.afAuth.sendPasswordResetEmail(email);
    } catch (error) {
      console.log(error);
    }
  }

  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user')!);
    return user !== null ? true : false;
  }

  getToken() {
    let token: any = localStorage.getItem('user');
    token = JSON.parse(token);
    //console.log(token);

    return token?.stsTokenManager.accessToken;
  }

  // Sign out
  SignOut() {
    return this.afAuth.signOut().then(() => {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.clear();

      this.router.navigate(['login']);
    });
  }
}
