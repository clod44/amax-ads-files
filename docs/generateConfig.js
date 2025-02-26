/*
 one time only config generator.
 reads images from maps folder
 $ node generateConfig.js
*/


const fs = require('fs');
const path = require('path');

const mapsPath = path.join(__dirname, '../maps');

function ReadMaps(mapsPath) {
    const config = {
        updated_at: new Date().toISOString(),
        maps: [],
    };
    const maps = fs.readdirSync(mapsPath, { withFileTypes: true })
        .filter(file => file.isDirectory());

    for (const map of maps) {
        console.log("processing", map.name);
        const mapPath = path.join(mapsPath, map.name);
        config.maps.push({
            name: map.name,
            images: ReadImages(mapPath),
        });
    }
    return config;
}

function ReadImages(imagesPath) {
    const images = fs.readdirSync(imagesPath)
        .filter(file => file.endsWith('.png') || file.endsWith('.jpg'));

    const imagesData = [];
    for (const image of images) {
        const imagePath = path.join(imagesPath, image);
        imagesData.push({ name: image, ...GetImageMetadata(imagePath) });
    }
    return imagesData;
}

function GetImageMetadata(imagePath) {
    const dimensions = ReadImageDimensions(imagePath);
    if (dimensions.width === 0 || dimensions.height === 0) {
        return { ...dimensions, error: "Failed to read dimensions" };
    }
    return dimensions;
}

function ReadImageDimensions(imagePath) {
    const buffer = fs.readFileSync(imagePath);
    if (buffer.length < 24) return { width: 0, height: 0 };

    if (imagePath.endsWith('.png')) {
        return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
    }
    if (imagePath.endsWith('.jpg')) {
        let i = 2;
        while (i < buffer.length) {
            if (buffer[i] === 0xFF && (buffer[i + 1] >= 0xC0 && buffer[i + 1] <= 0xC3)) {
                return { height: buffer.readUInt16BE(i + 5), width: buffer.readUInt16BE(i + 7) };
            }
            i += 2 + buffer.readUInt16BE(i + 2);
        }
    }
    return { width: 0, height: 0 };
}

const configData = ReadMaps(mapsPath);
console.log(JSON.stringify(configData, null, 2));
fs.writeFileSync(path.join(__dirname, 'size_config.json'), JSON.stringify(configData, null, 2));
