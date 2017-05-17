import {AppPresenter, IHeroList} from "../app/app.presenter";
import {Hero} from "../app/hero";
import * as sinon from "sinon";
import {IHeroService} from "../app/hero.service";
import SinonSpy = Sinon.SinonSpy;


describe("appPresenter", ()=> {
    describe("view loads", ()=> {
        it("should load heroes", (done)=> {
            const testHeroes:Hero[]= [{id: 11, name: 'Mr. Nice'}]
            const view: IHeroList = <IHeroList> <any> ({});
            view.showHeroes = sinon.stub();
            view.whenLoad = (cb: Function)=> {
                return cb();
            }
            const service: IHeroService = <IHeroService> <any> {};
            service.heroes = (cb: Function)=> {
                return cb(testHeroes);
            }
            service.loadHeroes = sinon.stub();
            new AppPresenter(view, service);
            sinon.assert.calledWith(<SinonSpy> service.loadHeroes);
            sinon.assert.calledWith(<SinonSpy> view.showHeroes, testHeroes);
            done();
        })
    })
});