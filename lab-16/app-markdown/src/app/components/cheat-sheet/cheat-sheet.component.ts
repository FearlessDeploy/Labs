import { Component, inject } from '@angular/core';
import { MarkdownService } from '../../services/markdown.service';

@Component({
    selector: 'app-cheat-sheet',
    standalone: true,
    template: `
    <div class="bg-white border border-[#dadce0] p-4 sm:p-6 rounded-2xl shadow-xs space-y-3 sm:space-y-4 animate-in slide-in-from-top-4 duration-200">
      <div class="flex justify-between items-center border-b border-[#f0f0f0] pb-2.5">
        <h3 class="font-bold text-[#1f1f1f] text-xs sm:text-sm flex items-center gap-2">
          <svg class="w-4 h-4 text-[#1a73e8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
          </svg>
          Guía Rápida de Sintaxis
        </h3>
        <span class="text-[10px] sm:text-[11px] font-medium text-[#5f6368] hidden xs:inline">Clic para insertar</span>
      </div>

      <div class="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
        @for (item of cheats; track item.label) {
          <button
            (click)="markdownService.insertSnippet(item.snippet)"
            class="bg-[#f8f9fa] hover:bg-[#f1f3f4] p-2.5 sm:p-3 rounded-xl border border-[#e0e0e0] text-left transition-all cursor-pointer group"
          >
            <span class="text-[10px] font-bold text-[#0b57d0] block mb-0.5 uppercase">{{ item.label }}</span>
            <code class="text-[11px] sm:text-xs font-mono text-[#3c4043] group-hover:text-[#1f1f1f] block truncate">{{ item.snippet }}</code>
          </button>
        }
      </div>
    </div>
  `
})
export class CheatSheetComponent {
    readonly markdownService = inject(MarkdownService);

    readonly cheats = [
        { label: 'Título H1', snippet: '# Título Principal' },
        { label: 'Título H2', snippet: '## Subtítulo' },
        { label: 'Texto Negrita', snippet: '**Texto en Negrita**' },
        { label: 'Texto Cursiva', snippet: '*Texto en Cursiva*' },
        { label: 'Lista Desplegada', snippet: '- Elemento 1\n- Elemento 2' },
        { label: 'Enlace Web', snippet: '[Texto del Enlace](https://uis.edu.co)' },
        { label: 'Bloque de Código', snippet: '```typescript\nconst x: number = 10;\n```' },
        { label: 'Cita Destacada', snippet: '> Cita importante aquí' }
    ];
}