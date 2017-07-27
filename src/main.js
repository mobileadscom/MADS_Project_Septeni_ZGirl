/* global window, Image, document, opr, navigator, safari */
/* eslint-disable no-underscore-dangle */
import Mads from 'mads-custom';
import Parallax from 'parallax-js';
import Scratchcard from 'scratchcard';

import './main.css';

const browser = () => {
  // Return cached result if avalible, else get result then cache it.
  if (browser.prototype._cachedResult) { return browser.prototype._cachedResult; }

  // Opera 8.0+
  const isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;

  // Firefox 1.0+
  const isFirefox = typeof InstallTrigger !== 'undefined';

  // Safari 3.0+ "[object HTMLElementConstructor]"
  const isSafari = /constructor/i.test(window.HTMLElement) || (function isItSafari(p) {
    return p.toString() === '[object SafariRemoteNotification]';
  }(!window.safari || safari.pushNotification));

  // Internet Explorer 6-11
  const isIE = /* @cc_on!@*/ false || !!document.documentMode;

  // Edge 20+
  const isEdge = !isIE && !!window.StyleMedia;

  // Chrome 1+
  const isChrome = !!window.chrome && !!window.chrome.webstore;

  // Blink engine detection
  const isBlink = (isChrome || isOpera) && !!window.CSS;

  let _browser = "Don't know";

  switch (true) {
    case (isOpera === true): {
      _browser = 'Opera';
      break;
    }
    case (isFirefox === true): {
      _browser = 'Firefox';
      break;
    }
    case (isSafari === true): {
      _browser = 'Safari';
      break;
    }
    case (isChrome === true): {
      _browser = 'Chrome';
      break;
    }
    case (isIE === true): {
      _browser = 'IE';
      break;
    }
    case (isEdge === true): {
      _browser = 'IE';
      break;
    }
    case (isBlink === true): {
      _browser = 'Blink';
      break;
    }
    default:
      _browser = "Don't know";
  }

  browser.prototype._cachedResult = _browser;

  return _browser;
};

class AdUnit extends Mads {
  render() {
    this.custTracker = [`https://www.cdn.serving1.net/a/analytic.htm?uid=0&isNew=true&referredUrl=${window.location.href || document.URL || ''}&rmaId=1&domainId=0&pageLoadId=${this.pgId}&userId=3728&pubUserId=0&campaignId=b0025760ef15981a0c39d6d452c4c8ef&browser=${browser()}&os=&domain=&callback=trackSuccess&type={{rmatype}}&tt={{rmatt}}&value={{rmavalue}}`];

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
          <div data-depth="0.00"><img src="${data.images.clearGirl}" id="clearGirl" style="position:relative;opacity:0" alt=""></div>
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
        this.elems.clearGirl.style.opacity = 1;
      };

      scratch.on('progress', (progress) => { // eslint-disable-line
        if (Math.floor(progress * 100) >= 50) {
          this.elems.bgBright.style.opacity = 1;
          this.elems.bgDark.style.opacity = 0;

          this.elems.iAmFudo.style.opacity = 1;
          this.elems.scratchMe.style.opacity = 0;

          this.elems.btnAppStore.style.opacity = 1;
          this.elems.btnAppStore.style.pointerEvents = 'auto';

          this.elems.clearGirl.style.opacity = 1;

          scratch.getWrapper().style.opacity = 1;
          setTimeout(() => {
            scratch.getWrapper().style.transition = 'opacity 0.2s';
            scratch.getWrapper().style.opacity = 0;
            this.tracker('E', 'clearScratch');
          }, 10);
        }
      });
    };
  }

  style() {
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
    this.elems.btnAppStore.onclick = () => {
      this.tracker('CTR', 'iosLanding');
      this.linkOpener('https://itunes.apple.com/us/app/zgirls-girls-vs-zombie-battle-game/id1174204073?mt=8');
    };
  }
}

window.ad = new AdUnit();
