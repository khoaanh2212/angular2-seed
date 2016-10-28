To Run Karma tests with Intellij Idea:
* modify file ~/.IntelliJIdea15/config/plugins/js-karma/js\_reporter/karma-intellij/lib/intellijRunner.js 
* line 63, change from *refresh: false* to *refresh: true*

To continuously compile, in unit tests, either:
* (suggested:) use npm plugin (tsc:w script) AND disable IDE compilation, or
* write *npm run tsc:w* AND disable IDE compilation, or
* set up a custom compiler in idea settings (ctrl+shift+s): /usr/lib/node\_modules/typescript/bin 
** tell to use config from tsconfig.json
** set up a typescript file watcher

To make the IDE give suggestions in TS:
* *Settings->Javascript->Libraries->Add (node_modules)

To continuously compile, in the app:
* *npm start*

See image idea_dev_setting.png to have an idea of a dev env set up.


 


