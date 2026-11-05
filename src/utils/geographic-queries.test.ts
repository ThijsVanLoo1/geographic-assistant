import { describe, expect, it } from "vitest";
import {
    calculateDistance,
    findPointsWithinDistance,
    isPointInPolygon,
    groupPointsByNeighborhood,
} from "./geographic-queries";
import { schools } from "../data/schools";
import { neighborhoods } from "../data/neighborhoods";
import { referenceLocation } from "../data/reference-location";
import type { GeographicPoint, Neighborhood } from "../types/geographic";

describe("calculateDistance", () => {
    it("calculates the distance between two points in meters", () => {
        const pointA: GeographicPoint = {
            id: "a",
            name: "Point A",
            latitude: 52.0,
            longitude: 5.0,
        };

        const pointB: GeographicPoint = {
            id: "b",
            name: "Point B",
            latitude: 52.001,
            longitude: 5.0,
        };

        const distance = calculateDistance(pointA, pointB);

        expect(distance).toBeGreaterThan(110);
        expect(distance).toBeLessThan(112);
    });

    it("returns zero for identical points", () => {
        const point: GeographicPoint = {
            id: "a",
            name: "Same point",
            latitude: 52.0,
            longitude: 5.0,
        };

        expect(calculateDistance(point, point)).toBe(0);
    });
});

describe("findPointsWithinDistance", () => {
    it("only returns points within the requested radius", () => {
        const results = findPointsWithinDistance(
            schools,
            referenceLocation,
            500,
        );

        expect(results.length).toBeGreaterThan(0);

        for (const result of results) {
            expect(result.distanceMeters).toBeLessThanOrEqual(500);
        }
    });

    it("sorts results by distance, nearest first", () => {
        const results = findPointsWithinDistance(
            schools,
            referenceLocation,
            5000,
        );

        const distances = results.map((result) => result.distanceMeters);

        expect(distances).toEqual([...distances].sort((a, b) => a - b));
    });

    it("returns an empty array when no points are within the radius", () => {
        const results = findPointsWithinDistance(
            schools,
            referenceLocation,
            1,
        );

        expect(results).toEqual([]);
    });

    it("rejects a negative radius", () => {
        expect(() =>
            findPointsWithinDistance(schools, referenceLocation, -100),
        ).toThrow("Radius must be a non-negative number.");
    });
});

describe("isPointInPolygon", () => {
    const testNeighborhood: Neighborhood = {
        id: "test-neighborhood",
        name: "Test neighborhood",
        coordinates: [
            [5.0, 52.0],
            [5.1, 52.0],
            [5.1, 52.1],
            [5.0, 52.1],
            [5.0, 52.0],
        ],
    };

    it("returns true for a point inside a polygon", () => {
        const point: GeographicPoint = {
            id: "inside",
            name: "Inside",
            latitude: 52.05,
            longitude: 5.05,
        };

        expect(isPointInPolygon(point, testNeighborhood)).toBe(true);
    });

    it("returns false for a point outside a polygon", () => {
        const point: GeographicPoint = {
            id: "outside",
            name: "Outside",
            latitude: 52.2,
            longitude: 5.2,
        };

        expect(isPointInPolygon(point, testNeighborhood)).toBe(false);
    });

    it("returns true for a point on the polygon boundary", () => {
        const point: GeographicPoint = {
            id: "boundary",
            name: "Boundary",
            latitude: 52.0,
            longitude: 5.05,
        };

        expect(isPointInPolygon(point, testNeighborhood)).toBe(true);
    });

    it("returns false for a polygon with fewer than three coordinates", () => {
        const invalidPolygon: Neighborhood = {
            id: "invalid",
            name: "Invalid",
            coordinates: [
                [5.0, 52.0],
                [5.1, 52.0],
            ],
        };

        const point: GeographicPoint = {
            id: "test",
            name: "Test",
            latitude: 52.05,
            longitude: 5.05,
        };

        expect(isPointInPolygon(point, invalidPolygon)).toBe(false);
    });
});

describe("groupPointsByNeighborhood", () => {
    it("groups schools by neighborhood", () => {
        const results = groupPointsByNeighborhood(
            schools,
            neighborhoods,
        );

        const totalGroupedSchools = results.reduce(
            (total, result) => total + result.count,
            0,
        );

        expect(totalGroupedSchools).toBe(schools.length);
    });

    it("includes neighborhoods without schools", () => {
        const results = groupPointsByNeighborhood(
            schools,
            neighborhoods,
        );

        expect(results.some((result) => result.count === 0)).toBe(true);
    });

    it("returns the same points in the grouped results", () => {
        const results = groupPointsByNeighborhood(
            schools,
            neighborhoods,
        );

        const groupedSchoolIds = results.flatMap((result) =>
            result.points.map((school) => school.id),
        );

        expect(groupedSchoolIds).toEqual(
            expect.arrayContaining(schools.map((school) => school.id)),
        );
    });
});
