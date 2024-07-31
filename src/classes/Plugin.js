const fs = require('fs')
const path = require('path')

module.exports = class Plugin {
    name;
    author;
    id;
    disabled;
    jsSHook;
    jsSockHook;
    jsCHook;
    hasInit = false;

    constructor(name, author, id, disabled = false) {
        this.name = name;
        this.author = author;
        this.id = id;
        this.disabled = disabled;
        this.types = [];
        if (this.disabled) return;
        this.hasInit = this.onInitialize();
        if (!this.hasInit) {
            console.log('[DEV ENV] Plugin didn\'t initialize?');
        }
    }

    setJSClientHook(hook) {
        console.log("[DEV ENV] Setting JS Client Hook to " + hook)
        this.jsCHook = hook;
    }

    setJSSocketHook(hook) {
        console.log("[DEV ENV] Setting JS Socket Hook to " + hook)
        this.jsSockHook = hook;
    }

    setJSServerHook(hook) {
        console.log("[DEV ENV] Setting JS Server Hook to " + hook)
        this.jsSHook = hook;
    }

    getJSSocketHook() {
        console.log("[DEV ENV] Getting JS Socket Hook")
        return this.jsSockHook;
    }

    getJSServerHook() {
        console.log("[DEV ENV] Getting JSS Hook")
        return this.jsSHook;
    }

    getJSClientHook() {
        console.log("[DEV ENV] Getting JSC Hook")
        return this.jsCHook;
    }

    createSaveData() {
        if (!fs.existsSync(path.resolve('./plugins'))) {
            fs.mkdirSync(path.resolve('./plugins'));
            console.log('Failsafe created plugins folder!')
          }
          if (!fs.existsSync(path.resolve('./plugins/'+this.id))) {
            fs.mkdirSync(path.resolve('./plugins/'+this.id));
            console.log('Created '+this.id+' data folder!')
          }
          if (!fs.existsSync(path.resolve('./plugins/'+this.id+'/settings.json'))) {
            fs.writeFileSync(path.resolve('./plugins/'+this.id+'/settings.json'), JSON.stringify({}));
            console.log('Created '+this.id+' settings file!')
          }
    }

    getFromSaveData(k) {
        this.createSaveData()
        let data = JSON.parse(fs.readFileSync(path.resolve('./plugins/'+this.id+'/settings.json')));
        console.log('[DEV ENV] Getting from save data: ' + k)
        return data[k];
    }

    setToSaveData(k, v) {
        this.createSaveData();
        let data = JSON.parse(fs.readFileSync(path.resolve('./plugins/'+this.id+'/settings.json')));
        data[k] = v;
        console.log('[DEV ENV] Setting save data: ' + k + ' to ' + v)
        fs.writeFileSync(path.resolve('./plugins/'+this.id+'/settings.json'), JSON.stringify(data));
    }

    pushNotification(value, options=null) {
        if (!options) console.log('[DEV ENV] Notification body: ' + value)
        if (options != {} && options != null) {
            if (options.image) {
                console.log('[DEV ENV] Notification image: ' + options.image, 'Notification body: ' + value);
            }
        }
    }

    addImport(file) {
        console.log('[DEV ENV] Added import: ' + file);
    }

    registerNewType (name, type,dat={},rt='button') {
        console.log('[DEV ENV] Registered new ' + rt + ' type: ' + name + ' (' + type + ')' +' with data: ' + dat);
    }

    onInitialize () {
        console.log('[DEV ENV] This plugin has no initialization function.')
        return true;
    }

    onButton (interaction) {
        console.log('[DEV ENV] This plugin has no button press function.')
        return true;
    }

    isDev() {
        return true;
    }
}
