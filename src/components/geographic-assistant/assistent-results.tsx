import type {GeographicPoint, Neighborhood,} from "../../types/geographic";
import type { GeographicQuery } from "../../types/geographic-query";

type AssistantResultsProps = {
    operation: GeographicQuery["operation"];
    data: unknown;
};

type DistanceResult = {
    point: GeographicPoint;
    distanceMeters: number;
};

type PairResult = {
    source: GeographicPoint;
    target: GeographicPoint;
    distanceMeters: number;
};

type FarthestResult = {
    source: GeographicPoint;
    nearestTarget: GeographicPoint;
    distanceMeters: number;
};

type NeighborhoodResult = {
    neighborhood: Neighborhood;
    points: GeographicPoint[];
    count: number;
};

function formatDistance(distance: number): string {
    if (distance < 1000) {
        return `${Math.round(distance)} meter`;
    }

    return `${new Intl.NumberFormat("nl-NL", {
        maximumFractionDigits: 1,
    }).format(distance / 1000)} kilometer`;
}

function ResultCard({title, children,}: { title: string; children: React.ReactNode; }) {
    return (
        <li className="rounded-md border bg-background p-3">
            <h4 className="font-medium text-foreground">{title}</h4>
            <div className="mt-1 text-sm text-muted-foreground">
                {children}
            </div>
        </li>
    );
}

function EmptyResult({ message }: { message: string }) {
    return (
        <p className="rounded-md border bg-muted p-3 text-sm text-foreground">
            {message}
        </p>
    );
}

function DistanceResultList({results,}: { results: DistanceResult[]; }) {
    if (results.length === 0) {
        return (
            <EmptyResult message="Er zijn geen basisscholen binnen deze afstand gevonden." />
        );
    }

    return (
        <ol className="space-y-2">
            {results.map(({ point, distanceMeters }) => (
                <ResultCard key={point.id} title={point.name}>
                    <p>{formatDistance(distanceMeters)} vanaf de referentielocatie.</p>
                </ResultCard>
            ))}
        </ol>
    );
}

function PairResultCard({ result }: { result: PairResult }) {
    return (
        <div className="space-y-3">
            <ResultCard title={result.source.name}>
                <p>
                    Dit is de school die het dichtst bij een park ligt.
                </p>
            </ResultCard>

            <div className="rounded-md border bg-muted p-3">
                <h4 className="text-sm font-medium text-foreground">
                    Dichtstbijzijnde park
                </h4>
                <p className="mt-1 text-sm text-foreground">
                    {result.target.name}
                </p>
                <p className="mt-2 text-sm font-semibold text-foreground">
                    {formatDistance(result.distanceMeters)}
                </p>
                <p className="text-xs text-muted-foreground">
                    Afstand tussen de school en het park.
                </p>
            </div>
        </div>
    );
}

function SameAreaResult({result,}: { result: NeighborhoodResult; }) {
    return (
        <div className="space-y-3">
            <p className="text-sm">
                De geselecteerde school ligt in wijk{" "}
                <strong>{result.neighborhood.name}</strong>.
            </p>

            <h4 className="text-sm font-medium">
                Scholen in deze wijk ({result.count})
            </h4>

            <ol className="space-y-2">
                {result.points.map((point) => (
                    <ResultCard key={point.id} title={point.name}>
                        Basisschool in wijk {result.neighborhood.name}.
                    </ResultCard>
                ))}
            </ol>
        </div>
    );
}

function FarthestResultCard({result,}: { result: FarthestResult; }) {
    return (
        <div className="space-y-3">
            <ResultCard title={result.source.name}>
                <p>
                    Deze school ligt het verst van een park, wanneer we
                    per school het dichtstbijzijnde park vergelijken.
                </p>
            </ResultCard>

            <div className="rounded-md border bg-muted p-3">
                <h4 className="text-sm font-medium text-foreground">
                    Dichtstbijzijnde park
                </h4>
                <p className="mt-1 text-sm text-foreground">
                    {result.nearestTarget.name}
                </p>
                <p className="mt-2 text-sm font-semibold text-foreground">
                    {formatDistance(result.distanceMeters)}
                </p>
                <p className="text-xs text-muted-foreground">
                    Afstand tussen de school en het dichtstbijzijnde park.
                </p>
            </div>
        </div>
    );
}

function NeighborhoodResultList({results,}: { results: NeighborhoodResult[]; }) {
    if (results.length === 0) {
        return (
            <EmptyResult message="Er zijn geen wijken gevonden die aan deze vraag voldoen." />
        );
    }

    return (
        <ol className="space-y-2">
            {results.map(({ neighborhood, count, points }) => (
                <ResultCard
                    key={neighborhood.id}
                    title={neighborhood.name}
                >
                    <p>
                        {count} basisschool{count === 1 ? "" : "en"}
                    </p>

                    {count > 0 && (
                        <ul className="mt-2 list-inside list-disc space-y-1">
                            {points.map((point) => (
                                <li key={point.id}>{point.name}</li>
                            ))}
                        </ul>
                    )}
                </ResultCard>
            ))}
        </ol>
    );
}

export default function AssistantResults({operation, data,}: AssistantResultsProps) {
    switch (operation) {
        case "within-distance":
            return (
                <DistanceResultList
                    results={data as DistanceResult[]}
                />
            );

        case "closest-pair":
            return (
                <PairResultCard result={data as PairResult} />
            );

        case "same-area":
            return (
                <SameAreaResult result={data as NeighborhoodResult} />
            );

        case "farthest-from-nearest":
            return (
                <FarthestResultCard result={data as FarthestResult} />
            );

        case "group-and-count":
            return (
                <NeighborhoodResultList
                    results={data as NeighborhoodResult[]}
                />
            );
    }
}
