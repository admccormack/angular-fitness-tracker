import { Exercise } from './excercise.model';
import { Subject } from 'rxjs/Subject';
import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Subscription } from 'rxjs';
import { UIService } from '../shared/ui.service';
import { Store } from '@ngrx/store';
import * as fromTraining from './training.reducer';
import * as TRAINING from './training.actions';
import * as UI from '../shared/ui.actions';
import { take } from 'rxjs/operators';

@Injectable()
export class TrainingService {
    exerciseChanged = new Subject<Exercise>();
    exercisesChanged = new Subject<Exercise[]>();
    finishedEercisesChanged = new Subject<Exercise[]>();
    private availableExercises: Exercise[] = [];
    private runningExercise: Exercise;
    private fbSubs: Subscription[] = [];

    constructor(private db: AngularFirestore,
                private uiService: UIService,
                private store: Store<fromTraining.State>) {}

    fetchTraining() {
        // this.uiService.loadingStateChanged.next(true);
        this.store.dispatch(new UI.StartLoading());
        this.fbSubs.push(this.db.collection('availableExercises').snapshotChanges()
        .map(docArray => {
          return docArray.map(doc => {
            return {
              id: doc.payload.doc.id,
              /* tslint:disable:no-string-literal */
              name: doc.payload.doc.data()['name'],
              duration: doc.payload.doc.data()['duration'],
              calories: doc.payload.doc.data()['calories']
            };
          });
        })
        .subscribe((exercises: Exercise[]) => {
            // this.uiService.loadingStateChanged.next(false);
            this.store.dispatch(new UI.StopLoading());
            // this.availableExercises = exercises;
            // this.exercisesChanged.next([...this.availableExercises]);
            this.store.dispatch(new TRAINING.SetAvailableTrainings(exercises));
        }, error => {
            // this.uiService.loadingStateChanged.next(false);
            this.store.dispatch(new UI.StopLoading());
            this.uiService.showSnackbar('Cannot get exercises, try later', null, 3000);
            this.exercisesChanged.next(null);
        }));
    }

    startExercise(selectedId: string) {
        // this.runningExercise = this.availableExercises.find(e => e.id === selectedId);
        // this.exerciseChanged.next({...this.runningExercise});
        this.store.dispatch(new TRAINING.StartTraining(selectedId));
    }

    completeExercise() {
        this.store.select(fromTraining.getActiveTraining).pipe(take(1)).subscribe(ex => {
            this.addDataToDatabase({...ex, date: new Date(), state: 'completed'});
            this.store.dispatch(new TRAINING.StopTraining());
        });
        // this.runningExercise =  null;
        // this.exerciseChanged.next(null);
    }

    cancelExercise(progress: number) {
        this.store.select(fromTraining.getActiveTraining).pipe(take(1)).subscribe(ex => {
            this.addDataToDatabase({
                ...ex,
                duration: this.runningExercise.duration * (progress / 100),
                calories: this.runningExercise.calories * (progress / 100),
                date: new Date(),
                state: 'cancelled'
            });
            this.store.dispatch(new TRAINING.StopTraining());
        });
        // this.addDataToDatabase({
        //     ...this.runningExercise,
        //     duration: this.runningExercise.duration * (progress / 100),
        //     calories: this.runningExercise.calories * (progress / 100),
        //     date: new Date(),
        //     state: 'cancelled'
        // });
        // this.runningExercise =  null;
        // this.exerciseChanged.next(null);
    }

    // getRunningExercise() {
    //     return {...this.runningExercise};
    // }

    fetchCompleteOrCancelledExercises() {
        this.fbSubs.push(this.db.collection('finishedExercises').valueChanges().subscribe((exercises: Exercise[]) => {
            // this.finishedEercisesChanged.next([...exercises]);
            this.store.dispatch(new TRAINING.SetFinishedTrainings(exercises));
        }));
    }

    private addDataToDatabase(exercise: Exercise) {
        this.db.collection('finishedExercises').add(exercise);
    }

    cancelSubscriptions() {
        this.fbSubs.forEach(subs => subs.unsubscribe());
    }
}
