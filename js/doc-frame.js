class DocFrame{
    constructor(outlineFile){
        this.frame = document.getElementById("doc_frame");

        this.outlineFile = outlineFile;
        this.outlineFile.addEventListener("outputText", (event) => {
            this.updateDocFrame(event.task);
        });
    }

    /**
     * 新規ファイル作成
     * @param {string} fileTitle ファイル名(正確にはヘッダのタイトル情報)
     * @param {string} pageTitle ページタイトル
     */
    createNewFile(fileTitle, pageTitle){
        this.outlineFile.create(fileTitle, pageTitle);
    }

    /**
     * 既存のファイルの読込
     * @param {File} file 
     */
    loadFile(file){
        this.outlineFile.load(file);
    }

    saveFile(text){
        const re = /(?<=<title>).+(?=<\/title>)/;
        let filename = re.exec(text)[0] + ".html";
        this.outlineFile.save(filename, text);
    }

    /**
     * iframeのsrcdocを書き換える
     * @param {string} value htmlコード
     */
    updateDocFrame(value){
        this.frame.srcdoc = value;
    }

    /**
     * iframeのcontentWindow内の要素をhtmlテキストに整形して返す
     * @returns {string} 整形済みhtmlテキスト
     */
    getShapedDoc(){
        // iframeのsrcdocに反映させる用途を想定している
        // 整形がめんどくさかったので実装は未完成
        let targetDoc = this.frame.contentWindow.document;
        let text = targetDoc.documentElement.outerHTML;
        return this.outlineFile.shapeHtml(text);
    }

    /**
     * iframeで開いているファイルのテキストの直接編集設定を切り替える
     */
    toggleContentEditable(){
        let targetArea = this.frame.contentWindow.document.querySelector("main");
        if(targetArea == null){
            return;
        }
        
        let currentState = targetArea.contentEditable;
        if(currentState != "true"){
            targetArea.contentEditable = true;
            targetArea.addEventListener("keydown", (event) => {
                this.checkKey(event);
            }, false);
        }else{
            targetArea.contentEditable = false;
            targetArea.removeEventListener("keydown", (event) => {
                this.checkKey(event);
            }, false);
        }
    }

    /**
     * キー入力によるインデント変更等を行う
     * @param {Event} event イベント
     */
    checkKey(event){
        if(event.key === "Tab"){
            // デフォルトの動作を防ぐ
            event.preventDefault();

            // もっとスマートに書けないか検討中
            // 要素内でのキャレット位置を記憶しておく
            let selection = this.frame.contentWindow.document.getSelection();
            let range = selection.getRangeAt(0);
            let startOffset = range.startOffset;
            let endOffset = range.endOffset;
            let currentLine = this.getTargetElement();

            // インデント変更を行う
            if(event.shiftKey){
                this.decreaseIndent();
            }else{
                this.increaseIndent();
            }

            // キャレット位置は移動先の要素に付いてゆく
            // デフォルトだと移動元に留まってしまう
            if(currentLine.childNodes[0].nodeType === 3){
                range.setStart(currentLine.childNodes[0], startOffset);
                range.setEnd(currentLine.childNodes[0], endOffset);
            }else if(currentLine.childNodes[0].tagName.toLowerCase() === "br"){
                range.setStart(currentLine.childNodes[0], 0);
                range.setEnd(currentLine.childNodes[0], 0);
            }else{
                throw new Error("無効なノードが選択されています");
            }
            selection.removeAllRanges();
            selection.addRange(range);
        }
        if(event.key === "Enter"){
            // デフォルトの動作を防ぐ
            event.preventDefault();

            // 新しいliを挿入
            this.insertLine();

            let newLine = this.getTargetElement().nextElementSibling;
            // offsetの指定がこれで良いかは再検討の余地がある
            let offset = newLine.innerText.length;

            let range = document.createRange();
            range.setStart(newLine, offset);
            range.setEnd(newLine, offset);
            
            let selection = this.frame.contentWindow.document.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
        }
    }

    /**
     * カーソル位置にあるノードを含む最小単位の要素を取得
     * @return {HTMLElement} カーソル位置の要素
     */
    getTargetElement(){
        // まずは選択範囲から簡単に取得できないか試してみる
        let targetDoc = this.frame.contentWindow.document;
        let targetNode = targetDoc.getSelection().focusNode;
        if(targetNode.nodeType == 3){
            return targetNode.parentElement;
        }
        if(targetNode.tagName.toLowerCase() == "li"){
            return targetNode;
        }

        // focusNodeでulが釣れてしまう場合
        // どうやらキャレットがリストの最後の要素の末尾にある場合に起こる模様
        while(targetNode.childElementCount > 0){
            targetNode = targetNode.lastChild;
        }
        if(targetNode.tagName.toLowerCase() == "li"){
            return targetNode;
        }
        return targetNode.closest("li");
    }

    /**
     * 新たなトピックを挿入する
     * @returns {void} なし
     */
    insertTopic(){
        // 新しいトピックを作成
        let newTopic = document.createElement("section");
        newTopic.className = "topic";
        let newTopicTitle = document.createElement("h2");
        newTopicTitle.className = "topic_title"
        newTopic.appendChild(newTopicTitle);

        // 現在のキャレット位置のテキストを含むトピックを特定
        let previousElement = this.getTargetElement();
        let previousTopic = previousElement.closest(".topic");

        // 当該トピックの後ろに新しいトピックを挿入
        if(previousTopic != null){
            previousTopic.parentNode.insertBefore(newTopic, previousTopic.nextElementSibling);
            return;
        }

        // 該当するトピックが無ければ末尾にトピックを挿入
        this.frame.contentWindow.document.querySelector("main").appendChild(newTopic);
    }

    insertLine(){
        // 現在のキャレット位置のテキストを含む要素を特定
        let previousElement = this.getTargetElement();

        // 挿入するlineを作る
        let newLine = document.createElement("li");
        newLine.appendChild(document.createElement("br"));

        // 特定した要素が何かによって処理を変える
        // トピック名の後ならuiで包んだliを挿入
        if(previousElement.className == "topic_title"){
            let newList = document.createElement("ul");
            newList.className = "list_level1";
            newList.appendChild(newLine);
            previousElement.parentElement.insertBefore(newList, previousElement.nextElementSibling);
            return;
        }

        // liの後ならliをそのまま挿入
        if(previousElement.tagName.toLowerCase() == "li"){
            previousElement.parentElement.insertBefore(newLine, previousElement.nextElementSibling);
        }
    }

    /**
     * リスト要素を基準に新たなリストレベルを返す
     * @param {HTMLUListElement} baseElement 基準になるリスト要素
     * @param {String} option 新しいリストレベルの設定方法
     * @return {String} 新しいリストレベル
     */
    generateNewListLevel(baseElement, option){
        if(option !== "incremental" && option !== "decremental"){
            return "list_level1";
        }

        // 指定した要素からリストレベルを取り出す
        let listLevelRegex = /list_level(?<number>\d+)/;
        let classArray = listLevelRegex.exec(baseElement.className);
        if(classArray === null){
            throw new Error("list_levelが設定されていません");
        }

        // 新たなリストレベルを生成
        let newListLevel;
        switch(option){
            case "incremental":
                newListLevel = Number(classArray.groups.number) + 1;
                break;
            case "decremental":
                newListLevel = Number(classArray.groups.number) - 1;
                break;
            default:
                throw new Error("引数が無効です");

        }

        // リストレベルは1以上とする
        if(newListLevel < 1){
            return "list_level1";
        }
        return "list_level" + String(newListLevel);
    }

    /**
     * カーソル位置のリストに対してインデントを増やす
     * @returns {void} なし
     */
    increaseIndent(){
        // 要素を特定
        let targetElement = this.getTargetElement();
        let parent = targetElement.parentNode;

        // インデントをいきなり二つ増やしたりしない
        if(targetElement === parent.firstElementChild){
            return;
        }
        
        if(targetElement.previousElementSibling.children.length == 0){
            // 新しいulを作成
            let newList = document.createElement("ul");
            newList.className = this.generateNewListLevel(parent, "incremental");
            
            // 前のliの子要素として挿入する
            targetElement.previousElementSibling.appendChild(newList);
            newList.appendChild(targetElement);
        }else{
            // 前のliの子要素の末尾に挿入する
            targetElement.previousElementSibling.children[0].appendChild(targetElement);
        }

        // 子要素は一つずつリストレベルを上げる
        for(let i = 0; i < targetElement.children.length; i++){
            if(targetElement.children[i].tagName.toLowerCase() === "ul"){
                targetElement.children[i].className = this.generateNewListLevel(targetElement.children[i], "incremental");
            }
        }
    }

    /**
     * カーソル位置のリストに対してインデントを減らす
     * @returns {void} なし
     */
    decreaseIndent(){
        // 要素を特定
        let targetElement = this.getTargetElement();
        let parent = targetElement.parentNode;

        // リストレベル1より外には出さない
        if(parent.className === "list_level1"){
            return;
        }
 
        // 現在のリストの外に出す
        let upperLevelList = targetElement.closest("." + this.generateNewListLevel(parent, "decremental"));
        upperLevelList.appendChild(targetElement);
        upperLevelList.insertBefore(targetElement, parent.parentNode.nextSibling);

        if(parent.children.length == 0){
            parent.remove();
        }

        // 子要素は一つずつリストレベルを下げる
        for(let i = 0; i < targetElement.children.length; i++){
            if(targetElement.children[i].tagName.toLowerCase() === "ul"){
                targetElement.children[i].className = this.generateNewListLevel(targetElement.children[i], "decremental");
            }
        }
    }
}

export default DocFrame;