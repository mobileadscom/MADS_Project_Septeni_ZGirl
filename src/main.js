/* global window, Image */
import Mads from 'mads-custom';
import Parallax from 'parallax-js';
import Scratchcard from 'scratchcard';

import './main.css';


class AdUnit extends Mads {
  render() {
    const data = this.data;

    return `
      <div class="container" id="ad-container">
        <div class="preload-bright-bg"></div>
        <img src="${data.images.headerLogo}" id="headerLogo" class="float" alt="">
        <img src="${data.images.scratchMe}" id="scratchMe" class="float" alt="">
        <img src="${data.images.iAmFudo}" id="iAmFudo" class="float" alt="">
        <img src="${data.images.btnAppStore}" id="btnAppStore" class="float" alt="">
        <div id="outsideScratch"></div>
        <div id="scene">
          <div data-depth="20.00"><img src="${data.images.brightBG}" id="bgBright" style="position:relative;" alt=""></div>
          <div data-depth="20.00"><img src="${data.images.darkBG}" id="bgDark" style="position:relative;" alt=""></div>
          <div data-depth="0.00"><img src="${data.images.clearGirl}" id="clearGirl" style="position:relative;" alt=""></div>
        </div>
      </div>
    `;
  }

  postRender() {
    const data = this.data;
    this.elems.bgDark.onload = () => {
      this.elems.bgDark.style.left = `-${this.elems.bgDark.width / 6}px`;
      this.elems.bgDark.style.top = '-10px';
      this.elems.bgBright.style.left = this.elems.bgDark.style.left;
      this.elems.bgBright.style.top = this.elems.bgDark.style.top;

      const parallax = new Parallax(this.elems.scene, { // eslint-disable-line
        limitY: 0.6,
        limitX: 0.7,
        originX: 0.9,
      });

      const scratch = new Scratchcard(this.elems.clearGirl); // eslint-disable-line
      const canvas = scratch.getCanvas();
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.src = this.resolve(data.images.shadowGirl);
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, -4.5, -1);
      };

      scratch.on('progress', (progress) => { // eslint-disable-line
        if (Math.floor(progress * 100) >= 95) {
          this.elems.bgBright.style.opacity = 1;
          this.elems.bgDark.style.opacity = 0;

          this.elems.iAmFudo.style.opacity = 1;
          this.elems.scratchMe.style.opacity = 0;

          this.elems.btnAppStore.style.opacity = 1;
          this.elems.btnAppStore.style.pointerEvents = 'auto';
        }
      });
    };
  }

  style() {
    console.log('elements', this.elems);
    const data = this.data;

    return [`
      .preload-bright-bg {
        background: url(${data.images.brightBG}) no-repeat -9999px -9999px;
        position: absolute;
        height: 0;
        width: 0;
        z-index: -9999;
      }
      #ad-container {
        background-color: ${data.styles.bgColor};
        
      }
      
      #ad-container * {
        cursor: url(${data.images.cursor}) auto;
      }
      
    `];
  }

  events() {
    console.log('load events');
  }
}

window.ad = new AdUnit();
