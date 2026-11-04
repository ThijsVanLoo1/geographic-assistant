# Alternative Geographic Information Access – Proof of Concept

## About

This project explores a **geographic assistant as an alternative interaction method for map viewers**, developed as a proof of concept (PoC) within the context of digital accessibility research at Delta10.

The goal is to investigate whether a question-driven interface can help users independently find, understand and interpret geographic information that may be difficult to access through conventional map and list interfaces.

## Purpose

The assistant is intended as a complementary feature to existing map viewers, such as Delta10 Atlas. Rather than replacing the map or its existing functionality, it provides an additional way to interact with geographic data through natural-language questions and structured responses.

The central research question is:

> Can a user discover something with the assistant that would otherwise be impossible, or considerably more difficult, to discover using the existing map and list?

## Scope

This PoC focuses on exploring the concept and its potential value, rather than developing a production-ready Atlas integration.

The initial implementation will explore:

- Finding geographic objects through questions.
- Describing spatial relationships between objects.
- Explaining why objects match certain geographic criteria.
- Presenting results in an accessible, structured interface.
- Supporting keyboard and screen reader interaction.

The initial implementation will use predefined queries and a limited dataset. AI integration and direct Atlas integration are considered potential future developments, not requirements for this PoC.

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

This project is an experimental proof of concept. Its purpose is to validate the feasibility and accessibility value of a geographic assistant and explore how such an interaction could complement existing map viewers.
