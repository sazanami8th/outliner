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
        this.fileCreateButton.addEventListener("click", () => {
            document.getElementById("file_create_dialog").show();
        });

        // ファイル読込
        this.fileOpenButton = document.getElementById("file_open_button");
        this.fileOpenForm = document.getElementById("file_open_form");
        this.fileOpenButton.addEventListener("click", () =>{
            this.fileOpenForm.click();
        });
        this.fileOpenForm.addEventListener("change", () => {
            let fileList = this.fileOpenForm.files;
            if(fileList.length == 0){
                return;
            }
            docFrame.loadFile(fileList[0]);
        });

        // ファイル保存
        this.fileSaveButton = document.getElementById("file_save_button");
        this.fileSaveButton.addEventListener("click", () => {
            let text = docFrame.getShapedDoc();

            // iframeのsrcdocに変更を反映
            docFrame.updateDocFrame(text);

            docFrame.saveFile(text);
        });

        // ファイルの印刷
        this.filePrintButton = document.getElementById("file_print_button");
        this.filePrintButton.addEventListener("click", () => {
            docFrame.printFile();
        });
    }
}

class EditorView extends SideView{
    constructor(docFrame){
        super("editor", docFrame);

        // トピックを挿入
        this.topicInsertButton = document.getElementById("topic_insert_button");
        this.topicInsertButton.addEventListener("click", () => {
            try{
                // フォーカスがボタンに移ってしまう
                docFrame.insertTopic();
            }catch(exception){
                console.log(exception);
            }
        });

        // インデントを増やす
        this.indentIncreaseButton = document.getElementById("indent_increase_button");
        this.indentIncreaseButton.addEventListener("click", () => {
            try{
                // フォーカスがボタンに移ってしまう
                docFrame.increaseIndent();
            }catch(exception){
                console.log(exception);
            }
        });

        // インデントを減らす
        this.indentDecreaseButton = document.getElementById("indent_decrease_button");
        this.indentDecreaseButton.addEventListener("click", () => {
            try{
                // フォーカスがボタンに移ってしまう
                docFrame.decreaseIndent();
            }catch(exception){
                console.log(exception);
            }
        });
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

class ArrangerView extends SideView{
    constructor(docFrame){
        super("arranger", docFrame);

        // 上へ移動
        this.lineMoveUpButton = document.getElementById("line_move_up_button");
        this.lineMoveUpButton.addEventListener("click", () => {
            try{
                // フォーカスがボタンに移ってしまう
                docFrame.moveUpLine();
            }catch(exception){
                console.log(exception);
            }
        });

        // 下へ移動
        this.lineMoveDownButton = document.getElementById("line_move_down_button");
        this.lineMoveDownButton.addEventListener("click", () => {
            try{
                // フォーカスがボタンに移ってしまう
                docFrame.moveDownLine();
            }catch(exception){
                console.log(exception);
            }
        });
    }

    activate(){
        super.activate();
        this.docFrame.toggleListDraggable();
    }

    inactivate(){
        super.inactivate();
        this.docFrame.toggleListDraggable();
    }
}

export {SideView, FilerView, EditorView, ArrangerView};