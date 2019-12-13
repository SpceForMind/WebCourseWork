import {Entity} from "./Entity.js";

export class Enemy extends Entity{
    constructor() {
        super();
        this.hp = 100;
        this.move_x = 0; // направление движения
        this.move_y = 0;
        this.speed = 8; // скорость объекта
        this.direction = '';
        this.cooldown = 1500; // задержка в мс между выстрелами
        this.isReady = true; // готово ли к выстрелу
    }

    onTouchMap(obj) { // обработка встречи с препятствием
        if (this.direction === '_left' || this.direction === '_right') {
            this.direction = (this.direction === '_left') ? '_right' : '_left';
            this.move_x = (this.move_x === -1) ? 1 : -1;
        }
        if (this.direction === '_up' || this.direction === '') {
            this.direction = (this.direction === '_up') ? '' : '_up';
            this.move_y = (this.move_y === -1) ? 1 : -1;
        }
    }
}
