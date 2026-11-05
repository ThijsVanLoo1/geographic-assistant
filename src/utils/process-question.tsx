import { predefinedQuestions } from "../data/predefined-questions";
import { executeQuery } from "./execute-query";
import type { PredefinedQuestion } from "../types/geographic-query";

export type AssistantResponse =
    | {
    kind: "result";
    operation: PredefinedQuestion["query"]["operation"];
    title: string;
    description: string;
    data: unknown;
}
    | {
    kind: "message";
    title: string;
    description: string;
};

export function processQuestion(question: string, selectedSchoolId?: string,): AssistantResponse {
    const normalizedQuestion = question.toLowerCase().trim();

    const matchedQuestion = findMatchingQuestion(normalizedQuestion);

    if (!matchedQuestion) {
        return {
            kind: "message",
            title: "Vraag niet herkend",
            description:
                "Probeer een van de beschikbare geografische vragen.",
        };
    }

    const data = executeQuery(
        matchedQuestion.query,
        selectedSchoolId,
    );

    if (data === null) {
        return {
            kind: "message",
            title: "Vraag kon niet worden beantwoord",
            description:
                "Er ontbreken gegevens om deze geografische vraag te beantwoorden.",
        };
    }

    return {
        kind: "result",
        operation: matchedQuestion.query.operation,
        title: matchedQuestion.label,
        description: "Hieronder vind je de geografische resultaten.",
        data,
    };
}

function findMatchingQuestion(normalizedQuestion: string,): PredefinedQuestion | undefined {
    return predefinedQuestions.find((item) =>
        item.label.toLowerCase().trim() === normalizedQuestion,
    );
}
