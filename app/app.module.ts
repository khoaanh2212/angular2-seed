import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {InjectedAppComponent} from "./app.component";
import {HeroDetailComponent} from "./hero-detail.component";
import {FormsModule} from "@angular/forms";

@NgModule({
  imports:      [ BrowserModule,FormsModule],
  declarations: [ InjectedAppComponent,HeroDetailComponent ],
  bootstrap:    [ InjectedAppComponent ]
})
export class AppModule { }