import { useState } from "react";
import { PanelRightOpen } from "lucide-react";
import MapViewerMock from "./components/map-viewer-mock/map-viewer-mock.tsx";
import GeographicAssistant from "./components/geographic-assistant/geographic-assistant.tsx";

function App() {
    const [isAssistantOpen, setIsAssistantOpen] = useState(false);
    const [shouldRenderAssistant, setShouldRenderAssistant] = useState(false);

    function openAssistant() {
        setShouldRenderAssistant(true);
        setIsAssistantOpen(true);
    }

    function closeAssistant() {
        setIsAssistantOpen(false);

        setTimeout(() => {
            setShouldRenderAssistant(false);
        }, 400);
    }

    return (
        <main className="min-h-screen bg-background p-6">
            <header className="mb-6 flex items-center justify-between">
                <p className="text-sm font-bold">
                    Geographic Assistant - Proof of Concept
                </p>

                <button
                    type="button"
                    onClick={openAssistant}
                    aria-expanded={isAssistantOpen}
                    aria-controls="geographic-assistant-panel"
                    className="flex items-center gap-2 rounded-md border bg-background px-3 py-2 text-sm font-medium hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                    <PanelRightOpen size={18} aria-hidden="true" />
                    Geografische assistent
                </button>
            </header>

            <div className="flex min-h-150 flex-col gap-4 md:flex-row">
                <MapViewerMock />

                {shouldRenderAssistant && (
                    <div className={isAssistantOpen ? "assistant-enter" : "assistant-exit"}>
                        <GeographicAssistant onClose={closeAssistant} />
                    </div>
                )}
            </div>
        </main>
    );
}

export default App;
