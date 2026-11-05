import type {GeographicPoint, Neighborhood} from "../types/geographic.ts";
import {calculateDistance, groupPointsByNeighborhood, isPointInPolygon} from "./geographic-queries.tsx";

/**
 * Finds the school-park combination with the shortest distance.
 */
export function findSchoolClosestToPark(schools: GeographicPoint[], parks: GeographicPoint[],) {
    if (schools.length === 0 || parks.length === 0) {
        return null;
    }

    let closestPair: {
        school: GeographicPoint;
        park: GeographicPoint;
        distanceMeters: number;
    } | null = null;

    for (const school of schools) {
        for (const park of parks) {
            const distanceMeters = calculateDistance(school, park);

            if (
                closestPair === null ||
                distanceMeters < closestPair.distanceMeters
            ) {
                closestPair = { school, park, distanceMeters };
            }
        }
    }

    return closestPair;
}

/**
 * Finds the neighborhood containing a geographic point.
 * Uses the first matching neighborhood for boundary points.
 */
export function findNeighborhoodForPoint(point: GeographicPoint, neighborhoods: Neighborhood[],) {
    return neighborhoods.find((neighborhood) =>
        isPointInPolygon(point, neighborhood),
    ) ?? null;
}

/**
 * Finds all schools in the same neighborhood as a selected school.
 * The selected school is included in the results.
 */
export function findSchoolsInSameNeighborhood(
    selectedSchoolId: string,
    schools: GeographicPoint[],
    neighborhoods: Neighborhood[],
) {
    const selectedSchool = schools.find(
        (school) => school.id === selectedSchoolId,
    );

    if (!selectedSchool) {
        return null;
    }

    const neighborhood = findNeighborhoodForPoint(
        selectedSchool,
        neighborhoods,
    );

    if (!neighborhood) {
        return null;
    }

    const matchingSchools = schools.filter((school) =>
        isPointInPolygon(school, neighborhood),
    );

    return {
        neighborhood,
        schools: matchingSchools,
        count: matchingSchools.length,
    };
}

/**
 * Finds the school whose nearest park is the farthest away.
 */
export function findSchoolFarthestFromNearestPark(schools: GeographicPoint[], parks: GeographicPoint[],) {
    if (schools.length === 0 || parks.length === 0) {
        return null;
    }

    let farthestResult: {
        school: GeographicPoint;
        nearestPark: GeographicPoint;
        distanceMeters: number;
    } | null = null;

    for (const school of schools) {
        let nearestPark: GeographicPoint | null = null;
        let nearestDistance = Infinity;

        for (const park of parks) {
            const distanceMeters = calculateDistance(school, park);

            if (distanceMeters < nearestDistance) {
                nearestDistance = distanceMeters;
                nearestPark = park;
            }
        }

        if (
            nearestPark &&
            (farthestResult === null ||
                nearestDistance > farthestResult.distanceMeters)
        ) {
            farthestResult = {
                school,
                nearestPark,
                distanceMeters: nearestDistance,
            };
        }
    }

    return farthestResult;
}

/**
 * Finds the neighborhood(s) with the most schools.
 * Returns all neighborhoods tied for the highest count.
 */
export function findNeighborhoodWithMostSchools(schools: GeographicPoint[], neighborhoods: Neighborhood[],) {
    const groupedSchools = groupPointsByNeighborhood(
        schools,
        neighborhoods,
    );

    if (groupedSchools.length === 0) {
        return [];
    }

    const highestCount = Math.max(
        ...groupedSchools.map((group) => group.count),
    );

    return groupedSchools.filter(
        (group) => group.count === highestCount,
    );
}

/**
 * Finds all neighborhoods without schools.
 */
export function findNeighborhoodsWithoutSchools(schools: GeographicPoint[], neighborhoods: Neighborhood[],) {
    return groupPointsByNeighborhood(
        schools,
        neighborhoods,
    ).filter((group) => group.count === 0);
}
