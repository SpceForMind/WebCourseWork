import {Entity} from "./Entity.js";

export class Bullet extends Entity{
    constructor() {
        super();
        this.move_x = 0; // направление движения
        this.move_y = 0;
        this.speed = 20; // скорость объекта
        this.direction = '';
    }

    onTouchMap(obj) { // обработка встречи с препятствием
        if (!(obj === 1 || obj === 46 || obj === 111 || obj === 211 || obj === 214 || obj === 466)) return 'dead';
    }

    onTouchEntity(obj) { // обработка встречи с объектом
        if (obj.type === 'enemy') return 'hit on the enemy';
        if (obj.type === 'player') return 'hit on the player';
        if (obj.type === 'bullet') return 'boom!';
    }
}
