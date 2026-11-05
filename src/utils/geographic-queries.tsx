import type {GeographicPoint, Neighborhood,} from "../types/geographic";

/**
 * Calculates the straight-line distance between two geographic points.
 * Returns the distance in meters.
 */
export function calculateDistance(pointA: GeographicPoint, pointB: GeographicPoint,): number {
    const earthRadius = 6_371_000;

    const toRadians = (degrees: number) => degrees * (Math.PI / 180);

    const latitudeA = toRadians(pointA.latitude);
    const latitudeB = toRadians(pointB.latitude);

    const latitudeDifference = toRadians(
        pointB.latitude - pointA.latitude,
    );
    const longitudeDifference = toRadians(
        pointB.longitude - pointA.longitude,
    );

    const a =
        Math.sin(latitudeDifference / 2) ** 2 +
        Math.cos(latitudeA) *
        Math.cos(latitudeB) *
        Math.sin(longitudeDifference / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return earthRadius * c;
}

/**
 * Finds all points within a given radius of a reference point.
 * Results are sorted by distance, nearest first.
 */
export function findPointsWithinDistance<T extends GeographicPoint>(
    points: T[],
    referencePoint: GeographicPoint,
    radiusMeters: number,
) {
    if (!Number.isFinite(radiusMeters) || radiusMeters < 0) {
        throw new Error("Radius must be a non-negative number.");
    }

    return points
        .map((point) => ({
            point,
            distanceMeters: calculateDistance(referencePoint, point),
        }))
        .filter((result) => result.distanceMeters <= radiusMeters)
        .sort((a, b) => a.distanceMeters - b.distanceMeters);
}

/**
 * Checks whether a geographic point is inside a polygon.
 * Polygon coordinates use [longitude, latitude].
 * Points on the polygon boundary are also considered inside.
 */
export function isPointInPolygon(point: GeographicPoint, polygon: Neighborhood,): boolean {
    const longitude = point.longitude;
    const latitude = point.latitude;
    const coordinates = polygon.coordinates;

    if (coordinates.length < 3) {
        return false;
    }

    let isInside = false;

    for (
        let current = 0, previous = coordinates.length - 1;
        current < coordinates.length;
        previous = current++
    ) {
        const [currentLongitude, currentLatitude] =
            coordinates[current];
        const [previousLongitude, previousLatitude] =
            coordinates[previous];

        // Treat points on the polygon boundary as inside.
        const crossProduct =
            (longitude - currentLongitude) *
            (previousLatitude - currentLatitude) -
            (latitude - currentLatitude) *
            (previousLongitude - currentLongitude);

        const isOnSegment =
            Math.abs(crossProduct) < 1e-10 &&
            longitude >= Math.min(currentLongitude, previousLongitude) &&
            longitude <= Math.max(currentLongitude, previousLongitude) &&
            latitude >= Math.min(currentLatitude, previousLatitude) &&
            latitude <= Math.max(currentLatitude, previousLatitude);

        if (isOnSegment) {
            return true;
        }

        const intersects =
            currentLatitude > latitude !== previousLatitude > latitude &&
            longitude <
            ((previousLongitude - currentLongitude) *
                (latitude - currentLatitude)) /
            (previousLatitude - currentLatitude) +
            currentLongitude;

        if (intersects) {
            isInside = !isInside;
        }
    }

    return isInside;
}

/**
 * Groups geographic points by neighborhood.
 * Neighborhoods without points are included with an empty array.
 */

export function groupPointsByNeighborhood<T extends GeographicPoint, >(points: T[], neighborhoods: Neighborhood[]) {
    const groupedPoints = new Map<string, T[]>(
        neighborhoods.map((neighborhood) => [neighborhood.id, []]),
    );

    for (const point of points) {
        // Assign a point to the first matching neighborhood.
        const matchingNeighborhood = neighborhoods.find((neighborhood) =>
            isPointInPolygon(point, neighborhood),
        );

        if (matchingNeighborhood) {
            groupedPoints.get(matchingNeighborhood.id)?.push(point);
        }
    }

    return neighborhoods.map((neighborhood) => {
        const matchingPoints = groupedPoints.get(neighborhood.id) ?? [];

        return {
            neighborhood,
            points: matchingPoints,
            count: matchingPoints.length,
        };
    });
}
