class SideView{
    constructor(name, docFrame){
        this.name = name;
        this.docFrame = docFrame;
    }

    activate(){
        document.getElementById(this.name).style.display = "block";
    }

    inactivate(){
        document.getElementById(this.name).style.display = "none";
    }
}

class FilerView extends SideView{
    constructor(docFrame){
        super("filer", docFrame);

        // ファイル新規作成
        this.fileCreateButton = document.getElementById("file_create_button");
        this.fileCreateButton.onclick = () => {
            document.getElementById("file_create_dialog").show();
        };

        // ファイル読込
        this.fileOpenButton = document.getElementById("file_open_button");
        this.fileOpenForm = document.getElementById("file_open_form");
        this.fileOpenButton.onclick = () =>{
            this.fileOpenForm.click();
        };
        this.fileOpenForm.onchange = () => {
            let fileList = this.fileOpenForm.files;
            if(fileList.length == 0){
                return;
            }
            docFrame.loadFile(fileList[0]);
        };

        // ファイル保存(ダウンロード？ 未完成)
        this.fileSaveButton = document.getElementById("file_save_button");
        this.fileSaveButton.onclick = () => {
            let text = docFrame.getShapedDoc();

            // iframeのsrcdocに変更を反映
            docFrame.updateDocFrame(text);

            docFrame.saveFile(text);
        };
    }
}

class EditorView extends SideView{
    constructor(docFrame){
        super("editor", docFrame);

        // トピックを挿入
        this.topicInsertButton = document.getElementById("topic_insert_button");
        this.topicInsertButton.onclick = () => {
            try{
                // フォーカスがボタンに移ってしまう
                docFrame.insertTopic();
            }catch(exception){
                console.log(exception);
            }
        };

        // インデントを増やす
        this.indentIncreaseButton = document.getElementById("indent_increase_button");
        this.indentIncreaseButton.onclick = () => {
            try{
                // フォーカスがボタンに移ってしまう
                docFrame.increaseIndent();
            }catch(exception){
                console.log(exception);
            }
        };

        // インデントを減らす
        this.indentDecreaseButton = document.getElementById("indent_decrease_button");
        this.indentDecreaseButton.onclick = () => {
            try{
                // フォーカスがボタンに移ってしまう
                docFrame.decreaseIndent();
            }catch(exception){
                console.log(exception);
            }
        };
    }

    activate(){
        super.activate();
        this.docFrame.toggleContentEditable();
    }

    inactivate(){
        super.inactivate();
        this.docFrame.toggleContentEditable();
    }
}

export {SideView, FilerView, EditorView};