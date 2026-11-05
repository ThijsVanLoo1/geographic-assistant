import type {PredefinedQuestion} from "../types/geographic-query.ts";

export const predefinedQuestions: PredefinedQuestion[] = [
    {
        id: "schools-near-location",
        label: "Welke scholen liggen binnen 500 meter van mijn locatie?",
        query: {
            operation: "within-distance",
            source: "schools",
            reference: "reference-location",
            radius: 500,
        },
    },
    {
        id: "school-closest-to-park",
        label: "Welke school ligt het dichtst bij een park?",
        query: {
            operation: "closest-pair",
            source: "schools",
            target: "parks",
        },
    },
    {
        id: "schools-in-same-neighborhood",
        label: "Welke scholen liggen in dezelfde wijk als een geselecteerde school?",
        query: {
            operation: "same-area",
            source: "schools",
            area: "neighborhoods",
            reference: "selected-school",
        },
    },
    {
        id: "school-farthest-from-park",
        label: "Welke school ligt het verst van een park?",
        query: {
            operation: "farthest-from-nearest",
            source: "schools",
            target: "parks",
        },
    },
    {
        id: "neighborhood-most-schools",
        label: "Welke wijk heeft de meeste basisscholen?",
        query: {
            operation: "group-and-count",
            source: "schools",
            area: "neighborhoods",
            sort: "descending",
            limit: 1,
        },
    },
    {
        id: "neighborhoods-without-schools",
        label: "Zijn er wijken zonder basisschool?",
        query: {
            operation: "group-and-count",
            source: "schools",
            area: "neighborhoods",
            filter: {
                count: 0,
            },
        },
    },
];
