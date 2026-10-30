import { Component, inject } from '@angular/core';
import { MarkdownService } from '../../services/markdown.service';

@Component({
    selector: 'app-preview',
    standalone: true,
    template: `
    <div class="bg-white border border-[#dadce0] rounded-2xl shadow-xs flex flex-col h-full overflow-hidden">
      <div class="bg-[#f8f9fa] px-4 sm:px-6 py-2.5 sm:py-3 border-b border-[#dadce0] flex justify-between items-center shrink-0">
        <span class="text-xs font-semibold text-[#3c4043] uppercase tracking-wider flex items-center gap-1.5 sm:gap-2">
          <svg class="w-4 h-4 text-[#0b57d0]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
          </svg>
          Vista Previa
        </span>
        <span class="text-[10px] sm:text-[11px] font-medium text-[#0b57d0] bg-[#e8f0fe] px-2.5 py-0.5 rounded-full border border-[#c2e7ff]">
          HTML
        </span>
      </div>

      <div
        [innerHTML]="markdownService.parsedHtml()"
        class="markdown-body flex-1 p-5 sm:p-8 overflow-y-auto custom-scrollbar min-h-[280px] sm:min-h-[420px] bg-white"
      ></div>
    </div>
  `
})
export class PreviewComponent {
    readonly markdownService = inject(MarkdownService);
}