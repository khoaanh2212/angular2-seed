import {Component, ChangeDetectionStrategy, OnInit} from "@angular/core";
import {HeroService} from "./hero.service";
import {Hero} from "./hero";
import {Subject} from "rxjs/Rx";
import {IHeroList, AppPresenter} from "./app.presenter";
import {newEvent} from "./glue/newEvent";

class AppComponent implements IHeroList, OnInit {
    private title = 'Tour of Heroes';
    private heroes: Subject<Hero[]>;
    private selectedHero:Hero;

    //region events
    whenLoad: Function
    public loadEvent: Subject<{}>;
    //endregion

    ngOnInit():any {
        this.loadEvent.next({});
    }

    constructor() {
        this.heroes=new Subject<Hero[]>();
        this.loadEvent= new Subject();
        this.whenLoad = newEvent(this.loadEvent, "loadEvent");
    }

    showHeroes(heroes: Hero[])
    {
        this.heroes.next(heroes);
    }

    onSelect(hero:Hero) {
        this.selectedHero = hero;
    }
}


@Component({
    selector: 'my-app',
    styles: [`
      .selected {
        background-color: #CFD8DC !important;
        color: white;
      }
      .heroes {
        margin: 0 0 2em 0;
        list-style-type: none;
        padding: 0;
        width: 15em;
      }
      .heroes li {
        cursor: pointer;
        position: relative;
        left: 0;
        background-color: #EEE;
        margin: .5em;
        padding: .3em 0;
        height: 1.6em;
        border-radius: 4px;
      }
      .heroes li.selected:hover {
        background-color: #BBD8DC !important;
        color: white;
      }
      .heroes li:hover {
        color: #607D8B;
        background-color: #DDD;
        left: .1em;
      }
      .heroes .text {
        position: relative;
        top: -3px;
      }
      .heroes .badge {
        display: inline-block;
        font-size: small;
        color: white;
        padding: 0.8em 0.7em 0 0.7em;
        background-color: #607D8B;
        line-height: 1em;
        position: relative;
        left: -1px;
        top: -4px;
        height: 1.8em;
        margin-right: .8em;
        border-radius: 4px 0 0 4px;
      }
    `],
    template: `
      <h1>{{title}}</h1>
      <h2>My Heroes</h2>
      <my-hero-detail [hero]="selectedHero"></my-hero-detail>
      <ul class="heroes">
        <li *ngFor="let hero of heroes | async"
          [class.selected]="hero === selectedHero"
          (click)="onSelect(hero)">
          <span class="badge">{{hero.id}}</span> {{hero.name}}
        </li>
      </ul>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [HeroService]
})
export class InjectedAppComponent extends AppComponent
{
    constructor(private heroService: HeroService) {
        super();
        new AppPresenter(this, heroService);
    }

}


