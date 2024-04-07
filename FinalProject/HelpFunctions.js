//Directly from canvas about linecircle intersection collision
//This has collision Logic, and other global functions that may need called anywhere. could be refactored into  A Collisions.js
function lineCircleIntersection(pt1, pt2, circle) {
    let v1 = { x: pt2.x - pt1.x, y: pt2.y - pt1.y };  
    let v2 = { x: pt1.x - circle.center.x, y: pt1.y - circle.center.y };
    let b = -2 * (v1.x * v2.x + v1.y * v2.y);
    let c =  2 * (v1.x * v1.x + v1.y * v1.y);
    let d = Math.sqrt(b * b - 2 * c * (v2.x * v2.x + v2.y * v2.y - circle.radius * circle.radius));
    if (isNaN(d)) { // no intercept
        return { intersect: false, safe: false }
    }
    // These represent the unit distance of point one and two on the line
    let u1 = (b - d) / c;  
    let u2 = (b + d) / c;
    if (u1 <= 1 && u1 >= 0 && pt1.safe) {  // If point on the line segment is safe
        return { intersect: true, safe: true };
    }
    if (u2 <= 1 && u2 >= 0 && pt2.safe) {  // If point on the line segment is safe
        return { intersect: true, safe: true };
    }
    if (u1 <= 1 && u1 >= 0) {  // If point on the line segment is not safe
        return { intersect: true, safe: false};
    }
    if (u2 <= 1 && u2 >= 0 ) {  // If point on the line segment is not safe
        return { intersect: true, safe: false };
    }
    return { intersect: false, safe: false };
}

//From the lecture notes about particle systems

