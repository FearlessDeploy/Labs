import { Component, inject, output } from '@angular/core';
import { MarkdownService } from '../../services/markdown.service';

@Component({
    selector: 'app-header',
    standalone: true,
    template: `
    <header class="bg-white border-b border-[#dadce0] sticky top-0 z-40 shadow-xs w-full">
      <div class="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2 min-w-0">
        
        <!-- Marca e Identidad -->
        <div class="flex items-center gap-2 sm:gap-2.5 min-w-0 shrink-0">
          <div class="h-9 w-9 bg-[#e8f0fe] text-[#1a73e8] rounded-xl flex items-center justify-center p-2 border border-[#c2e7ff] shrink-0">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
            </svg>
          </div>
          <div class="min-w-0">
            <h1 class="font-bold text-[#1f1f1f] text-xs sm:text-sm lg:text-base leading-tight tracking-tight truncate">
              UIS Markdown Studio
            </h1>
            <span class="text-[9px] sm:text-[11px] font-medium text-[#5f6368] block truncate">
              Editor & Previewer
            </span>
          </div>
        </div>

        <!-- Acciones en pantallas medianas / escritorio -->
        <div class="hidden md:flex items-center justify-end gap-1 lg:gap-2 shrink-0 max-w-full">
          <!-- Plantillas -->
          <button
            (click)="toggleCheatSheet.emit()"
            class="bg-[#f1f3f4] hover:bg-[#e3e3e3] text-[#3c4043] text-[11px] lg:text-xs font-medium px-2 lg:px-3.5 py-1.5 lg:py-2 rounded-full transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap"
          >
            <svg class="w-3.5 h-3.5 text-[#5f6368]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span class="hidden lg:inline">Plantillas</span>
            <span class="lg:hidden">Guía</span>
          </button>

          <!-- Cargar Ejemplo -->
          <button
            (click)="markdownService.resetToDefault()"
            class="bg-[#f1f3f4] hover:bg-[#e3e3e3] text-[#3c4043] text-[11px] lg:text-xs font-medium px-2 lg:px-3.5 py-1.5 lg:py-2 rounded-full transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap"
            title="Restablecer el documento de ejemplo inicial"
          >
            <svg class="w-3.5 h-3.5 text-[#1a73e8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            <span class="hidden lg:inline">Cargar Ejemplo</span>
            <span class="lg:hidden">Ejemplo</span>
          </button>

          <!-- Limpiar -->
          <button
            (click)="markdownService.clear()"
            class="bg-[#f1f3f4] hover:bg-red-50 text-[#3c4043] hover:text-red-700 text-[11px] lg:text-xs font-medium px-2 lg:px-3.5 py-1.5 lg:py-2 rounded-full transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap"
          >
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
            </svg>
            Limpiar
          </button>

          <!-- Exportar .MD -->
          <button
            (click)="markdownService.exportAsMarkdown()"
            class="bg-[#e8f0fe] hover:bg-[#d3e3fd] text-[#0b57d0] text-[11px] lg:text-xs font-semibold px-2.5 lg:px-4 py-1.5 lg:py-2 rounded-full transition-all flex items-center gap-1 border border-[#c2e7ff] cursor-pointer whitespace-nowrap"
          >
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 002 3h12a3 3 0 002-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
            </svg>
            .MD
          </button>

          <!-- Exportar .HTML Fijo -->
          <button
            (click)="markdownService.exportAsHtml()"
            class="bg-[#0b57d0] hover:bg-[#1b65d9] text-white text-[11px] lg:text-xs font-semibold px-2.5 lg:px-5 py-1.5 lg:py-2 rounded-full shadow-sm transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap"
          >
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
            </svg>
            .HTML
          </button>
        </div>

        <!-- Menú móvil -->
        <button
          (click)="isMobileMenuOpen = !isMobileMenuOpen"
          class="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors focus:outline-none cursor-pointer shrink-0"
          aria-label="Abrir menú"
        >
          @if (!isMobileMenuOpen) {
            <svg class="w-6 h-6 animate-in fade-in duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          } @else {
            <svg class="w-6 h-6 animate-in fade-in duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          }
        </button>

        <!-- Desplegable móvil -->
        @if (isMobileMenuOpen) {
          <div class="absolute top-[65px] left-0 w-full bg-white border-b border-[#dadce0] shadow-md px-4 py-3 flex flex-col gap-2.5 z-50 md:hidden animate-in slide-in-from-top-3 duration-200">
            <button
              (click)="toggleCheatSheet.emit(); isMobileMenuOpen = false"
              class="w-full bg-[#f1f3f4] text-[#3c4043] text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center gap-2.5 cursor-pointer"
            >
              <svg class="w-4 h-4 text-[#5f6368]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              Ver Plantillas / Guía
            </button>

            <button
              (click)="markdownService.resetToDefault(); isMobileMenuOpen = false"
              class="w-full bg-[#f1f3f4] text-[#3c4043] text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center gap-2.5 cursor-pointer"
            >
              <svg class="w-4 h-4 text-[#1a73e8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              Cargar Ejemplo Inicial
            </button>

            <button
              (click)="markdownService.clear(); isMobileMenuOpen = false"
              class="w-full bg-red-50 text-red-700 text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center gap-2.5 cursor-pointer"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
              Limpiar Editor
            </button>

            <div class="h-px bg-slate-100 my-0.5"></div>

            <div class="grid grid-cols-2 gap-2">
              <button
                (click)="markdownService.exportAsMarkdown(); isMobileMenuOpen = false"
                class="bg-[#e8f0fe] text-[#0b57d0] text-xs font-bold py-2.5 rounded-xl border border-[#c2e7ff] flex items-center justify-center gap-2 cursor-pointer"
              >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 002 3h12a3 3 0 002-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                </svg>
                Exportar .MD
              </button>

              <button
                (click)="markdownService.exportAsHtml(); isMobileMenuOpen = false"
                class="bg-[#0b57d0] text-white text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
                </svg>
                Exportar .HTML
              </button>
            </div>
          </div>
        }

      </div>
    </header>
  `
})
export class HeaderComponent {
    readonly markdownService = inject(MarkdownService);
    readonly toggleCheatSheet = output<void>();
    isMobileMenuOpen = false;
}
