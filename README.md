# YULSAR

Asistente de navegador con inteligencia artificial. Indica tareas en lenguaje natural y el agente navega, hace clic, rellena formularios y extrae datos en tiempo real, todo dentro de tu navegador.

## Por que YULSAR y no otro asistente

- Corre dentro de Brave (tambien Chrome y Edge). Tus cookies, sesiones y logins quedan intactos. Sin navegador aparte, sin copiar perfiles.
- Usa tus propias API keys. Sin suscripcion, sin nube ajena, sin costos ocultos. DeepSeek, Gemini, OpenAI, Groq, Ollama o cualquier endpoint compatible con OpenAI. Ningun modelo es obligatorio.
- Cuatro roles intercambiables: Planner, Navigator, Vision y Validator. Asignas el modelo que quieras a cada rol. Ejemplo practico: DeepSeek como motor principal de texto, Gemini para analisis de imagenes.
- Codigo abierto (Apache 2.0). Basado en Nanobrowser, adaptado y extendido para Brave con soporte multi-proveedor real, documentacion en espanol y mantenimiento activo.

## Instalacion en Brave

1. Abre `brave://extensions/`
2. Activa **Modo desarrollador** (esquina superior derecha)
3. Click en **Cargar descomprimida**
4. Selecciona la carpeta `dist/` de este proyecto
5. La extension aparece en la barra de herramientas

## Configuracion de modelos

En el panel de la extension, ve a Settings y agrega tus API keys. Todos los proveedores son opcionales: usa solo los que tengas. Asigna un modelo distinto a cada rol (Planner, Navigator, Vision, Validator) segun tu presupuesto y necesidades.

| Proveedor | Variable | Obtener en |
|---|---|---|
| DeepSeek | DEEPSEEK_API_KEY | platform.deepseek.com |
| Gemini | GOOGLE_API_KEY | aistudio.google.com |
| OpenAI | OPENAI_API_KEY | platform.openai.com |
| Custom | URL + Key | Cualquier endpoint OpenAI-compatible |
| Ollama | Local | Sin key, modelo local |

## Uso

Escribe tareas en lenguaje natural en el chat del panel lateral. Ejemplos:

- "Busca en Mercado Libre el iPhone mas barato y dime el precio"
- "Entra a Gmail, busca el ultimo correo de facturacion y resumelo"
- "Extrae los titulares de hoy en la portada de BBC News"
- "Abre Google Docs y crea un documento con los puntos principales"

El agente planifica cada tarea, ejecuta paso a paso en tiempo real, y te reporta el resultado. El historial de conversacion se mantiene para tareas de seguimiento.

## Construir desde codigo

```bash
pnpm install
pnpm build
```

El resultado compilado queda en `dist/`.

## Arquitectura

El agente usa multi-modelo: el Planner descompone la tarea, el Navigator ejecuta las acciones en la pagina (DOM snapshot fresco en cada paso), el Vision analiza imagenes y screenshots, y el Validator confirma resultados. Cada rol usa el modelo que le asignes en Settings.

El navegador se controla mediante el API chrome.debugger (CDP), sin dependencias externas de Playwright ni Selenium. La extension inyecta scripts de contenido para extraer el arbol de accesibilidad de cada pagina.

## Licencia

Apache License 2.0.

Basado en Nanobrowser (https://github.com/nanobrowser/nanobrowser).
