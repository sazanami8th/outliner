import OutlineFile from "./outline-file.js";
import DocFrame from "./doc-frame.js";
import WholeView from "./whole-view.js";

class App{
    constructor(){
        this.outLineFile = new OutlineFile();
        this.docFrame = new DocFrame(this.outLineFile);
        this.wholeView = new WholeView(this.docFrame);
    }
}

window.addEventListener("load", function(){
    let app = new App();
});
