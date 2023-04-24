import OutlineDocument from "./outline-document.js";
import DocumentFrame from "./document-frame.js";
import WholeView from "./whole-view.js";

class App{
    constructor(){
        this.outLineDocument = new OutlineDocument();
        this.docFrame = new DocumentFrame(this.outLineDocument);
        this.wholeView = new WholeView(this.docFrame);
    }
}

window.addEventListener("load", function(){
    let messageArea = document.getElementById("message");
    try{
        let app = new App();
        messageArea.textContent = "正常に動作しています"
    }catch(exception){
        messageArea.textContent = exception;
    }
});
