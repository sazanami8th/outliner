class App{
    constructor(){
        this.outLineFile = new OutlineFile();
        console.log("outlinefile loaded.");
        this.docFrame = new DocFrame(this.outLineFile);
        console.log("docframe loaded.")
        this.wholeView = new WholeView(this.docFrame);
    }
}

window.addEventListener("load", function(){
    let app = new App();
});