import { SlidersHorizontal, List, Plus, Minus } from "lucide-react";
import MapViewerMockImage from "../../assets/map-viewer-mock.png";

export default function MapViewerMock() {
    return (
        <section className="relative flex min-h-125 flex-1 overflow-hidden rounded-lg border bg-muted">

            {/* Map controls - top left */}
            <div className="absolute left-4 top-4 z-10 flex gap-2">
                <button
                    type="button"
                    disabled
                    className="flex items-center gap-2 rounded-md border bg-background px-3 py-2 opacity-60"
                >
                    <SlidersHorizontal size={18} />
                    <span>Verfijn</span>
                </button>

                <button
                    type="button"
                    disabled
                    className="flex items-center gap-2 rounded-md border bg-background px-3 py-2 opacity-60"
                >
                    <List size={18} />
                    <span>Lijst</span>
                </button>
            </div>

            {/* Map controls - bottom right */}
            <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-2">
                <button
                    type="button"
                    aria-label="Inzoomen (niet beschikbaar in prototype)"
                    disabled
                    className="rounded-md border bg-background p-2 opacity-60"
                >
                    <Plus size={20} />
                </button>

                <button
                    type="button"
                    aria-label="Uitzoomen (niet beschikbaar in prototype)"
                    disabled
                    className="rounded-md border bg-background p-2 opacity-60"
                >
                    <Minus size={20} />
                </button>
            </div>

            {/* Map image */}
            <img
                src={MapViewerMockImage}
                alt="Schematische kaart met verschillende basisschoollocaties"
                className="absolute inset-0 h-full w-full object-cover"
            />
        </section>
    );
}
