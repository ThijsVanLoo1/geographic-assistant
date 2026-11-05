export type GeographicPoint = {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
};

export type School = GeographicPoint;

export type Park = GeographicPoint;

export type Neighborhood = {
    id: string;
    name: string;
    coordinates: [number, number][];
};

export type ReferenceLocation = GeographicPoint;