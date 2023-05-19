export function isPointInsideRect(point, rect, size) {
    // is the point inside the rectangle's bounds?
    if (point.x >= rect.x &&        // right of the left edge AND
        point.x <= rect.x + size.x &&   // left of the right edge AND
        point.y >= rect.y &&        // below the top AND
        point.y <= rect.y + size.y) {   // above the bottom
          return true;
    }
    return false;
  }