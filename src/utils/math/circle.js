export function radiusFromSize(width, height) {
    return ((width * width) / (8 * height) + height / 2);
}
