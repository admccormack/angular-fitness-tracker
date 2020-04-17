import { Component, OnInit } from '@angular/core';
import { TrainingService } from './training.service';
import { Subscribable, Subscription, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromTraining from './training.reducer';

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.css']
})
export class TrainingComponent implements OnInit {
  ongoingTraining$: Observable<boolean>;
  // exerciseSubscription: Subscription;
  constructor(private trainingService: TrainingService, private trainingStore: Store<fromTraining.State>) { }

  ngOnInit() {
    // this.exerciseSubscription = this.trainingService.exerciseChanged.subscribe(exercise => {
    //   if (exercise) {
    //     this.ongoingTraining = true;
    //   } else {
    //     this.ongoingTraining = false;
    //   }

    // });
    this.ongoingTraining$ = this.trainingStore.select(fromTraining.getIsTraining);
  }

  // ngOnDestroy() {
  //   if (this.exerciseSubscription) {
  //     this.exerciseSubscription.unsubscribe();
  //   }
  // }

}
