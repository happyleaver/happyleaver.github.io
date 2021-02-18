setTimeout(() => {
    load_img('pass_top.png');
    load_img('pass_bottom.png');
    load_img('getcode_top.png');
    load_img('welcome_top.png');
    load_img('welcome_bottom.png');
}, 300);

var d1;
/** @type string */
var code;
async function showpass() {
    let data = {};
    try {
        let translatedcode = u_atob(code.substr(6));
        data = JSON.parse(translatedcode.substr(translatedcode.indexOf('{')));
    } catch (e) {
    }

    if ('nameZh' in data) locname = data.nameZh;
    else locname = '唔知邊L度';

    //show
    let passtopimg = await load_img('pass_top.png');
    let passbottomimg = await load_img('pass_bottom.png');
    let canvas = add({ ele: d1, tag: 'canvas', style: 'width:100%;height:100%;' });

    //context region
    let c = setup_canvas(canvas);
    let [cp, cw, ch, context] = [c.cp, c.cw, c.ch, c.context];

    context.save();
    context.fillStyle = '#12b188';
    context.fillRect(0, 0, cw, ch);

    //draw passtop
    context.drawImage(passtopimg, 0, 0, cw, cw / passtopimg.width * passtopimg.height);
    //transform to passtop coordinate
    context.save();
    context.scale(cw / passtopimg.width, cw / passtopimg.width);
    context.save();//text1
    context.fillStyle = '#ffda31';
    context.font = '72px Arial'
    context.textBaseline = 'middle';
    context.textAlign = 'center'
    context.shadowColor = "rgb(0,0,0,1)";
    context.shadowBlur = 3; context.shadowOffsetX = 0.5;
    context.shadowOffsetY = 1;
    context.fillText(locname, 540, 365);
    context.restore(); //end text1
    context.save();//text2
    context.fillStyle = '#fff';
    context.font = '45px Arial'
    context.textBaseline = 'middle';
    context.textAlign = 'center'
    context.shadowColor = "rgb(0,0,0,1)";
    context.shadowBlur = 3; context.shadowOffsetX = 0.5;
    context.shadowOffsetY = 1;
    context.fillText(get_date_str3(), 540, 450);
    context.restore(); //end text2
    context.restore(); //end passtop

    //passbottom
    context.drawImage(passbottomimg, 0, ch - cw / passbottomimg.width * passbottomimg.height, cw, cw / passbottomimg.width * passbottomimg.height);

    context.restore();

    function inquit(pos) {
        return false;
    }

    let quitpos = [];
    while (!inquit(quitpos)) {
        let e = await wait_event({ ele: canvas, type: 'mousedown' });
        if (
            (e.clientX > canvas.clientWidth / passtopimg.width * 760 &&
                e.clientY < canvas.clientWidth / passtopimg.width * 120) ||
            (e.clientX > canvas.clientWidth / passtopimg.width * 153 &&
                e.clientX < canvas.clientWidth / passtopimg.width * 775 &&
                canvas.clientHeight - e.clientY < canvas.clientWidth / passtopimg.width * 290 &&
                canvas.clientHeight - e.clientY > canvas.clientWidth / passtopimg.width * 150)
        ) break;
    }
    canvas.remove();
    location.reload();
}
async function getcode() {
    let canvas = add({ ele: d1, tag: 'canvas', style: 'width:100%;height:100%;background-color:#000;' });

    //start camera
    var video = document.createElement("video");
    let stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
    video.srcObject = stream;
    video.setAttribute("playsinline", true); //for safari
    video.play();

    //setup context
    while (video.readyState != video.HAVE_ENOUGH_DATA) await wait_frame_out();
    let vh = video.videoHeight;
    let vw = video.videoWidth;
    let cw, ch;
    if (vw / vh > canvas.clientWidth / canvas.clientHeight) {
        ch = canvas.height = vh;
        cw = canvas.width = vh * canvas.clientWidth / canvas.clientHeight;
        vy = 0;
        vx = (cw - vw) / 2;
    } else {
        cw = canvas.width = vw;
        ch = canvas.height = vw * canvas.clientHeight / canvas.clientWidth;
        vx = 0;
        vy = (ch - vh) / 2;
    }
    let context = canvas.getContext("2d");
    let cx = cw / 2, cy = ch / 2;

    //render callback
    function render(resolve) {
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
            context.drawImage(video, vx, vy, vw, vh);
            let imageData = context.getImageData(vx, vy, vw, vh);
            let code = jsQR(imageData.data, imageData.width, imageData.height, { inversionAttempts: "dontInvert" });
            if (code) resolve(code.data);

        }
        requestAnimationFrame(render.bind(this, resolve));
    }

    //draw decoration
    let canvas2 = add({ ele: d1, tag: 'canvas', style: 'width:100%;height:100%;position:absolute;top:0px;left:0px;' });
    {
        let getcodetopimg = await load_img('getcode_top.png');
        //context region
        let c = setup_canvas(canvas2);
        let [cp, cx, cy, cw, ch, context] = [c.cp, c.cx, c.cy, c.cw, c.ch, c.context];
        //fill black background
        context.save();
        context.beginPath();
        context.moveTo(0, 0);
        context.lineTo(cw, 0);
        context.lineTo(cw, ch);
        context.lineTo(0, ch);
        context.lineTo(0, 0);
        context.closePath();
        let [hx, hy, hw, hh] = [cw * .15, (ch - cw * .7) / 2, cw * .7, cw * .7];
        context.moveTo(hx, hy);
        context.lineTo(hx, hy + hh);
        context.lineTo(hx + hw, hy + hh);
        context.lineTo(hx + hw, hy);
        context.lineTo(hx, hy);
        context.closePath();
        context.fillStyle = 'rgb(0,0,0,.5)';
        context.fill();
        context.restore();
        //draw border
        context.save();
        let lt = 2.5 * cp;
        context.beginPath();
        context.moveTo(hx - lt / 2, hy - lt / 2 + hh * .2);
        context.lineTo(hx - lt / 2, hy - lt / 2);
        context.lineTo(hx - lt / 2 + hw * .2, hy - lt / 2);
        context.moveTo(hx + hw + lt / 2, hy - lt / 2 + hh * .2);
        context.lineTo(hx + hw + lt / 2, hy - lt / 2);
        context.lineTo(hx + hw + lt / 2 - hw * .2, hy - lt / 2);
        context.moveTo(hx - lt / 2, hy + hh + lt / 2 - hh * .2);
        context.lineTo(hx - lt / 2, hy + hh + lt / 2);
        context.lineTo(hx - lt / 2 + hw * .2, hy + hh + lt / 2);
        context.moveTo(hx + hw + lt / 2, hy + hh + lt / 2 - hh * .2);
        context.lineTo(hx + hw + lt / 2, hy + hh + lt / 2);
        context.lineTo(hx + hw + lt / 2 - hw * .2, hy + hh + lt / 2);

        context.lineWidth = lt;
        context.strokeStyle = '#12b188';
        context.stroke();
        context.restore();

        context.save();
        context.fillStyle = '#fff';
        context.font = 5 * cp + 'px Arial';
        context.textBaseline = 'middle';
        context.textAlign = 'center'
        context.fillText('掃瞄二維碼', cw / 2, hy + hh + 13 * cp);
        context.restore();//end second text

        context.drawImage(getcodetopimg, 0, 0, cw, cw / getcodetopimg.width * getcodetopimg.height);
    }


    //get code from camera
    code = await (new Promise(resolve => {
        requestAnimationFrame(render.bind(this, resolve));
    }));

    canvas2.remove();
    video.remove();
    canvas.remove();

}
async function welcome() {
    let welcometopimg = await load_img('welcome_top.png');
    let welcomebottomimg = await load_img('welcome_bottom.png');
    let canvas = add({ ele: d1, tag: 'canvas', style: 'width:100%;height:100%;' });
    {
        //context region
        let c = setup_canvas(canvas);
        let [cp, cw, ch, context] = [c.cp, c.cw, c.ch, c.context];

        context.save();
        context.fillStyle = '#fff';
        context.fillRect(0, 0, cw, ch);

        //draw img
        //determine pos
        context.drawImage(welcometopimg, 0, 0, cw, cw / welcometopimg.width * welcometopimg.height);
        //transform to welcometop coordinate
        context.save();
        context.scale(cw / welcometopimg.width, cw / welcometopimg.width);
        context.save();
        context.fillStyle = '#fff';
        context.font = '44px Arial'
        context.textBaseline = 'top';
        context.shadowColor = "rgb(0,0,0,1)";
        context.shadowBlur = 3; context.shadowOffsetX = 0.5;
        context.shadowOffsetY = 1;
        context.fillText(get_date_str1(), 77, 42);
        context.restore(); //end shadow
        context.save();
        context.fillStyle = '#000';
        context.font = '35px Arial';
        context.textBaseline = 'top';
        context.fillText('最後更新' + get_date_str2(), 126, 1375);
        context.restore();//end second text
        context.restore();//end transform
        context.save();
        context.shadowColor = "rgb(0,0,0,0.2)";
        context.shadowBlur = 10;
        context.drawImage(welcomebottomimg, 0, ch - cw / welcomebottomimg.width * welcomebottomimg.height, cw, cw / welcomebottomimg.width * welcomebottomimg.height);
        context.restore();

        context.restore();

    }

    await wait_event({ ele: canvas, type: 'click' });
    canvas.remove();
}

async function run() {
    d1 = document.getElementById('d1');
    await welcome();
    await getcode();
    await showpass();
}
