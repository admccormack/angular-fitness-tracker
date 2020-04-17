import { Exercise } from './../excercise.model';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { TrainingService } from '../training.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromTraining from '../training.reducer';

@Component({
  selector: 'app-past-trainings',
  templateUrl: './past-trainings.component.html',
  styleUrls: ['./past-trainings.component.css']
})
export class PastTrainingsComponent implements OnInit, AfterViewInit {
  displayedColumns = ['date', 'name', 'duration', 'calories', 'state'];
  datasource = new MatTableDataSource<Exercise>();
  private exChangeSubscription: Subscription;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private trainingService: TrainingService, private store: Store<fromTraining.State>) { }

  ngOnInit() {
    this.store.select(fromTraining.getFinishedTrainings).subscribe(exercises => {
      this.datasource.data = exercises;
    });
    // this.exChangeSubscription = this.trainingService.finishedEercisesChanged.subscribe((exercises: Exercise[]) => {
    //   this.datasource.data = exercises;
    // });
    this.trainingService.fetchCompleteOrCancelledExercises();
  }

  ngAfterViewInit() {
    this.datasource.sort = this.sort;
    this.datasource.paginator = this.paginator;
  }

  doFilter(filterVlaue: string) {
    this.datasource.filter = filterVlaue.trim().toLowerCase();
  }

  // ngOnDestroy() {
  //   if (this.exChangeSubscription) {
  //     this.exChangeSubscription.unsubscribe();
  //   }

  // }

}
