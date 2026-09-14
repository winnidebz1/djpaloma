from collections import deque
from pathlib import Path
from PIL import Image

root = Path(__file__).parent
images = root / "Images"
out = images / "featured"
out.mkdir(exist_ok=True)
logos = {
    "mtnlogo.png": "mtn.png",
    "aglow ghana.jpg": "aglow-ghana.png",
    "omnibisc bank.jpg": "omnibisc.png",
    "ofi ghana.png": "ofi-ghana.png",
    "Praise tv.jpg": "praise-tv.png",
    "hitz fm.png": "hitz-fm.png",
    "zylofon media.jpg": "zylofon-media.png",
    "kristocentric.jpg": "kristocentric.png",
    "footprint tv.jpg": "footprint-tv.png",
}


def remove_edge_background(source, destination):
    image = Image.open(source).convert("RGBA")
    pixels = image.load()
    width, height = image.size
    corner = pixels[0, 0][:3]
    tolerance = 42
    visited = bytearray(width * height)
    queue = deque()

    def similar(color):
        return sum((color[i] - corner[i]) ** 2 for i in range(3)) ** 0.5 <= tolerance

    for x in range(width):
        queue.extend(((x, 0), (x, height - 1)))
    for y in range(height):
        queue.extend(((0, y), (width - 1, y)))

    while queue:
        x, y = queue.popleft()
        index = y * width + x
        if visited[index] or not similar(pixels[x, y][:3]):
            continue
        visited[index] = 1
        pixels[x, y] = (*pixels[x, y][:3], 0)
        if x:
            queue.append((x - 1, y))
        if x + 1 < width:
            queue.append((x + 1, y))
        if y:
            queue.append((x, y - 1))
        if y + 1 < height:
            queue.append((x, y + 1))

    image.save(destination, "PNG", optimize=True)


for source_name, output_name in logos.items():
    remove_edge_background(images / source_name, out / output_name)
    print(output_name)
