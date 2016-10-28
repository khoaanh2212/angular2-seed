import {Hero} from "./hero";
import {IHeroService} from "./hero.service";
export interface IHeroList {
    showHeroes(heroes:Hero[]): void;
    whenLoad:Function;
}
export class AppPresenter {
    constructor(heroesListView:IHeroList, heroService:IHeroService) {
        //hl.loadEvent.subscribe((e) => console.log("event",e));
        heroesListView.whenLoad(() => heroService.loadHeroes());
        heroService.heroes((heroes:Hero[]) => heroesListView.showHeroes(heroes));
    }
}