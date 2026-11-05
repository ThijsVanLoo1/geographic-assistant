import { schools } from "../data/schools";
import { parks } from "../data/parks";
import { neighborhoods } from "../data/neighborhoods";
import { referenceLocation } from "../data/reference-location";
import type { GeographicPoint } from "../types/geographic";
import type { GeographicQuery } from "../types/geographic-query";
import {calculateDistance, findPointsWithinDistance, groupPointsByNeighborhood,} from "./geographic-queries";

function getDataSource(source: "schools" | "parks") {
    return source === "schools" ? schools : parks;
}

export function executeQuery(
    query: GeographicQuery,
    selectedSchoolId?: string,
) {
    switch (query.operation) {
        case "within-distance": {
            const source = getDataSource(query.source);

            return findPointsWithinDistance(
                source,
                referenceLocation,
                query.radius,
            );
        }

        case "closest-pair": {
            const source = getDataSource(query.source);
            const target = getDataSource(query.target);

            if (source.length === 0 || target.length === 0) {
                return null;
            }

            let closestPair: {
                source: GeographicPoint;
                target: GeographicPoint;
                distanceMeters: number;
            } | null = null;

            for (const sourcePoint of source) {
                for (const targetPoint of target) {
                    const distanceMeters = calculateDistance(
                        sourcePoint,
                        targetPoint,
                    );

                    if (
                        closestPair === null ||
                        distanceMeters < closestPair.distanceMeters
                    ) {
                        closestPair = {
                            source: sourcePoint,
                            target: targetPoint,
                            distanceMeters,
                        };
                    }
                }
            }

            return closestPair;
        }

        case "same-area": {
            if (!selectedSchoolId) {
                return null;
            }

            const selectedSchool = schools.find(
                (school) => school.id === selectedSchoolId,
            );

            if (!selectedSchool) {
                return null;
            }

            const groups = groupPointsByNeighborhood(
                schools,
                neighborhoods,
            );

            return (
                groups.find((group) =>
                    group.points.some(
                        (school) => school.id === selectedSchoolId,
                    ),
                ) ?? null
            );
        }

        case "farthest-from-nearest": {
            const source = getDataSource(query.source);
            const target = getDataSource(query.target);

            if (source.length === 0 || target.length === 0) {
                return null;
            }

            let farthestResult: {
                source: GeographicPoint;
                nearestTarget: GeographicPoint;
                distanceMeters: number;
            } | null = null;

            for (const sourcePoint of source) {
                let nearestTarget: GeographicPoint | null = null;
                let nearestDistance = Infinity;

                for (const targetPoint of target) {
                    const distanceMeters = calculateDistance(
                        sourcePoint,
                        targetPoint,
                    );

                    if (distanceMeters < nearestDistance) {
                        nearestDistance = distanceMeters;
                        nearestTarget = targetPoint;
                    }
                }

                if (
                    nearestTarget &&
                    (farthestResult === null ||
                        nearestDistance > farthestResult.distanceMeters)
                ) {
                    farthestResult = {
                        source: sourcePoint,
                        nearestTarget,
                        distanceMeters: nearestDistance,
                    };
                }
            }

            return farthestResult;
        }

        case "group-and-count": {
            const source = getDataSource(query.source);

            let results = groupPointsByNeighborhood(
                source,
                neighborhoods,
            );

            if (query.filter) {
                results = results.filter(
                    (group) => group.count === query.filter?.count,
                );
            }

            if (query.sort) {
                results.sort((a, b) =>
                    query.sort === "ascending"
                        ? a.count - b.count
                        : b.count - a.count,
                );
            }

            if (query.limit !== undefined) {
                results = results.slice(0, query.limit);
            }

            return results;
        }
    }
}
