import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { ArrowLeft, ChevronRight, MapPinned, Send, Sparkles, X } from "lucide-react";
import { processQuestion, type AssistantResponse } from "../../utils/process-question";
import { predefinedQuestions } from "../../data/predefined-questions";
import AssistantResults from "../geographic-assistant/assistent-results";

type GeographicAssistantProps = {
    onClose: () => void;
};

type QuestionOrigin =
    | { kind: "predefined"; id: string }
    | { kind: "input" }
    | null;

export default function GeographicAssistant({ onClose }: GeographicAssistantProps) {
    const [question, setQuestion] = useState("");
    const [response, setResponse] = useState<AssistantResponse | null>(null);
    const [viewDirection, setViewDirection] = useState<"forward" | "back">("forward");

    const panelRef = useRef<HTMLElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const resultHeadingRef = useRef<HTMLHeadingElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const questionButtonsRef = useRef(new Map<string, HTMLButtonElement>());
    const originRef = useRef<QuestionOrigin>(null);
    const hasNavigatedRef = useRef(false);
    const backButtonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (!hasNavigatedRef.current) return;

        if (response) {
            backButtonRef.current?.focus();
            return;
        }

        // Bestaande logica voor terugnavigatie
    }, [response]);

    // Enter the panel at its title, so the purpose is announced before the controls.
    // Return to the element that opened it when the panel unmounts.
    useEffect(() => {
        const previouslyFocused = document.activeElement;
        titleRef.current?.focus();

        return () => {
            if (previouslyFocused instanceof HTMLElement && previouslyFocused.isConnected) {
                previouslyFocused.focus();
            }
        };
    }, []);

    useEffect(() => {
        if (!hasNavigatedRef.current) return;

        if (response) {
            backButtonRef.current?.focus();
            return;
        }

        const origin = originRef.current;
        if (origin?.kind === "predefined") {
            const button = questionButtonsRef.current.get(origin.id);
            if (button) {
                button.focus();
                return;
            }
        }

        inputRef.current?.focus();
    }, [response]);

    // Escape closes the assistant only while focus is inside this panel.
    useEffect(() => {
        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape" && panelRef.current?.contains(document.activeElement)) {
                event.preventDefault();
                onClose();
            }
        }

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onClose]);

    function handleQuestion(selectedQuestion: string, id: string) {
        originRef.current = { kind: "predefined", id };
        hasNavigatedRef.current = true;
        setViewDirection("forward");
        setQuestion(selectedQuestion);
        setResponse(processQuestion(selectedQuestion));
    }

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!question.trim()) return;

        originRef.current = { kind: "input" };
        hasNavigatedRef.current = true;
        setViewDirection("forward");
        setResponse(processQuestion(question));
    }

    function handleBack() {
        setViewDirection("back");
        setResponse(null);
        setQuestion("");
        // Focus is restored by the response effect after the question screen mounts.
    }

    return (
        <aside
            ref={panelRef}
            id="geographic-assistant-panel"
            aria-labelledby="assistant-title"
            className="flex w-full shrink-0 flex-col rounded-lg border bg-background shadow-sm md:w-100"
        >
            <header className="flex items-center justify-between border-b p-4">
                <div className="flex items-center gap-2">
                    <MapPinned size={20} aria-hidden="true" className="text-foreground" />
                    <h2
                        ref={titleRef}
                        id="assistant-title"
                        tabIndex={-1}
                        className="font-semibold focus:outline-none"
                    >
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

            <div className="flex min-h-0 flex-1 flex-col overflow-y-auto p-4">
                {!response ? (
                    <div
                        key="question-list"
                        className={`space-y-6 view-enter-${viewDirection === "forward" ? "back" : "forward"}`}
                    >
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Sparkles size={18} aria-hidden="true" />
                                <h3 className="font-medium">Stel een geografische vraag</h3>
                            </div>
                            <p className="text-sm leading-relaxed text-muted-foreground">
                                Zoek geografische informatie en ontdek verbanden tussen locaties.
                                Kies een voorbeeldvraag of stel zelf een vraag.
                            </p>
                        </div>

                        <section aria-labelledby="suggested-questions-title" className="space-y-3">
                            <h4 id="suggested-questions-title" className="text-sm font-semibold">
                                Beschikbare vragen
                            </h4>
                            <ul className="space-y-2">
                                {predefinedQuestions.map((item) => (
                                    <li key={item.id}>
                                        <button
                                            ref={(element) => {
                                                const id = String(item.id);
                                                if (element) questionButtonsRef.current.set(id, element);
                                                else questionButtonsRef.current.delete(id);
                                            }}
                                            type="button"
                                            onClick={() => handleQuestion(item.label, String(item.id))}
                                            className="flex min-h-12 w-full items-center justify-between gap-3 rounded-md border bg-background p-3 text-left text-sm text-foreground transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2"
                                        >
                                            <span>{item.label}</span>
                                            <ChevronRight size={18} aria-hidden="true" className="shrink-0 text-muted-foreground" />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    </div>
                ) : (
                    <div key="results" className={`space-y-5 view-enter-${viewDirection}`}>
                        <button
                            ref={backButtonRef}
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

            <form onSubmit={handleSubmit} className="border-t p-4">
                <label htmlFor="assistant-question" className="mb-2 block text-sm font-medium">
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
