import EventDispatcher from "./event-dispatcher.js";

class OutlineFile extends EventDispatcher{
    constructor(){
        super();
    }

    /**
     * 新規ファイル作成
     * @param {string} fileTitle ファイル名(正確にはヘッダのタイトル情報)
     * @param {string} pageTitle ページタイトル
     */
    create(fileTitle, pageTitle){
        let preset_doc = (
            "<!DOCTYPE html>" +
            "<html>" +
            "<head>" +
                "<meta charset=\"UTF-8\">" +
                "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">" +
                "<title>" + fileTitle + "</title>" +
                "<link rel=\"stylesheet\" href=\"css/doc-style.css\" type=\"text/css\">" +
            "</head>" +
            "<body>" +
                "<header>" +
                    "<h1 class=\"page_title\">" + pageTitle + "</h1>" +
                "</header>" +
                
                "<main>" +
                    "<section class=\"topic\">" +
                        "<h2 class=\"topic_title\"></h2>" +
                    "</section>" +
                "</main>" +
                
                "<footer>" +
                    "<p><br></p>" +
                "<footer>" +
            "</body>" +
            "</html>"
        );
        this.dispatchEvent({type: "outputText", task: preset_doc});
    }

    /**
     * ファイル読込
     * @param {File} file 読み込むファイル
     */
    load(file){
        // ファイルの読込
        let reader = new FileReader();
        reader.readAsText(file);

        reader.onload = () => {
            // model側からtextを出力
            this.dispatchEvent({type: "outputText", task: reader.result});
        };
    }

    save(filename, text){
        if(filename === ""){
            throw new Error("ファイル名が設定されていません");
        }
        let blob = new Blob([text], {type: "text/html"});
        let aTag = document.createElement("a");
        aTag.href = URL.createObjectURL(blob);
        aTag.target = "_blank";
        aTag.download = filename;
        aTag.click();
        URL.revokeObjectURL(aTag.href);
    }

    /**
     * htmlテキストの整形を行う
     * @param {string} text 整形対象のhtmlテキスト
     * @returns 整形済みのhtmlテキスト
     */
    shapeHtml(text){
        // htmlを整形したいがめんどくさいので後回し
        text.replace(/[\t\n]/,"");
        text.replace("><", ">\n<");

        let indentStartFlag = /\n</;
        let indentFinishFlag = /\n<\//;

        return text;
    }
}

export default OutlineFile;