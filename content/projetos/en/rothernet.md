---
title: "Rothernet"
summary: "A virtual restaurant with an AI agent that serves customers by voice, in Portuguese."
---

## Description

Rothernet is a virtual restaurant with voice service. The customer talks to an AI assistant that understands the order, answers questions and replies with audio, in Portuguese.

## Goal and scope

The customer records audio in the Unity front end. Whisper transcribes the speech and the system captures the customer's details and the order.

The AI answers based on documents describing the restaurant's menu and rules (a RAG technique, with LangChain, ChromaDB and an OpenAI model). The answer is turned into audio with speech synthesis and sent back through the FastAPI back end, over WebSockets.

Each customer has a User ID that gives access to their conversation and order history, stored in the database with SQLAlchemy.

## Results and lessons learned

The project runs in the cloud, on Railway.
