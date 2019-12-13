export class SpriteManager {
    constructor() {
        this.image = new Image(); // рисунок с объектами
        this.sprites = []; // массив объектов для отображения
        this.isImgLoad = false; // изображения загружены
        this.isJsonLoad = false; // JSON загружен
    }

    loadAtlas(atlasJson, atlasImg) {
        let req = new XMLHttpRequest();
        req.onreadystatechange = () => { if (req.readyState === 4 && req.status === 200) this.parseAtlas(JSON.parse(req.responseText)); };
        req.open('GET', atlasJson);
        req.send();
        this.loadImg(atlasImg);
    }

    loadImg(img) {
        this.image.onload = () => { this.isImgLoad = true; };
        this.image.src = img;
    }

    parseAtlas(atlas) {
        for (let type in atlas.frames) {
            let frame = atlas.frames[type].frame;
            this.sprites.push({type: type, x: frame.x, y: frame.y, w: frame.w, h: frame.h});
        }
        this.isJsonLoad = true;
    }

    drawSprite(context, type, direction, x, y, view) {
        if (!this.isImgLoad || !this.isJsonLoad) {
            setTimeout(() => { this.drawSprite(context, name, x, y); }, 100);
        } else {
            let sprite = this.getSprite(`${type}${direction}`);
            if (!this.isVisible(x, y, sprite.w, sprite.h, view)) return;
            x -= view.x;
            y -= view.y;
            context.drawImage(this.image, sprite.x, sprite.y, sprite.w, sprite.h, x, y, sprite.w, sprite.h);
        }
    }

    getSprite(type) {
        for (let i = 0; i < this.sprites.length; i++) {
            if (this.sprites[i].type === type) return this.sprites[i];
        }
        return null;
    }

    isVisible(x, y, width, height, view) {
        if (x + width < view.x || y + height < view.y || x > view.x + view.w || y > view.y + view.h) return false;
        return true;
    }
}
