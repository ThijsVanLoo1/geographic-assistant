# Alternative Geographic Information Access – Proof of Concept

## About

This project explores a **geographic assistant as an alternative interaction method for map viewers**, developed as a proof of concept within the context of digital accessibility research at Delta10.

The goal is to investigate whether a question-driven interface can help users independently discover and understand geographic information that may be difficult to access through conventional map and list interfaces.

## Purpose

The assistant is designed as an optional, complementary feature to existing map viewers, such as Delta10 Atlas. It does not replace the map or its existing functionality, but provides an additional way to access and explore geographic information.

Instead of navigating a map or manually filtering lists, users can ask geographic questions and receive structured, understandable answers.

The central research question is:

> Can a user discover something with the assistant that would otherwise be impossible, or considerably more difficult, to discover using the existing map and list?

## Scope

This PoC focuses on exploring the concept and its potential value, rather than developing a production-ready Atlas integration.

Two approaches will be explored within the same interface:

1. **Predefined questions:** A set of questions and corresponding geographic queries configured in advance by a functional administrator.
2. **AI-assisted questions:** Users can ask questions in natural language. An AI model interprets the question and translates it into a structured geographic query.

Both approaches use the same dataset, interface and geographic query engine. The AI is responsible for interpreting the user's question, not for calculating or inventing geographic results. The application executes the resulting query against the available data.

The assistant focuses on:
- Finding geographic objects through questions.
- Describing spatial relationships between objects.
- Comparing geographic objects and their surroundings.
- Presenting results in an accessible, structured interface.
- Supporting keyboard and screen reader interaction.

The interface is designed as a compact, optional panel alongside a map viewer. The map itself is represented by a static mock-up in this PoC; direct integration with Atlas and dynamic map interactions are outside the current scope.

The initial implementation uses a limited, fictional geographic dataset inspired by Utrecht. This allows the concept and its interactions to be demonstrated without relying on actual geographic data.

## Tech Stack

- React
- Vite
- TypeScript
- pnpm
- Tailwind CSS 4
- shadcn/ui
- Lucide React
- Vitest
- axe-core

## Status

This project is an experimental proof of concept. Its purpose is to explore the feasibility and potential accessibility value of a geographic assistant as an additional interaction method for map viewers.

The focus is on demonstrating and comparing the two approaches, evaluating their usefulness and exploring how question-driven access to geographic information could complement existing map interfaces.
