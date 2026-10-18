---
title: "Rothernet"
summary: "Restaurante virtual com agente de IA que atende o cliente por voz, em português."
area: "Inteligência Artificial"
status: "concluido"
order: 3
tech: [Unity, Python, FastAPI, WebSockets, LangChain, ChromaDB, Whisper, SQLAlchemy, PostgreSQL]
team:
  - "Guilherme Schnekenberg"
  - "Grazielle Batista de Almeida"
  - "Nícolas Okamoto Celestrino"
  - "@Ce-22"
repo: "https://github.com/schnekenberg/puctech_rothernet"
---

## Descrição

O Rothernet é um restaurante virtual com atendimento por voz. O cliente conversa com um assistente de IA, que entende o pedido, responde dúvidas e devolve a resposta em áudio, em português.

## Objetivo e escopo

O cliente grava um áudio no front-end feito em Unity. O Whisper transcreve a fala e o sistema captura os dados do cliente e do pedido.

A IA responde com base em documentos que descrevem o cardápio e as regras do restaurante (técnica de RAG, com LangChain, ChromaDB e um modelo da OpenAI). A resposta vira áudio por síntese de voz e volta pelo back-end em FastAPI, via WebSockets.

Cada cliente tem um User ID, que dá acesso ao histórico de conversa e de pedidos, guardados no banco com SQLAlchemy.

## Resultados e aprendizados

O projeto roda em nuvem, no Railway.