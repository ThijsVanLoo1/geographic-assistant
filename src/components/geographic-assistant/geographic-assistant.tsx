import { useEffect, useRef, useState } from "react";
import {ArrowLeft, ChevronRight, MapPinned, Send, Sparkles, X,} from "lucide-react";
import type { FormEvent } from "react";
import {processQuestion, type AssistantResponse,} from "../../utils/process-question";
import { predefinedQuestions } from "../../data/predefined-questions";
import AssistantResults from "../geographic-assistant/assistent-results";

type GeographicAssistantProps = {
    onClose: () => void;
};

export default function GeographicAssistant({onClose}: GeographicAssistantProps) {
    const [question, setQuestion] = useState("");
    const [response, setResponse] = useState<AssistantResponse | null>(null);
    const [viewDirection, setViewDirection] = useState<"forward" | "back">("forward");

    const inputRef = useRef<HTMLInputElement>(null);

    // Focus the input when the panel opens.
    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    // Allow the user to close the panel with Escape.
    useEffect(() => {
        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") {
                onClose();
            }
        }

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [onClose]);

    function handleQuestion(selectedQuestion: string) {
        setViewDirection("forward");
        setQuestion(selectedQuestion);
        setResponse(processQuestion(selectedQuestion));
    }

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!question.trim()) return;

        setResponse(processQuestion(question));
    }

    function handleBack() {
        setViewDirection("back");
        setResponse(null);
        setQuestion("");
        inputRef.current?.focus();
    }

    return (
        <aside
            id="geographic-assistant-panel"
            aria-labelledby="assistant-title"
            className="flex w-full shrink-0 flex-col rounded-lg border bg-background shadow-sm md:w-[400px]"
        >
            {/* Header */}
            <header className="flex items-center justify-between border-b p-4">
                <div className="flex items-center gap-2">
                    <MapPinned
                        size={20}
                        aria-hidden="true"
                        className="text-foreground"
                    />

                    <h2 id="assistant-title" className="font-semibold">
                        Geografische assistent
                    </h2>
                </div>

                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Geografische assistent sluiten"
                    className="rounded-md p-2 text-foreground hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                    <X size={20} aria-hidden="true" />
                </button>
            </header>

            {/* Main content */}
            <div className="flex min-h-0 flex-1 flex-col overflow-y-auto p-4">

                {!response ? (
                    <div
                        key="question-list"
                        className={`space-y-6 view-enter-${viewDirection === "forward" ? "back" : "forward"}`}
                    >
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Sparkles size={18} aria-hidden="true" />

                                <h3 className="font-medium">
                                    Stel een geografische vraag
                                </h3>
                            </div>

                            <p className="text-sm leading-relaxed text-muted-foreground">
                                Zoek geografische informatie en ontdek verbanden
                                tussen locaties. Kies een voorbeeldvraag of stel
                                zelf een vraag.
                            </p>
                        </div>

                        <section
                            aria-labelledby="suggested-questions-title"
                            className="space-y-3"
                        >
                            <h4
                                id="suggested-questions-title"
                                className="text-sm font-semibold"
                            >
                                Beschikbare vragen
                            </h4>

                            <ul className="space-y-2">
                                {predefinedQuestions.map((item) => (
                                    <li key={item.id}>
                                        <button
                                            type="button"
                                            onClick={() => handleQuestion(item.label)}
                                            className="flex min-h-12 w-full items-center justify-between gap-3 rounded-md border bg-background p-3 text-left text-sm text-foreground transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2"
                                        >
                                            <span>{item.label}</span>

                                            <ChevronRight
                                                size={18}
                                                aria-hidden="true"
                                                className="shrink-0 text-muted-foreground"
                                            />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    </div>
                ) : (
                    <div key="results" className={`space-y-5 view-enter-${viewDirection}`}>
                        <button
                            type="button"
                            onClick={handleBack}
                            className="inline-flex min-h-10 items-center gap-2 rounded-md text-sm font-medium text-foreground hover:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-2"
                        >
                            <ArrowLeft size={18} aria-hidden="true" />
                            Terug naar vragen
                        </button>

                        <div className="space-y-2">
                            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                Je vraag
                            </p>

                            <h3 className="text-base font-semibold leading-relaxed">
                                {response.title}
                            </h3>
                        </div>

                        <div className="border-t pt-4">
                            <h4 className="mb-2 text-sm font-semibold">
                                Resultaat
                            </h4>

                            <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                                {response.description}
                            </p>

                            {response.kind === "result" && (
                                <AssistantResults
                                    operation={response.operation}
                                    data={response.data}
                                />
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Screen reader announcement */}
            <div role="status" aria-live="polite" className="sr-only">
                {response
                    ? `Antwoord beschikbaar: ${response.title}.`
                    : ""}
            </div>

            {/* Question input */}
            <form onSubmit={handleSubmit} className="border-t p-4">
                <label
                    htmlFor="assistant-question"
                    className="mb-2 block text-sm font-medium"
                >
                    Of stel zelf een vraag
                </label>

                <div className="flex gap-2">
                    <input
                        ref={inputRef}
                        id="assistant-question"
                        type="text"
                        value={question}
                        onChange={(event) => setQuestion(event.target.value)}
                        placeholder="Bijvoorbeeld: welke school..."
                        className="min-w-0 flex-1 rounded-md border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-2"
                    />

                    <button
                        type="submit"
                        disabled={!question.trim()}
                        aria-label="Vraag versturen"
                        className="flex min-h-10 min-w-10 items-center justify-center rounded-md bg-primary p-2 text-primary-foreground hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        <Send size={18} aria-hidden="true" />
                    </button>
                </div>
            </form>
        </aside>
    );
}
