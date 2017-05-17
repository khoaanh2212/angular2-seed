import "reflect-metadata";
import {HeroService} from "../app/hero.service";
import {Hero} from "../app/hero";
import {expect} from "chai";
import {Server} from "../app/glue/gateways";
describe("HeroService", () => {
	const testHeroes: Hero[]= [
	  {id: 11, name: 'Mr. Nice'},
	  {id: 12, name: 'Narco'},
	  {id: 13, name: 'Bombasto'},
	  {id: 14, name: 'Celeritas'},
	  {id: 15, name: 'Magneta'},
	  {id: 16, name: 'RubberMan'},
	  {id: 17, name: 'Dynama'},
	  {id: 18, name: 'Dr IQ'},
	  {id: 19, name: 'Magma'},
	  {id: 20, name: 'Tornado'}
	];
	var sut:HeroService
	beforeEach(() => {
		sut=new HeroService(Server.local());
	})
	describe("called via get", () => {
		it("should get heroes from (fake) server", (done) => {
			sut.heroes((heroes:Hero[]) => {
				expect(heroes).to.eql(testHeroes);
				done();
			});
			sut.loadHeroes();
		});;
	})
	describe("called for continuous load", () => {
		it("should get heroes from (fake) server", (done) => {
			sut.heroes((heroes:Hero[]) => {
				expect(heroes).to.eql(testHeroes);
				done();
			});
			sut.continuouslyLoadHeroes();
		});;
	})
	describe("post call", ()=>{
		it("should post and return", (done) =>{
			const testHero:Hero= <Hero>{name: 'Mr. Nice'};
			sut.savedHero((hero:Hero) => {
				expect(hero.name).to.eql(testHero.name);
				done();
			});
			sut.saveHero(testHero);
		});
	});
});
