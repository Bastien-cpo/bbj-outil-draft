#!/bin/sh
# Passe de test avant chaque version : moteur (300 drafts aléatoires) puis affichage (drafts complètes, fiches à chaque étape)
cd "$(dirname "$0")/.." && node tests/engine_fuzz.js && python3 tests/ui_scenarios.py
