import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MarkdownService } from '../../services/markdown.service';

@Component({
    selector: 'app-editor',
    standalone: true,
    imports: [FormsModule],
    // Configuración del elemento host del componente
    host: {
        class: 'block w-full h-full'
    },
    template: `
    <div class="bg-white border border-[#dadce0] rounded-2xl shadow-xs flex flex-col h-full w-full overflow-hidden mx-auto">
      
      <!-- Encabezado del Editor -->
      <div class="bg-[#f8f9fa] px-4 sm:px-6 py-2.5 sm:py-3 border-b border-[#dadce0] flex justify-between items-center shrink-0">
        <span class="text-xs font-semibold text-[#3c4043] uppercase tracking-wider flex items-center gap-1.5 sm:gap-2">
          <svg class="w-4 h-4 text-[#1a73e8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
          </svg>
          Editor
        </span>
        <span class="text-[10px] sm:text-[11px] font-medium text-[#5f6368] flex items-center gap-1">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Guardado
        </span>
      </div>

      <!-- Área de entrada Markdown -->
      <textarea
        [ngModel]="markdownService.markdownText()"
        (ngModelChange)="markdownService.updateMarkdown($event)"
        spellcheck="false"
        placeholder="# Comienza a escribir tu documento en Markdown..."
        class="flex-1 w-full bg-transparent p-4 sm:p-6 text-xs sm:text-sm font-mono text-[#1f1f1f] focus:outline-none resize-none leading-relaxed custom-scrollbar min-h-[280px] sm:min-h-[420px]"
      ></textarea>
      
    </div>
  `
})
export class EditorComponent {
    readonly markdownService = inject(MarkdownService);
}
