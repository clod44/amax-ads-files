let canvas;

const canvasHolder = $("#canvas-holder")[0];

//needed for simulating the resolution without actually making the canvas smaller
let baseCanvas;
let imageCanvas;

let OBJECTFIT = "fill";
$("#image-object-fit").on("change", function () {
    OBJECTFIT = $(this).val();
})

let POSX = 0.0; //offset (relative to width. +1.0 means a whole (nonscaled) width amount of offset)
let POSY = 0.0;
let SCALE = 1.0;
$("#posX-value").val(POSX);
$("#posY-value").val(POSY);
$("#scale-value").val(SCALE);
$("#posX-value").on("change", function () {
    POSX = parseFloat($(this).val());
})
$("#posY-value").on("change", function () {
    POSY = parseFloat($(this).val());
})
$("#scale-value").on("change", function () {
    SCALE = parseFloat($(this).val());
})

$("#image-select").on("change", changeImageTemplate);
function setup() {
    canvas = createCanvas(canvasHolder.clientWidth, canvasHolder.clientHeight);
    canvas.parent("canvas-holder");
    window.addEventListener("resize", resizeCanvasToDiv);
    baseCanvas = createGraphics(256, 256);
    baseCanvas.noFill();
    imageCanvas = createGraphics(256, 256);
    changeImageTemplate();
}

$("#imageFileInput").on("change", function () {
    const file = this.files[0];
    let urlOfImageFile = URL.createObjectURL(file);
    let img = loadImage(urlOfImageFile, () => {
        imageCanvas.clear();
        imageCanvas.resizeCanvas(img.width, img.height)
        imageCanvas.image(img, 0, 0);
        console.log(img)
        console.log(urlOfImageFile)
    });
})
function draw() {
    const bg = random(50)
    background(0);
    renderImage();
    image(baseCanvas, 0, 0, width, height)
}

function renderImage() {
    let x = 0;
    let y = 0;
    let w = 1;
    let h = 1;

    //temps
    let scaleFactor = 1.0;
    let newWidth = 1.0;
    let newHeight = 1.0;
    switch (OBJECTFIT) {
        case "fill":
            x = 0;
            y = 0;
            w = baseCanvas.width;
            h = baseCanvas.height;
            break;
        case "cover":
            scaleFactor = Math.max(baseCanvas.width / imageCanvas.width, baseCanvas.height / imageCanvas.height);
            newWidth = imageCanvas.width * scaleFactor;
            newHeight = imageCanvas.height * scaleFactor;
            //find offset to center the image
            x = (baseCanvas.width - newWidth) * 0.5;
            y = (baseCanvas.height - newHeight) * 0.5;
            w = newWidth;
            h = newHeight;
            break;
        case "contain":
            scaleFactor = 1.0
            if (imageCanvas.width / imageCanvas.height > baseCanvas.width / baseCanvas.height) {
                scaleFactor = baseCanvas.width / imageCanvas.width
            } else {
                scaleFactor = baseCanvas.height / imageCanvas.height
            }
            newWidth = imageCanvas.width * scaleFactor;
            newHeight = imageCanvas.height * scaleFactor;
            //find offset to center the image
            x = (baseCanvas.width - newWidth) * 0.5;
            y = (baseCanvas.height - newHeight) * 0.5;
            w = newWidth;
            h = newHeight;
            break;
        default:
            console.log("unknown object fit: " + OBJECTFIT);
            break;
    }

    baseCanvas.background(0);
    baseCanvas.push();
    baseCanvas.translate(x + w / 2, y + h / 2); // move the origin to the center of the image
    baseCanvas.scale(SCALE);
    baseCanvas.translate(-w / 2, -h / 2); // move the image back to its original position, but now scaled from the center
    baseCanvas.image(imageCanvas, POSX * baseCanvas.width, POSY * baseCanvas.height, w, h);
    baseCanvas.pop();
}

$("#export-button").on("click", function () {
    const fileName = $('#image-select option:selected').text();
    console.log(fileName);
    saveCanvas(baseCanvas, fileName || 'nameNotFound.png');
});


function resizeCanvasToDiv() {
    resizeCanvas(canvasHolder.clientWidth, canvasHolder.clientHeight);
}

function changeImageTemplate() {
    const image = getCurrentImage();
    if (!image) return;
    baseCanvas.resizeCanvas(image.width, image.height);
    baseCanvas.clear();
    //update its css. set aspect ratio to image's aspect ratio
    $("#canvas-holder").css("aspect-ratio", image.width / image.height);
    resizeCanvasToDiv();
}

function initializeCanvas() {
    changeImageTemplate();
}