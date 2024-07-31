const path = require("path");
const Plugin = require(path.resolve('./src/classes/Plugin'));

const {WaveLinkController} = require('@darrellvs/node-wave-link-sdk');

class WaveLink extends Plugin {
    wlc;
    constructor() {
        super('Elgato WaveLink', 'Freedeck', 'WaveLink', false);
        this.version = "2.0.0";
    }

    onInitialize () {
        console.log('Initialized WaveLink plugin');
        this.setJSClientHook("wavelink/companion.js");
        this.setJSServerHook("wavelink/companion.js");
        this.setJSSocketHook('wavelink/sock.js');
        this.addImport('wavelink/wl.css');
        this.WaveLinkControl();
        return true;
    }
    
    async WaveLinkControl() {
        const wlc = new WaveLinkController();
        await wlc.connect();
        this.wlc = wlc;
        console.log('Connected to Elgato WaveLink');

        const inputs = await wlc.getInputs();
        inputs.forEach((input) => {
            this.registerNewType('Mute ' + input.name + ' (Monitor)', 'wl.m.' + input.name);
            this.registerNewType('Mute ' + input.name + ' (Stream)', 'wl.sm.' + input.name);
            this.registerNewType('Volume ' + input.name + '(Monitor)', 'wl.v.' + input.name, {min:0,max:100,value:0,direction:'vertical'}, 'slider');
            this.registerNewType('Volume ' + input.name + '(Stream)', 'wl.vm.' + input.name, {min:0,max:100,value:0,direction:'vertical'}, 'slider');
        })
    }

    onButton(buttonId) {
        if (buttonId.type.startsWith('wl.m.')) {
            const inputId = buttonId.type.split('.').pop();
            const inp = this.wlc.getInput({name: inputId});
            inp.localMute = !inp.localMute;
        } else if(buttonId.type.startsWith('wl.sm.')) {
            const inputId = buttonId.type.split('.').pop();
            const inp = this.wlc.getInput({name: inputId});
            inp.streamMute = !inp.streamMute;
        } else if(buttonId.type.startsWith('wl.v.')) {
            const inputId = buttonId.type.split('.').pop();
            const inp = this.wlc.getInput({name: inputId});
            inp.localVolume = Math.floor(parseInt(buttonId.data.value));
        } else if(buttonId.type.startsWith('wl.vm.')) {
            const inputId = buttonId.type.split('.').pop();
            const inp = this.wlc.getInput({name: inputId});
            inp.streamVolume = Math.floor(parseInt(buttonId.data.value));
        }
    }
}

module.exports = {
	exec: () => new WaveLink(),
 	class: WaveLink
}