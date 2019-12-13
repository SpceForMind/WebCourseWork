import {MapManager} from "./MapManager.js";
import {SpriteManager} from "./SpriteManager.js";
import {EventsManager} from "./EventsManager.js";
import {Player} from "./Player.js";
import {Enemy} from "./Enemy.js";
import {Bullet} from "./Bullet.js";
import {SoundManager} from "./SoundManager.js";

export class GameManager {
    constructor(canvas, context, width, height) {
        this.canvas = canvas;
        this.context = context;
        this.widthMap = width;
        this.heightMap = height;
        this.objects = []; // объекты на карте
        this.player = null; // игрок
        this.factory = {}; // фабрика объектов
        this.laterKill = []; // отложенное уничтожение объектов
        this.currentLevel = 1; // текущий уровень
        this.isDefferendUpLevel = false; // пауза для загрузки уровня
        this.countBullet = 0; // число снарядов
        this.score = 0; // результат

        this.factory['player'] = new Player();
        this.factory['enemy'] = new Enemy();
        this.factory['bullet'] = new Bullet();

        if (localStorage["mode"] === undefined || localStorage['mode'] === 'ez') {
            this.damage = {'enemy': -1, 'player': 100};
        } else {
            this.damage = {'enemy': -1, 'player': 100};
        }
        console.log(this.damage);

        this.spriteManager = new SpriteManager();
        this.eventsManager = new EventsManager();
        this.soundManager = new SoundManager();
        this.initRecord();
        this.nextLevel();

        this.spriteManager.loadAtlas('./public/tiles/atlas.json', './public/tiles/ninja.png');
        this.eventsManager.setup(this.canvas);
        this.soundManager.init();
        this.soundManager.loadArray(['./public/sound/background.mp3', './public/sound/bullet.mp3', './public/sound/boom.mp3', './public/sound/good.mp3']);
        this.soundManager.play("./public/sound/background.mp3", {looping: true, volume: 0.1});
        document.getElementById('mute').addEventListener('click', () => {
            let temp = document.getElementById('mute');
            if (temp.innerHTML === 'Отключить звук') temp.innerHTML = 'Включить звук';
            else temp.innerHTML = 'Отключить звук';
            this.soundManager.toggleMute();
        });

        this.drawMap();

        this.updateAll = this.updateAll.bind(this);
        this.newRecord = this.newRecord.bind(this);
        this.goToRecordTable = this.goToRecordTable.bind(this);
        this.startGame = this.startGame.bind(this);

        document.getElementById('info').style.display = '';
        this.startGame();
    }

    drawMap() {
        if (!this.mapManager.isAllImgLoad || !this.mapManager.isMapLoad) {
            setTimeout(() => { this.drawMap(); }, 100);
        } else {
            this.mapManager.draw(this.context);
        }
    }

    parseObjects() {
        if (!this.spriteManager.isImgLoad || !this.spriteManager.isJsonLoad || !this.mapManager.isAllImgLoad || !this.mapManager.isMapLoad) {
            setTimeout(() => { this.parseObjects(); }, 100);
        } else {
            let mapJSON = this.mapManager.getMapJson();
            for (let i = 0; i < mapJSON.layers.length; i++) {
                if (mapJSON.layers[i].type === 'objectgroup') {
                    let objects = mapJSON.layers[i];
                    for (let j = 0; j < objects.objects.length; j++) {
                        let element = objects.objects[j];
                        try {
                            let typeWithoutDirection = element.type.split('_');
                            let obj = Object.create(this.factory[typeWithoutDirection[0]]);
                            if (typeWithoutDirection[0] === 'enemy') {
                                switch (typeWithoutDirection[1]) {
                                    case 'left':
                                        obj.direction = '_left';
                                        obj.move_x = -1;
                                        break;
                                    case  'right':
                                        obj.direction = '_right';
                                        obj.move_x = 1;
                                        break;
                                    case  'up':
                                        obj.direction = '_up';
                                        obj.move_y = -1;
                                        break;
                                    case  undefined:
                                        obj.direction = '';
                                        obj.move_y = 1;
                                        break;
                                    default: return;
                                }
                            }
                            obj.name = element.name;
                            obj.type = typeWithoutDirection[0];
                            obj.pos_x = element.x;
                            obj.pos_y = element.y - element.height;
                            obj.size_x = element.width;
                            obj.size_y = element.height;
                            this.objects.push(obj);
                            if (obj.type === 'player') this.initPlayer(obj);
                        } catch (e) {
                            console.log(`Error while creating: [${e.gid}] ${e.type}, ${e}`);
                        }
                    }
                }
            }
        }
    }

    draw() {
        for (let i = 0; i < this.objects.length; i++) {
            this.spriteManager.drawSprite(this.context, this.objects[i].type, this.objects[i].direction, this.objects[i].pos_x, this.objects[i].pos_y, this.mapManager.view);
        }
    }

    initPlayer(obj) {
        this.player = obj;
        this.player.initValue();
    }

    kill(obj) {
        this.laterKill.push(obj);
    }

    fire(obj) {
        if (obj.isReady) {
            let bullet = Object.create(this.factory['bullet']);
            bullet.size_x = obj.size_x;
            bullet.size_y = obj.size_y;
            bullet.name = `bullet${++this.countBullet}`;
            bullet.type = "bullet";
            switch (obj.direction) {
                case '_left': // влево
                    bullet.pos_x = obj.pos_x - bullet.size_x;
                    bullet.pos_y = obj.pos_y;
                    bullet.direction = '_left';
                    bullet.move_x = -1;
                    break;
                case '_right': // вправо
                    bullet.pos_x = obj.pos_x + bullet.size_x;
                    bullet.pos_y = obj.pos_y;
                    bullet.direction = '_right';
                    bullet.move_x = 1;
                    break;
                case '_up': // вверх
                    bullet.pos_x = obj.pos_x;
                    bullet.pos_y = obj.pos_y - bullet.size_y;
                    bullet.direction = '_up';
                    bullet.move_y = -1;
                    break;
                case '': // вниз
                    bullet.pos_x = obj.pos_x;
                    bullet.pos_y = obj.pos_y + bullet.size_y;
                    bullet.direction = '';
                    bullet.move_y = 1;
                    break;
                default: return;
            }
            this.objects.push(bullet);
            this.soundManager.play("./public/sound/bullet.mp3");
            this.spriteManager.drawSprite(this.context, bullet.type, bullet.direction, bullet.pos_x, bullet.pos_y, this.mapManager.view);

            obj.isReady = false;
            setTimeout(() => {obj.isReady = true; }, obj.cooldown)
        }
    }

    update(obj) {
        if (obj.move_x === 0 && obj.move_y === 0) return 'stop';
        let newX = obj.pos_x + Math.floor(obj.move_x * obj.speed);
        let newY = obj.pos_y + Math.floor(obj.move_y * obj.speed);
        let ts = this.mapManager.getTilesetIndex(newX + obj.size_x/2, newY + obj.size_y/2); // 1, 211, 214, 466, 46, 280 и 281(замок), 111(дорога во второй карте)
        if (obj === this.player) console.log(ts);
        let e = this.entityAtXY(obj, newX, newY); // Сущность по координатоам newX, newY

        let typeWithoutDirection = obj.type.split('_');
        // Условие, где проверяем - попал ли снаряд в Игрока или же во Врага
        if (e !== null && obj.onTouchEntity) {
            let answer = obj.onTouchEntity(e);
            if (answer === 'hit on the player') {
                this.changeHP(-this.damage.enemy);
                if (obj.type === 'bullet') this.kill(obj);
            }
            if (answer === 'hit on the enemy') {
                e.hp -= this.damage.player;
                if (e.hp <= 0) {
                    this.kill(e);
                    this.changeScore(100);
                }
                this.kill(obj);
            }
            if (answer === 'boom!') {
                this.kill(e);
                this.kill(obj);
            }
        }
        if (!(ts === 424 || ts === 111) && obj.onTouchMap) {
            let answer = obj.onTouchMap(ts);
            if (answer === 'next level' && !this.isDefferendUpLevel) {
                this.soundManager.play("./public/sound/good.mp3");
                this.isDefferendUpLevel = true;
                this.currentLevel++;
                setTimeout(() => {this.nextLevel(); this.isDefferendUpLevel = false;}, 500);
            }
            if (answer === 'hill') {
                this.player.hp = 100;
                document.getElementById('hp').innerHTML = '100/100';
            }
            if (answer === 'hot') {
                this.changeScore(-150);
            }
            if (answer === 'bless') {
                this.changeScore(150);
            }
            if (answer === 'dead') {
                this.kill(obj);
            }
            return;
        }
        // Условие стрельбы врагом в игрока
        if (typeWithoutDirection[0] === 'enemy') {
            for (let i = 0; i < 5; i++) {
                let tempX = obj.pos_x + Math.floor(obj.move_x * obj.speed) + i*this.mapManager.blockWidth*obj.move_x;
                let tempY = obj.pos_y + Math.floor(obj.move_y * obj.speed) + i*this.mapManager.blockHeight*obj.move_y;
                e = this.entityAtXY(obj, tempX, tempY);
                if (e) {
                    if (e.type === 'player') {
                        this.fire(obj);
                        break;
                    }
                }
            }
        }
        // Условие перемещения - если идем по клетке земли и нет объектов, которые нам препятствуеют(e - var)
        if ((ts === 424 || ts === 111) && e === null) {
            obj.pos_x = newX;
            obj.pos_y = newY;
        } else {
            return 'break';
        }
        return 'move';
    }

    // Сущность по координатам x, y
    entityAtXY(obj, x, y) {
        for (let i = 0; i < this.objects.length; i++) {
            let e = this.objects[i];
            // Исключаем попадание объекта самого в себя
            if (e.name !== obj.name) {
                if (x + obj.size_x < e.pos_x || y + obj.size_y < e.pos_y || x > e.pos_x + e.size_x || y > e.pos_y + e.size_y) continue;
                return e;
            }
        }
        return null;
    }

    updateAll() {
        if (this.player === null || this.player === undefined) return;
        this.player.move_x = 0;
        this.player.move_y = 0;
        if (this.eventsManager.action['up']) {this.player.move_y = -1; this.player.direction = '_up';}
        if (this.eventsManager.action['down']) {this.player.move_y = 1; this.player.direction = '';} //player_down === player
        if (this.eventsManager.action['left']) {this.player.move_x = -1; this.player.direction = '_left';}
        if (this.eventsManager.action['right']) {this.player.move_x = 1; this.player.direction = '_right';}
        if (this.eventsManager.action['fire']) this.fire(this.player);
        for (let i = 0; i < this.objects.length; i++) {
            try {
                this.update(this.objects[i]);
            } catch (e) {
                console.log(e);
            }
        }
        for (let i = 0; i < this.laterKill.length; i++) {
            let index = this.objects.indexOf(this.laterKill[i]);
            if (index > -1) this.objects.splice(index, 1);
        }
        if (this.laterKill.length > 0) this.laterKill.length = 0;
        this.mapManager.centerAt(this.player.pos_x, this.player.pos_y);
        this.drawMap();

        this.draw();
    }

    startGame() {
        this.intervalGame = setInterval(this.updateAll, 100);
    }

    nextLevel() {
        if (this.currentLevel > 2) {
            // Награда за завершение игры
            this.changeScore(1500);
            setTimeout(this.goToRecordTable, 2000);
            return;
        }
        if (this.currentLevel > 1) {
            // Награда за заврешение первого уровння и переходим на второй ниже условия
            this.changeScore(1000);
        }
        this.objects.length = 0;
        this.mapManager = new MapManager(this.widthMap, this.heightMap);
        this.mapManager.loadMap(`./public/maps/level${this.currentLevel}.json`);
        this.parseObjects();
        document.getElementById('level').innerHTML = `Уровень: ${this.currentLevel}`;
    }

    //переход на страницу с таблицей рекордов
    goToRecordTable() {
        this.newRecord();
        localStorage["score"] = this.score;
        window.location = "records.html";
    }

    //запись нового рекорда в таблицу
    newRecord() {
        console.log(this.player);
        for(let i = 1; i < 6; i++) {
            if(localStorage["result" + i] <= this.score) {
                let j = 4;
                while(j+1 !== i) {
                    let temp1 = localStorage["result" + j];
                    let temp2 = localStorage["gamer" + j];
                    localStorage["result" + (j+1)] = temp1;
                    localStorage["gamer" + (j+1)] = temp2;
                    j--;
                }
                localStorage["result" + i] = this.score;
                localStorage["gamer" + i] = localStorage["nameGamer"];
                return;
            }
        }
    }

    //начальная инициализация таблицы рекордов на новом устройстве
    initRecord() {
        if(localStorage["gamer1"] === undefined) {
            localStorage["gamer1"] = "-";
            localStorage["result1"] = 0;
            localStorage["gamer2"] = "-";
            localStorage["result2"] = 0;
            localStorage["gamer3"] = "-";
            localStorage["result3"] = 0;
            localStorage["gamer4"] = "-";
            localStorage["result4"] = 0;
            localStorage["gamer5"] = "-";
            localStorage["result5"] = 0;
        }
    }

    changeScore(value) {
        this.score = (this.score + value < 0) ? 0 : this.score + value;
        document.getElementById('score').innerHTML = `Счёт: ${this.score}`;
    }

    changeHP(value) {
        this.player.hp = (this.player.hp + value < 0) ? 0 : this.player.hp + value;
        this.player.hp = (this.player.hp > 100) ? 100 : this.player.hp;
        document.getElementById('hp').innerHTML = `${this.player.hp}/100`;
        if (this.player.hp === 0) {
            console.log('kill');
            clearInterval(this.intervalGame);
            this.soundManager.play("./public/sound/boom.mp3");
            setTimeout(this.goToRecordTable, 3000);
        }
    }
}
