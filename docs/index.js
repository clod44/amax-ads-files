let CONFIG;

async function loadConfig() {
    try {
        const response = await fetch('size_config.json');
        CONFIG = await response.json();
        $('#config').text(JSON.stringify(CONFIG, null, 2));
    } catch (error) {
        console.error('Error loading JSON:', error);
    }
}

$(async function () {
    await loadConfig();
    populateMapSelect();
    initializeCanvas();
});

$('#map-select').on('change', populateImagesSelect);
function populateMapSelect() {
    const mapsSelect = $('#map-select');
    mapsSelect.empty();
    console.log(CONFIG);
    $.each(CONFIG.maps, (index, map) => {
        $('<option>').attr('value', index).text(map.name).appendTo(mapsSelect);
    });
    mapsSelect.val(0);
    populateImagesSelect();
}
$('#image-select').on('change', showImageData);
function populateImagesSelect() {
    const mapIndex = parseInt($('#map-select').val());
    const map = CONFIG.maps[mapIndex];
    const images = map.images;
    const imagesSelect = $('#image-select');
    imagesSelect.empty();
    $.each(images, (index, image) => {
        $('<option>').attr('value', index).text(image.name).appendTo(imagesSelect);
    });
    imagesSelect.val(0);
    showImageData();
    changeImageTemplate();
}

function showImageData() {
    const mapIndex = parseInt($('#map-select').val());
    const map = CONFIG.maps[mapIndex];
    const images = map.images;
    const imageIndex = parseInt($('#image-select').val());
    const image = images[imageIndex];
    $('#image-data').text(JSON.stringify(image, null, 2));
}

function getCurrentImage() {
    const mapIndex = parseInt($('#map-select').val());
    if (!CONFIG || !CONFIG.maps || !CONFIG.maps[mapIndex]) return null;
    const map = CONFIG.maps[mapIndex];
    const images = map.images;
    const imageIndex = parseInt($('#image-select').val());
    return images && images[imageIndex] !== undefined ? images[imageIndex] : null;
}


$("#scale-decrease-button").on("click", function () {
    const scaleValueInput = $("#scale-value");
    scaleValueInput[0].stepDown();
    scaleValueInput.change();
});

$("#scale-increase-button").on("click", function () {
    const scaleValueInput = $("#scale-value");
    scaleValueInput[0].stepUp();
    scaleValueInput.change();
});

$("#posX-decrease-button").on("click", function () {
    const posXValueInput = $("#posX-value");
    posXValueInput[0].stepDown();
    posXValueInput.change();
});

$("#posX-increase-button").on("click", function () {
    const posXValueInput = $("#posX-value");
    posXValueInput[0].stepUp();
    posXValueInput.change();
});

$("#posY-decrease-button").on("click", function () {
    const posYValueInput = $("#posY-value");
    posYValueInput[0].stepDown();
    posYValueInput.change();
});

$("#posY-increase-button").on("click", function () {
    const posYValueInput = $("#posY-value");
    posYValueInput[0].stepUp();
    posYValueInput.change();
});