import {Entity} from "./Entity.js";

export class Bullet extends Entity{
    constructor() {
        super();
        this.move_x = 0; // направление движения
        this.move_y = 0;
        this.speed = 20; // скорость объекта
        this.direction = '';
    }

    onTouchMap(obj) { // обработка встречи с препятствием - земля 424(уровень 1) все остальное - препятствия или враги
        if (!(obj === 424 || obj === 111)) return 'dead';
    }

    onTouchEntity(obj) { // обработка встречи с объектом
        if (obj.type === 'enemy') return 'hit on the enemy';
        if (obj.type === 'player') return 'hit on the player';
        if (obj.type === 'bullet') return 'boom!';
    }
}
