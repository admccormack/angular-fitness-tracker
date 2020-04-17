import { Component, OnInit } from '@angular/core';
import { TrainingService } from '../training.service';
import { Exercise } from '../excercise.model';
import { NgForm } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import 'rxjs/add/operator/map';
import { UIService } from 'src/app/shared/ui.service';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../app.reducer';
import * as fromTraining from '../training.reducer';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit {
  exercises$: Observable<Exercise[]>;
  exerciseSubscription: Subscription;
  isLoading$: Observable<boolean>;
  isLoadingSubs: Subscription;

  constructor(private trainingService: TrainingService,
              private uiService: UIService,
              private store: Store<fromTraining.State>) { }

  ngOnInit() {
    // this.exercises = this.trainingService.getTraining();
    this.isLoading$ = this.store.select(fromRoot.getIsLoading);
    // this.isLoadingSubs = this.uiService.loadingStateChanged.subscribe(loading => {
    //   this.isLoading = loading;
    // });
    // this.exerciseSubscription = this.trainingService.exercisesChanged.subscribe(exercises => {
    //   this.exercises = exercises;
    // });
    this.exercises$ = this.store.select(fromTraining.getAvaialableTrainings);
    this.fetchExercises();
  }

  fetchExercises() {
    this.trainingService.fetchTraining();
  }

  onStartTrainig(form: NgForm) {
    this.trainingService.startExercise(form.value.exercise);
  }

  // ngOnDestroy() {
  //   // if (this.exerciseSubscription) {
  //   //   this.exerciseSubscription.unsubscribe();
  //   // }

  //   // if (this.isLoadingSubs) {
  //   //   this.isLoadingSubs.unsubscribe();
  //   // }
  // }

}
