const utfdecoder = new TextDecoder();
function u_atob(ascii) {
    return utfdecoder.decode(Uint8Array.from(atob(ascii), c => c.charCodeAt(0)));
}

function get_date_str1() {
    var weekday = new Array(7);
    weekday[0] = "星期日";
    weekday[1] = "星期一";
    weekday[2] = "星期二";
    weekday[3] = "星期三";
    weekday[4] = "星期四";
    weekday[5] = "星期五";
    weekday[6] = "星期六";
    let date = new Date();
    return (
        padzero(date.getFullYear(), 4) +
        '-' +
        padzero(date.getMonth() + 1, 2) +
        '-' +
        padzero(date.getDate(), 2) +
        ', ' +
        weekday[date.getDay()]
    );
}

function get_date_str2() {
    let date = new Date();
    return (
        padzero(date.getFullYear(), 4) +
        '-' +
        padzero(date.getMonth() + 1, 2) +
        '-' +
        padzero(date.getDate(), 2)
    );
}

function get_date_str3() {
    let date = new Date();
    return (
        padzero(date.getFullYear(), 4) +
        '-' +
        padzero(date.getMonth() + 1, 2) +
        '-' +
        padzero(date.getDate(), 2) +
        ' ' +
        padzero(date.getHours(), 2) +
        ':' +
        padzero(date.getMinutes(), 2)
    );
}

function add(param) {
    //set parent
    let ele = document.body;
    if ('ele' in param) ele = param.ele;
    //set child
    /** @type HTMLElement */
    let p;
    if ('tag' in param) {
        p = document.createElement(param.tag);
        if ('class' in param) {
            p.classList.add(...param.class.split(' ').filter((str) => { return str.length > 0 }));
        }
        if ('style' in param) {
            p.style.cssText = param.style;
        }
        ele.appendChild(p);
    }
    return p;
}

function setup_canvas(canvas) {
    let out = {};
    out.cn = Math.min(canvas.clientWidth, canvas.clientHeight) * window.devicePixelRatio;
    out.cw = canvas.width = canvas.clientWidth * window.devicePixelRatio;
    out.ch = canvas.height = canvas.clientHeight * window.devicePixelRatio;
    out.cp = out.cn / 100;

    //create context
    out.context = canvas.getContext("2d");
    return out;
}

function load_img(path) {
    return new Promise(
        async resolve => {
            let img;
            img = new Image();
            img.src = path;
            img.onload = () => {
                resolve(img);
            };
        }
    );
}

function padzero(val, size) {
    let s = val + "";
    while (s.length < size) s = "0" + s;
    return s;
}


function wait_event(param) {
    if (!('ele' in param)) param.ele = document.body;
    let prom = new Promise((resolve) => {
        param.ele.addEventListener(param.type, resolve, { once: true });
    });
    return prom;
}
/** wait game frame out
 * 
 * @returns {Promise<DOMHighResTimeStamp>} */
function wait_frame_out() {
    return new Promise((resolve) => {
        window.requestAnimationFrame(resolve);
    });
}
function addhtml(parent, html) {
    parent.insertAdjacentHTML('beforeend', html);
}

