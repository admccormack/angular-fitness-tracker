import { TrainingService } from './../training/training.service';
import { AuthData } from './auth-data.model';
import { AngularFireAuth } from 'angularfire2/auth';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UIService } from '../shared/ui.service';
import { Store } from '@ngrx/store';
import * as fromRoot from '../app.reducer';
import * as UI from '../shared/ui.actions';
import * as Auth from './auth.actions';

@Injectable()
export class AuthService {
    // authChange = new Subject<boolean>();
    // private isAuthenticated = false;

    constructor(private router: Router,
                private afsAuth: AngularFireAuth,
                private trainingService: TrainingService,
                private uiService: UIService,
                private store: Store<fromRoot.State>) {}

    initAuthListener() {
        this.afsAuth.authState.subscribe(user => {
            if (user) {
                this.store.dispatch(new Auth.SetAuthenticated());
                // this.authChange.next(true);
                // this.isAuthenticated = true;
                this.router.navigate(['/training']);
            } else {
                this.trainingService.cancelSubscriptions();
                this.store.dispatch(new Auth.SetUnauthenticated());
                // this.isAuthenticated = false;
                // this.authChange.next(false);
                this.router.navigate(['/login']);
            }
        });
    }

    registeredUser(authData: AuthData) {
        // this.uiService.loadingStateChanged.next(true);
        this.store.dispatch(new UI.StartLoading());
        this.afsAuth.auth.createUserWithEmailAndPassword(authData.email, authData.password).then(result => {
            this.store.dispatch(new UI.StopLoading());
        }).catch(error => {
            this.store.dispatch(new UI.StopLoading());
            this.uiService.showSnackbar(error.message, null, 3000);
        });

    }

    login(authData: AuthData) {
        // this.uiService.loadingStateChanged.next(true);
        this.store.dispatch(new UI.StartLoading());
        this.afsAuth.auth.signInWithEmailAndPassword(authData.email, authData.password).then(result => {
            // this.uiService.loadingStateChanged.next(false);
            this.store.dispatch(new UI.StopLoading());
        }).catch(error => {
            // this.uiService.loadingStateChanged.next(false);
            this.store.dispatch(new UI.StopLoading());
            this.uiService.showSnackbar(error.message, null, 3000);
        });
    }

    logout() {
        this.afsAuth.auth.signOut();
    }

    // isAuth() {
    //     return this.isAuthenticated;
    // }
}
