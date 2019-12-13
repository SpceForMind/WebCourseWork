export class SoundManager {
    constructor() {
        this.clips = {}; // звуковые эффекты
        this.context = null; // аудиоконтекст
        this.gainNode = null; // главный узел
        this.loaded = false; // все звуки загружены
        this.isEmpty = false;
    }

    init() { // инициализация
        this.context = new AudioContext();
        this.context.resume();
        this.gainNode = this.context.createGain ? this.context.createGain() : this.context.createGainNode();
        this.gainNode.connect(this.context.destination); // подключение к динамикам
    }

    load(path, callback) { //загрузка одного аудиофайла
        if (this.clips[path]) {
            callback(this.clips[path]);
            return;
        }
        let clip = {path: path, buffer: null, loaded: false}; // клип буфер загружен
        clip.play = (volume, loop) => {
            this.play(clip.path, {looping: loop ?  loop : false, volume: volume ? volume : 1});
        };
        this.clips[path] = clip;
        let req = new XMLHttpRequest();
        req.open('GET', path);
        req.responseType = 'arraybuffer';
        req.onload = () => {
            this.context.decodeAudioData(req.response, (buffer) => {
                clip.buffer = buffer;
                clip.loaded = true;
                callback(clip);
            });
        };
        req.send();
    }

    loadArray(array) { // загрузить массив звуков
        for (let i = 0; i < array.length; i++) {
            this.load(array[i], () => {
                if (array.length === Object.keys(this.clips).length) {
                    for (let sd in this.clips) {
                        if (!this.clips[sd].loaded) return;
                    }
                    this.loaded = true;
                }
            });
        }
    }

    play(path, settings) { // проигрывание файла
        if (!this.loaded) {
            setTimeout(() => {this.play(path, settings);}, 1000);
            return;
        }
        if (this.isEmpty) return;
        let looping = false;
        let volume = 1;
        if (settings) {
            if (settings.looping) looping = settings.looping;
            if (settings.volume) volume = settings.volume;
        }
        let sd = this.clips[path];
        if (sd === null) return false;

        let sound = this.context.createBufferSource();
        sound.buffer = sd.buffer;
        sound.connect(this.gainNode);
        sound.loop = looping;
        this.gainNode.gain.value = volume;
        sound.start(0);
        return true;
    }

    toggleMute() {
        if (this.gainNode.gain.value > 0) {
            this.gainNode.gain.value = 0;
            this.isEmpty = true;
        } else {
            this.gainNode.gain.value = 1;
            this.isEmpty = false;
        }
    }
}
