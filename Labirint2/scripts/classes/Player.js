import {Entity} from "./Entity.js";

export class Player extends Entity{
    constructor() {
        super();
        this.hp = 100;
        this.move_x = 0; // направление движения
        this.move_y = 0;
        this.speed = 8; // скорость объекта (было 1)
        this.cooldown = 1500; // задержка в мс между выстрелами
        this.isReady = true; // готово ли к выстрелу
        this.direction = '';

        this.valueObjects = {
            '283': true,
            '248': true,
            '187': true,
            '446': true,
            '224': true,
            '455': true,
            '311': true,
            '191': true,
            '154': true
        };
    }

    onTouchEntity(obj) { // обработка встречи с объектом
        if (obj.type === 'enemy') return 'hit on the player'
    }

    onTouchMap(obj) { // обработка встречи с препятствием
        if (obj === 280 || obj === 281 || obj === 277 || obj === 278) return 'next level';
        if (obj === 284 || obj === 367) return 'hill';
        if (obj === 283 && this.valueObjects[283]) {
            this.valueObjects[283] = false;
            return 'bless';
        }
        if (obj === 248 && this.valueObjects[248]) {
            this.valueObjects[248] = false;
            return 'hot';
        }
        if (obj === 187 && this.valueObjects[187]) {
            this.valueObjects[187] = false;
            return 'bless';
        }
        if (obj === 446 && this.valueObjects[446]) {
            this.valueObjects[446] = false;
            return 'hot';
        }
        if (obj === 224 && this.valueObjects[224]) {
            this.valueObjects[224] = false;
            return 'bless';
        }
        if (obj === 455 && this.valueObjects[455]) {
            this.valueObjects[455] = false;
            return 'hot';
        }
        if (obj === 311 && this.valueObjects[311]) {
            this.valueObjects[311] = false;
            return 'bless';
        }
        if (obj === 191 && this.valueObjects[191]) {
            this.valueObjects[191] = false;
            return 'hot';
        }
        if (obj === 154 && this.valueObjects[154]) {
            this.valueObjects[154] = false;
            return 'hot';
        }
    }

    initValue() {
        this.valueObjects = {
            '283': true,
            '248': true,
            '187': true,
            '446': true,
            '224': true,
            '455': true,
            '311': true,
            '191': true,
            '154': true
        };
    }
}
