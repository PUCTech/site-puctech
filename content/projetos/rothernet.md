---
title: "Rothernet"
summary: "Restaurante virtual com agente de IA que atende o cliente por voz, em português."
area: "Inteligência Artificial"
status: "concluido"
order: 3
tech: [Unity, Python, FastAPI, WebSockets, LangChain, ChromaDB, OpenAI, Whisper, SQLAlchemy, PostgreSQL, Supabase, Railway]
team:
  - "@schnekenberg"
  - "@GaiaOcean"
  - "@Niikira"
  - "@Ce-22"
repo: "https://github.com/schnekenberg/puctech_rothernet"
---

## Descrição

O Rothernet simula o atendimento de um restaurante com um agente virtual de IA e Realidade Mista. O cliente conversa por voz com o assistente, que entende pedidos, responde perguntas sobre o cardápio e as regras da casa e devolve a resposta em áudio, em português.

É um dos projetos iniciais (First Steps) da PUC Tech.

## Objetivo e escopo

Criar um atendimento automatizado e amigável por voz: a fala do cliente é transcrita (Whisper), a IA responde com base nos documentos do restaurante (RAG com LangChain e ChromaDB), a resposta vira áudio e cada cliente mantém seu histórico de conversa e de pedidos a partir de um User ID.