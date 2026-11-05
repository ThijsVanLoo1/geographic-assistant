import type { Neighborhood } from "../types/geographic";

export const neighborhoods: Neighborhood[] = [
    {
        id: "neighborhood-1",
        name: "Noord",
        coordinates: [
            [5.110, 52.095],
            [5.130, 52.095],
            [5.130, 52.112],
            [5.110, 52.112],
            [5.110, 52.095],
        ],
    },
    {
        id: "neighborhood-2",
        name: "Centrum",
        coordinates: [
            [5.110, 52.082],
            [5.130, 52.082],
            [5.130, 52.095],
            [5.110, 52.095],
            [5.110, 52.082],
        ],
    },
    {
        id: "neighborhood-3",
        name: "Oost",
        coordinates: [
            [5.130, 52.082],
            [5.150, 52.082],
            [5.150, 52.112],
            [5.130, 52.112],
            [5.130, 52.082],
        ],
    },
    {
        id: "neighborhood-4",
        name: "West",
        coordinates: [
            [5.090, 52.082],
            [5.110, 52.082],
            [5.110, 52.112],
            [5.090, 52.112],
            [5.090, 52.082],
        ],
    },
];