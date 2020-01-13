class glitchBanner {

  constructor (container, width, height, path) {
    this.app = new PIXI.Application({
      width: width,
      height: height,
      antialias: true,
    })
    this.path = path;
    this.container = document.querySelector(container);
    this.init();
  }
  load () {
    return new Promise((resolve, reject) => {
      let sprites = {};
      for (let key in this.imgs) {
        this.app.loader.add(key, this.path + this.imgs[key]);
      }
      this.app.loader.load((loader, resources) => {
        for (let key in resources) {
          sprites[key] = new PIXI.Sprite(resources[key].texture);
        }
        resolve(sprites);
      })
    })
  }
  async init () {
    this.imgs = {
      "banner": "img/wr-1.jpg",
      "video": "files/video_banner1.mp4"
    }
    this.sprites = await this.load();
    this.container.appendChild(this.app.view);
    this.startApp()
  }
  startApp() {
    this.drawBg();
    this.animate();
  }
  drawBg () {
    this.bgContainer =  new PIXI.Container();
    const bgRatio = this.sprites.banner.width/this.sprites.banner.height;
    this.sprites.banner.width = this.app.screen.width;
    this.sprites.banner.height = this.app.screen.width/bgRatio;

    // this.drawVideo(this.bgContainer);
    this.bgContainer.addChild(this.sprites.banner);
    this.app.stage.addChild(this.bgContainer);

  }

  drawVideo (container) {
    this.videoContainer =  new PIXI.Container();
    var videoTexture = PIXI.Sprite.from(this.path + 'files/video_banner1.mp4');
    var video = videoTexture.texture.baseTexture.source;
    video.setAttribute('loop', true)
    video.muted= true;

    container.addChild(videoTexture);

  }


  animate () {
    let count = 0;
    this.timerId = setInterval(() => {
      if(count < 3) {
        this.addGlitch(this.bgContainer)
        count++
      } else {
        clearTimeout(this.timerId);
        this.bgContainer.filters = null;
        setTimeout(() => {
          count = 0;
          this.animate();
        }, 5000);
      }
    }, 50);
  }

  addGlitch (container) {
    let glitch = new PIXI.filters.GlitchFilter({
      // slices: 4,
      slices: 50,
      offset: 20,
      direction: 0,
      fillMode: 4,
      average: false,
      red: [2, 2],
      green: [-10, 4],
      blue: [10, -4],
      seed: 0.5,
      minSize: 20
    });
    container.filters = [glitch];
  }

  redraw (width, height) {
    this.app.renderer.resize(width, height);
    this.startApp();
  }

}

let bannerRatio = 2.4;
let banner = new glitchBanner(".canvas-container", window.innerWidth, window.innerWidth/bannerRatio, '/');

window.addEventListener('resize', function () {
  banner.redraw(window.innerWidth, window.innerWidth/bannerRatio);
})
