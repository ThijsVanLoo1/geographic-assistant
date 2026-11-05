export type GeographicPointSource = "schools" | "parks";

export type GeographicQuery =
    | {
    operation: "within-distance";
    source: GeographicPointSource;
    reference: "reference-location";
    radius: number;
}
    | {
    operation: "closest-pair";
    source: GeographicPointSource;
    target: GeographicPointSource;
}
    | {
    operation: "same-area";
    source: "schools";
    area: "neighborhoods";
    reference: "selected-school";
}
    | {
    operation: "farthest-from-nearest";
    source: GeographicPointSource;
    target: GeographicPointSource;
}
    | {
    operation: "group-and-count";
    source: GeographicPointSource;
    area: "neighborhoods";
    sort?: "ascending" | "descending";
    limit?: number;
    filter?: {
        count: number;
    };
};

export type PredefinedQuestion = {
    id: string;
    label: string;
    query: GeographicQuery;
};
