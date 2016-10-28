import "reflect-metadata";
import {Hero} from "../app/hero";
import {expect} from "chai";
import {Subject} from "rxjs";
import {AxiosGateway, OnlyLatestFilteredCall} from "../app/glue/gateways";
import * as sinon from "sinon";
import SinonSpy = Sinon.SinonSpy;


describe("AxiosGateway slow integration tests", ()=>{
	describe("one call", ()=>{
		it("it should send its response", (done) =>{
			const subj=new Subject<Hero[]>();
			const server = new AxiosGateway();
			server.get("/heroes", subj);
			subj.subscribe(function(value)
			{
				expect(value).to.be.not.null;
				done();
			})
		});
	});
	describe("two call", ()=>{
		it("each call sends its response", (done)=>{
			let counter=0;
			const subj=new Subject<Hero[]>();
			subj.subscribe(()=>{
				counter++;
				expect(counter).to.be.lte(2);
				if (counter==2) setTimeout(()=>done(), 500);
			})
			const server = new AxiosGateway();
			server.get("/heroes", subj);
			server.get("/heroes", subj);
		})
	})
	describe("used with sequenced pipeline", ()=>{
		describe("done two calls", ()=>{
			it("just the second one responds", (done) =>{
				let counter=0;
				const server = new AxiosGateway();
				const subj=new Subject<Hero[]>();
				subj.subscribe(()=>{
					counter++;
					expect(counter).to.be.lte(1);
					if (counter==1) setTimeout(()=>done(), 500);
				})
				const pipeline=new OnlyLatestFilteredCall<Hero[]>(
					(resource:string)=>server.get(resource),
					subj
				)
				pipeline.run("/heroes");
				pipeline.run("/heroes");
			});
		});
		describe("two subscriptions", ()=>{
			it("they are both notified", (done) =>{
				const server = new AxiosGateway();
				const pipeline=new OnlyLatestFilteredCall<Hero[]>(
					(resource:string)=>server.get(resource)
				)
				const spy=sinon.spy()
				pipeline.subscribe(spy);
				pipeline.subscribe(()=>{
					sinon.assert.calledOnce(spy);
					done();
				});
				pipeline.run("/heroes");
			});
		});
	});
});
