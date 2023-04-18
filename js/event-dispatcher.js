class EventDispatcher{
    constructor(){
        this.listeners = new Map();
    }

    addEventListener(type, callback){
        if(!this.listeners.has(type)){
            this.listeners.set(type, []);
        }

        this.listeners.get(type).push(callback);
    }

    removeEventListener(type, callback){
        for(let i = 0; i < this.listeners.get(type).length; i++){
            if(this.listeners.get(type)[i] == callback){
                this.listeners.get(type).splice(i, 1);
            }
        }
    }

    clearEventListener(){
        this.listeners = new Map();
    }

    dispatchEvent(event){
        if(this.listeners.has(event.type)){
            for(let listener in this.listeners.get(event.type)){
                this.listeners.get(event.type)[listener].apply(this.listeners, arguments);
            }
        }
    }
}