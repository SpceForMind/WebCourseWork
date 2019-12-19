export class EventsManager {
    constructor() {
        this.bind = []; // сопоставление клавиш действиям
        this.action = []; // действия

        this.onKeyDown = this.onKeyDown.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
    }

    setup(canvas) {
        this.bind[87] = 'up'; // w
        this.bind[65] = 'left'; // a
        this.bind[83] = 'down'; // s
        this.bind[68] = 'right'; // d
        this.bind[32] = 'fire'; //пробел

        canvas.addEventListener('mousedown', this.onMouseDown);
        canvas.addEventListener('mouseup', this.onMouseUp);

        document.body.addEventListener('keydown', this.onKeyDown);
        document.body.addEventListener('keyup', this.onKeyUp);
    }

    onMouseDown(event) { // нажатие на мышь
        this.action['fire'] = true;
    }

    onMouseUp(event) { // отпустили мышь
        this.action['fire'] = false;
    }

    onKeyDown(event) { // нажатие на клавишу
        let action = this.bind[event.keyCode];
        if (action) this.action[action] = true;
    }

    onKeyUp(event) { // отпускание клавиши
        let action = this.bind[event.keyCode];
        if (action) this.action[action] = false;
    }
}
