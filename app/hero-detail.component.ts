import { Component, Input } from '@angular/core';
import { Hero } from './hero';
import {Subject} from "rxjs/Subject";
import {newEvent} from "./glue/newEvent";
import {HeroService} from "./hero.service";
import {HeroDetailPresenter} from "./herodetail.presenter";
import {IChangedHero} from "./herodetail.presenter";
import {ChangeDetectionStrategy} from '@angular/core';
@Component({
  selector: 'my-hero-detail',
  template: `
    <div *ngIf="hero">
      <h2>{{hero.name}} details!</h2>
      <div><label>id: </label>{{hero.id}}</div>
      <div>
        <label>name: </label>
        <input [(ngModel)]="hero.name" placeholder="name"/>
        <button (click)="clicked()">Save</button>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [HeroService]
})
export class HeroDetailComponent implements IChangedHero {
  @Input()
  hero: Hero;

  onSave: Subject<Hero>;
  changedHero:Function;

  constructor(private heroService: HeroService) {
    this.onSave = new Subject<Hero>();
    this.changedHero = newEvent(this.onSave, "changedHero");
    new HeroDetailPresenter(this, heroService)
  }
  clicked() {
    this.onSave.next(this.hero);
  }

  onClose(funct: ()=>any) {

  }
}

