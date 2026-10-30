import { Injectable, signal, computed, effect } from '@angular/core';
import { marked } from 'marked';

// Plantilla Markdown inicial cargada por defecto si no existe contenido guardado
const DEFAULT_MARKDOWN = `# Documento de Trabajo | UIS Markdown Studio

## Especificaciones Técnicas

- **Sincronización en Tiempo Real**: Traducción de texto plano a HTML al instante.
- **Persistencia Local**: Guardado automático de datos en localStorage.
- **Exportación Dual**: Descarga directa de archivos en formato .md y .html.

---

### Ejemplo de Código TypeScript

\`\`\`typescript
interface Estudiante {
  nombre: string;
  codigo: string;
  promedio: number;
}

function evaluarRendimiento(estudiante: Estudiante): string {
  return \`El estudiante \${estudiante.nombre} registra un promedio de \${estudiante.promedio}\`;
}
\`\`\`

### Lista de Tareas
- [x] Configurar Angular v18 Standalone
- [x] Aplicar diseño limpio
- [x] Validar despliegue en Fearless Deploy

> *"La simplicidad y la claridad son los pilares fundamentales del software robusto."*
`;

/**
 * Servicio centralizado para el estado del documento Markdown.
 * Utiliza Signals de Angular v18 para reactividad sin re-renders innecesarios.
 */
@Injectable({
    providedIn: 'root'
})
export class MarkdownService {
    private readonly STORAGE_KEY = 'uis_markdown_content';

    // Estado reactivo principal del editor
    readonly markdownText = signal<string>(this.loadFromStorage());

    // HTML parseado reactivamente a partir del texto Markdown
    readonly parsedHtml = computed<string>(() => {
        try {
            return marked.parse(this.markdownText(), { async: false }) as string;
        } catch (e) {
            return '<p class="text-red-600 font-bold">Error al procesar la sintaxis Markdown.</p>';
        }
    });

    // Métricas en tiempo real (caracteres, palabras, líneas)
    readonly stats = computed(() => {
        const text = this.markdownText();
        const chars = text.length;
        const words = text.trim() ? text.trim().split(/\s+/).length : 0;
        const lines = text ? text.split('\n').length : 0;
        return { chars, words, lines };
    });

    constructor() {
        // Persistencia automática en localStorage mediante un efecto reactivo
        effect(() => {
            localStorage.setItem(this.STORAGE_KEY, this.markdownText());
        });
    }

    updateMarkdown(text: string): void {
        this.markdownText.set(text);
    }

    resetToDefault(): void {
        this.markdownText.set(DEFAULT_MARKDOWN);
    }

    clear(): void {
        this.markdownText.set('');
    }

    insertSnippet(snippet: string): void {
        const current = this.markdownText();
        this.markdownText.set(current ? `${current}\n\n${snippet}` : snippet);
    }

    exportAsMarkdown(): void {
        const blob = new Blob([this.markdownText()], { type: 'text/markdown;charset=utf-8' });
        this.downloadBlob(blob, 'documento-uis.md');
    }

    /**
     * Genera un archivo HTML independiente con estilos integrados para visualización standalone.
     */
    exportAsHtml(): void {
        const fullHtml = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Documento Exportado | UIS Markdown Studio</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; line-height: 1.7; max-width: 800px; margin: 2rem auto; padding: 0 1rem; color: #1f1f1f; background: #ffffff; }
    h1, h2, h3 { color: #0b57d0; border-bottom: 1px solid #e0e0e0; padding-bottom: 0.3rem; }
    code { background: #f1f3f4; color: #0b57d0; padding: 0.2rem 0.4rem; border-radius: 4px; font-family: monospace; font-size: 0.9em; }
    pre { background: #1e1e1e; color: #0ea54dff; padding: 1.2rem; border-radius: 8px; overflow-x: auto; font-family: monospace; }
    pre code { background: transparent !important; color: #38bdf8 !important; padding: 0 !important; font-size: 0.95em; }
    blockquote { border-left: 4px solid #1a73e8; margin: 0; padding-left: 1rem; color: #5f6368; font-style: italic; background: #f8f9fa; padding-top: 0.4rem; padding-bottom: 0.4rem; border-radius: 0 0.5rem 0.5rem 0; }
    ul, ol { padding-left: 1.5rem; }
    a { color: #1a73e8; text-decoration: underline; }
    hr { border: 0; border-top: 1px solid #e0e0e0; margin: 1.5rem 0; }
  </style>
</head>
<body>
  ${this.parsedHtml()}
</body>
</html>`;

        const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
        this.downloadBlob(blob, 'documento-uis.html');
    }

    private downloadBlob(blob: Blob, filename: string): void {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    }

    private loadFromStorage(): string {
        return localStorage.getItem(this.STORAGE_KEY) ?? DEFAULT_MARKDOWN;
    }
}