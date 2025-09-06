self.onmessage = async (event) => {
    const { imageData } = event.data;
    const { width, height, data } = imageData;
    const pixels = Array(height).fill(0).map(() => Array(width).fill(""));

    function hex(n) {
        return n.toString(16).padStart(2, "0");
    }

    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const col = Math.floor((i / 4) % width);
        const row = Math.floor((i / 4) / width);
        if (row < height && col < width) {
            pixels[row][col] = "#" + hex(r) + hex(g) + hex(b);
        }
    }

    self.postMessage(pixels);
};