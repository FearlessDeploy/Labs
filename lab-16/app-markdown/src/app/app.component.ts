import { Component, inject, signal } from '@angular/core';
import { HeaderComponent } from './components/header/header.component';
import { EditorComponent } from './components/editor/editor.component';
import { PreviewComponent } from './components/preview/preview.component';
import { CheatSheetComponent } from './components/cheat-sheet/cheat-sheet.component';
import { MarkdownService } from './services/markdown.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent, EditorComponent, PreviewComponent, CheatSheetComponent],
  template: `
    <div class="min-h-screen flex flex-col font-sans bg-[#f8f9fa] w-full overflow-x-hidden">
      <!-- Encabezado principal -->
      <app-header (toggleCheatSheet)="showCheatSheet.set(!showCheatSheet())"></app-header>

      <!-- Contenedor principal de trabajo -->
      <main class="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 flex-1 space-y-4 w-full flex flex-col min-w-0">
        <!-- Guía de sintaxis colapsable -->
        @if (showCheatSheet()) {
          <app-cheat-sheet class="block w-full"></app-cheat-sheet>
        }

        <!-- Panel Dual: Editor y Previsualización -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 flex-1 w-full min-w-0">
          <app-editor class="block w-full h-full min-w-0"></app-editor>
          <app-preview class="block w-full h-full min-w-0"></app-preview>
        </div>
      </main>

      <!-- Barra de Estado Inferior -->
      <footer class="bg-white border-t border-[#dadce0] px-4 sm:px-6 py-3 text-xs text-[#5f6368] flex flex-col sm:flex-row justify-between items-center gap-3 mt-auto shadow-xs text-center sm:text-left w-full shrink-0">
        <div class="flex justify-center sm:justify-start gap-4 sm:gap-6 font-mono font-medium text-[#3c4043] text-[11px] sm:text-xs w-full sm:w-auto">
          <span>Caracteres: <strong class="text-[#1f1f1f]">{{ markdownService.stats().chars }}</strong></span>
          <span>Palabras: <strong class="text-[#1f1f1f]">{{ markdownService.stats().words }}</strong></span>
          <span>Líneas: <strong class="text-[#1f1f1f]">{{ markdownService.stats().lines }}</strong></span>
        </div>

        <span class="text-[10px] sm:text-[11px] text-[#5f6368] font-mono block w-full sm:w-auto">
          UIS Markdown Studio v1.0.0 - Fearless Deploy Test App © 2026
        </span>
      </footer>
    </div>
  `
})
export class AppComponent {
  readonly markdownService = inject(MarkdownService);
  showCheatSheet = signal<boolean>(false);
}
