let oldArrayPrototype=Array.prototype;
let proto=Object.create(oldArrayPrototype);
['push','pop','shift','unshift','unshift','splice','sort','reverse'].forEach(method=>{
    proto[method]=function(){
        updateView();
        oldArrayPrototype[method].call(this,...arguments);
    }
})
function defineReactive(target,key,value){
    observe(value);
    var dep = new Dep(); 
    Object.defineProperty(target,key,{
        get(){
            if (Dep.target) {
                dep.addSub(Dep.target);
            }
            return value
        },
        set(newValue){
            if(newValue!==value){
                observe(newValue)
                value=newValue;
                dep.notify();
            }
        }
    })
}
function observe(target){
    if(typeof target!=='object'||target===null){
        return
    };
    if(Array.isArray(target)){
        Object.setPrototypeOf(target,proto);
    }
    for(let key in target){
        defineReactive(target,key,target[key])
    }
}
function Dep () {
    this.subs = [];
}
Dep.prototype = {
    addSub: function(sub) {
        this.subs.push(sub);
    },
    notify: function() {
        this.subs.forEach(function(sub) {
            sub.update();
        });
    }
};
Dep.target = null;