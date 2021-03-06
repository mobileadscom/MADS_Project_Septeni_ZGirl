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
    // this.custTracker = [`https://www.cdn.serving1.net/a/analytic.htm?uid=0&isNew=true&referredUrl=${window.location.href.split('?')[0] || document.URL.split('?')[0] || ''}&rmaId=1&domainId=0&pageLoadId=${this.pgId}&userId=3728&pubUserId=0&campaignId=b0025760ef15981a0c39d6d452c4c8ef&browser=${browser()}&os=&domain=&callback=trackSuccess&type={{rmatype}}&tt={{rmatt}}&value={{rmavalue}}`];
    console.log(this);
    const data = this.data;

    return `
      <div class="container" id="ad-container">
        <div id="blocker" style="width:320px;height:480px;display:none;position:absolute;left:0;top:0;z-index:999;"></div>
        <div class="preload-bright-bg"></div>
        <img src="${data.scratchMe}" id="scratchMe" class="float" alt="">
        <img src="${data.iAmName}" id="iAmName" class="float" alt="">
        <img src="${data.btnAppStore}" id="btnAppStore" class="float" alt="">
        <img src="${data.handGif}" id="handGif" class="float" alt="">
        <div id="outsideScratch"></div>
        <div id="scene">
          <div data-depth="0.00"><img src="${data.mainBG}" id="mainBG" style="position:relative;" alt=""></div>
          <div data-depth="20.00"><img src="${data.river}" id="river" style="position:relative;top:230px;" alt=""></div>
          <div data-depth="20.00"><img src="${data.build}" id="build" style="position:relative;top:80px;left:-35px;" alt=""></div>
          <div data-depth="40.00"><img src="${data.cloud}" id="build" style="position:relative;left:-35px;" alt=""></div>
          <div data-depth="0.00"><img src="${data.clearGirl}" id="clearGirl" style="position:relative;opacity:0" alt=""></div>
        </div>
      </div>
    `;
  }

  postRender() {
    const data = this.data; // eslint-disable-line
    this.elems.mainBG.onload = () => {
      const parallax = new Parallax(this.elems.scene, { // eslint-disable-line
        limitY: 0.6,
        limitX: 0.7,
        originX: 0,
      });

      const scratch = new Scratchcard(this.elems.clearGirl); // eslint-disable-line
      const canvas = scratch.getCanvas();
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.src = this.resolve(data.shadowGirl);
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 1, 0);
        this.elems.clearGirl.style.opacity = 1;
      };

      scratch.getWrapper().addEventListener('mousedown', () => {
        this.elems.handGif.style.display = 'none';
      });

      scratch.on('progress', (progress) => { // eslint-disable-line
        if (Math.floor(progress * 100) >= 50) {
          this.elems.iAmName.style.opacity = 1;
          this.elems.scratchMe.style.opacity = 0;

          this.elems.btnAppStore.style.opacity = 1;
          this.elems.btnAppStore.style.pointerEvents = 'auto';

          this.elems.clearGirl.style.opacity = 1;

          scratch.getWrapper().style.opacity = 1;
          setTimeout(() => {
            scratch.getWrapper().style.transition = 'opacity 0.2s';
            scratch.getWrapper().style.opacity = 0;
            this.tracker('E', 'clearScratch');

            this.elems.blocker.style.display = 'block';
          }, 10);
        }
      });
    };
  }

  style() {
    const data = this.data;

    return [`
      .preload-bright-bg {
        background: url(${data.mainBG}) no-repeat -9999px -9999px;
        position: absolute;
        height: 0;
        width: 0;
        z-index: -9999;
      }
      #ad-container {
        background-color: ${data.bgColor};

      }

      #ad-container * {
        cursor: url(${data.cursor}) auto;
      }

      #scratchMe {
        left: ${data.scratchMePosition.split(',')[0]} !important;
        top: ${data.scratchMePosition.split(',')[1]} !important;
      }

      #iAmName {
        left: ${data.revealMsgPosition.split(',')[0]} !important;
        top: ${data.revealMsgPosition.split(',')[1]} !important;
      }

      #btnAppStore {
        left: ${data.btnMorePosition.split(',')[0]} !important;
        bottom: ${data.btnMorePosition.split(',')[1]} !important;
      }

      #handGif {
        left: ${data.handIconPosition.split(',')[0]} !important;
        top: ${data.handIconPosition.split(',')[1]} !important;
      }

      #clearGirl, .scratchcard {
        left: ${data.mainImgPosition.split(',')[0]} !important;
        top: ${data.mainImgPosition.split(',')[1]} !important;
      }
    `];
  }

  events() {
    this.elems.btnAppStore.onclick = () => {
      this.tracker('CTR', 'landing');
      this.tracker('E', 'landing');
      this.linkOpener(this.data.url);
    };

    // Test via a getter in the options object to see if the passive property is accessed
    let supportsPassive = false;
    try {
      const opts = Object.defineProperty({}, 'passive', {
        get() {
          supportsPassive = true;
        },
      });
      window.addEventListener('test', null, opts);
    } catch (e) { console.log(e); }

    document.addEventListener(document, 'touchstart', (e) => {
      console.log(e.defaultPrevented); // will be false
      e.preventDefault(); // does nothing since the listener is passive
      console.log(e.defaultPrevented); // still false
    }, supportsPassive ? { passive: true } : false);

    document.getElementById('blocker').addEventListener('click', () => {
      this.tracker('CTR', 'landing');
      this.tracker('E', 'landing');
      this.linkOpener(this.data.url);
    }, supportsPassive ? { passive: true } : false);
  }
}

window.ad = new AdUnit();
