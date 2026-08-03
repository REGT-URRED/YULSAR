# Brave Assistant

Asistente de IA para Brave (Chrome/Edge también). Basado en [Nanobrowser](https://github.com/nanobrowser/nanobrowser) (Apache-2.0).

## Instalación en Brave

1. Abre `brave://extensions/`
2. Activa **Modo desarrollador** (esquina superior derecha)
3. Click en **Cargar descomprimida**
4. Selecciona la carpeta `dist/` de este proyecto

## Configuración de modelos

1. Click en el ícono de la extensión en la barra de herramientas → se abre el panel
2. Click en el ícono de ⚙️ (Settings, arriba a la derecha)
3. Agrega tus API keys:

| Proveedor | API Key (variable) | Obtener en |
|---|---|---|
| **DeepSeek** | `DEEPSEEK_API_KEY` | [platform.deepseek.com](https://platform.deepseek.com) |
| **Gemini (Google)** | `GOOGLE_API_KEY` | [aistudio.google.com](https://aistudio.google.com) |
| **OpenAI** | `OPENAI_API_KEY` | [platform.openai.com](https://platform.openai.com) |
| **Custom (OpenAI-compatible)** | URL + Key | Cualquier endpoint compatible |

4. Asigna modelos a cada agente (Planner, Navigator, Validator)

## Uso

- Escribe tareas en lenguaje natural en el chat del panel
- El agente planifica y navega en tiempo real
- El historial de conversación se mantiene

## Build desde código

```bash
pnpm install
pnpm build
# La extensión compilada está en dist/
```

## Créditos

Construido sobre [Nanobrowser](https://github.com/nanobrowser/nanobrowser) (Apache License 2.0).
