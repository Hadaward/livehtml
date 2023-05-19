export function circleRadiusFromSize(width, height) {
    return ((width * width) / (8 * height) + height / 2);
}
