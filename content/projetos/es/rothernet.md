---
title: "Rothernet"
summary: "Restaurante virtual con un agente de IA que atiende al cliente por voz, en portugués."
---

## Descripción

Rothernet es un restaurante virtual con atención por voz. El cliente conversa con un asistente de IA que entiende el pedido, responde dudas y devuelve la respuesta en audio, en portugués.

## Objetivo y alcance

El cliente graba un audio en el front-end hecho en Unity. Whisper transcribe el habla y el sistema captura los datos del cliente y del pedido.

La IA responde a partir de documentos que describen el menú y las reglas del restaurante (técnica de RAG, con LangChain, ChromaDB y un modelo de OpenAI). La respuesta se convierte en audio mediante síntesis de voz y vuelve por el back-end en FastAPI, vía WebSockets.

Cada cliente tiene un User ID que da acceso al historial de conversaciones y pedidos, guardados en la base de datos con SQLAlchemy.

## Resultados y aprendizajes

El proyecto funciona en la nube, en Railway.
