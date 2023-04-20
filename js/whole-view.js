import {FilerView, EditorView} from "./side-view.js";

class WholeView{
    constructor(docFrame){
        // メッセージ欄定義
        this.messageArea = document.getElementById("message");
        
        // メインウィンドウ定義
        this.mainWindow = document.getElementById("main_window");
        this.docFrame = docFrame;

        // サイドウィンドウ定義
        this.sideWindow = new Map([
            ["filer", new FilerView(docFrame)],
            ["editor", new EditorView(docFrame)]
        ]);

        // モード定義
        this.mode = "default";
        this.modeText = document.getElementById("mode");
        this.modeText.textContent = WholeView.mode_map.get(this.mode);

        // ファイル管理モード
        this.fileButton = document.getElementById("file_button");
        this.fileButton.onclick = () => {
            this.changeMode("filer");
        };

        // 編集モード
        this.editButton = document.getElementById("edit_button");
        this.editButton.onclick = () => {
            this.changeMode("editor");
        };

        // ダイアログウィンドウ定義
        this.fileCreateDialog = document.getElementById("file_create_dialog");
        this.fileTitle = document.getElementById("file_title");
        this.pageTitle = document.getElementById("page_title");
        document.querySelector("#file_create_dialog .cancel").onclick = () => {
            this.fileCreateDialog.close();
        };
        document.querySelector("#file_create_dialog .decision").onclick = () => {
            if(this.fileTitle.value === ""){
                this.messageArea.textContent = "ファイル名は必ず設定してください";
                return;
            }
            
            this.messageArea.textContent = "正常に動作しています";
            this.fileCreateDialog.close();
            docFrame.createNewFile(this.fileTitle.value, this.pageTitle.value);
        };
    }

    static mode_map = new Map([
        ["default", "プレビュー"],
        ["filer", "ファイル管理"],
        ["editor", "編集"]
    ]);
    
    /**
     * モード切替
     * @param {string} selectedMode モード名
     * @returns void
     */
    changeMode(selectedMode){
        // サイドウィンドウの表示・非表示を切り替える
        if(this.mode == "default"){
            this.openSideWindow(selectedMode);
            this.mode = selectedMode;
            this.modeText.textContent = WholeView.mode_map.get(this.mode);
        }else if(this.mode == selectedMode){
            this.closeSideWindow(selectedMode);
            this.mode = "default";
            this.modeText.textContent = WholeView.mode_map.get(this.mode);
        }else{
            this.switchSideWindow(this.mode, selectedMode);
            this.mode = selectedMode;
            this.modeText.textContent = WholeView.mode_map.get(this.mode);
        }
    }

    /**
     * サイドウィンドウを切り替える
     * @param {string} sideWindowNameBefore 切替前のサイドウィンドウ名
     * @param {string} sideWindowNameAfter 切替後のサイドウィンドウ名
     */
    switchSideWindow(sideWindowNameBefore, sideWindowNameAfter){
        this.sideWindow.get(sideWindowNameBefore).inactivate();
        this.sideWindow.get(sideWindowNameAfter).activate();
    }
    
    /**
     * サイドウィンドウを開く
     * @param {string} sideWindowName 開くサイドウィンドウ名
     */
    openSideWindow(sideWindowName){
        this.sideWindow.get(sideWindowName).activate();
        this.mainWindow.style.width = "calc(100vw - 180px)";
        this.mainWindow.style.margin = "50px 0 30px 180px";
    }
    
    /**
     * サイドウィンドウを閉じる
     * @param {string} sideWindowName 閉じるサイドウィンドウ名
     */
    closeSideWindow(sideWindowName){
        this.sideWindow.get(sideWindowName).inactivate();
        this.mainWindow.style.width = "calc(100vw - 50px)";
        this.mainWindow.style.margin = "50px 0 30px 50px";
    }
}

export default WholeView;