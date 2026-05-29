import { Component, OnInit, signal, ViewChild, ElementRef, inject } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../api.service';
import { OpenRouterModel } from 'shared';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import type { EChartsOption } from 'echarts';

ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, AgGridAngular, NgxEchartsDirective, DecimalPipe],
  providers: [
    provideEchartsCore({ echarts: () => import('echarts') })
  ],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent implements OnInit {
  private apiService = inject(ApiService);

  rawModels: OpenRouterModel[] = [];
  models = signal<OpenRouterModel[]>([]);
  chartOptions = signal<EChartsOption>({});

  // Loading state
  isLoading = signal<boolean>(true);
  errorMessage = signal<string>('');

  // Global extreme bounds
  globalMinContext = 0;
  globalMaxContext = 100000;
  globalMinCost = 0;
  globalMaxCost = 100;
  globalMinEpoch = 0;
  globalMaxEpoch = 0;

  // Active filter bindings
  minContext = 0;
  maxContext = 100000;
  minCost = 0;
  maxCost = 100;
  minEpoch = 0;
  maxEpoch = 0;

  // Slider bindings (0 to 100 scale for smoother mapping)
  sliderMinCost = 0;
  sliderMaxCost = 100;

  // ag-grid configs
  themeClass = 'ag-theme-quartz-dark';
  defaultColDef: ColDef = {
    sortable: true,
    resizable: true,
    filter: true
  };

  colDefs: ColDef[] = [
    {
      headerName: 'Actions',
      width: 150,
      sortable: false,
      filter: false,
      cellRenderer: (params: any) => {
        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.gap = '8px';
        container.style.alignItems = 'center';
        container.style.height = '100%';

        const showBtn = document.createElement('button');
        showBtn.innerText = 'Show';
        showBtn.className = 'kbp-btn kbp-btn-secondary';
        showBtn.style.padding = '2px 8px';
        showBtn.style.fontSize = '11px';
        showBtn.style.height = '24px';
        showBtn.onclick = () => this.showModal(params.data);

        const linkBtn = document.createElement('button');
        linkBtn.innerText = 'Link';
        linkBtn.className = 'kbp-btn kbp-btn-primary';
        linkBtn.style.padding = '2px 8px';
        linkBtn.style.fontSize = '11px';
        linkBtn.style.height = '24px';
        linkBtn.onclick = () => window.open(`https://openrouter.ai/${params.data.id}`, '_blank');

        container.appendChild(showBtn);
        container.appendChild(linkBtn);
        return container;
      }
    },
    { field: 'id', headerName: 'Model', filter: 'agTextColumnFilter', flex: 2, minWidth: 200 },
    { 
      field: 'context_length', 
      headerName: 'Context', 
      filter: 'agNumberColumnFilter',
      valueFormatter: (params) => params.value != null ? params.value.toLocaleString() : '',
      width: 120
    },
    {
      field: 'outputCost',
      headerName: 'output$/M',
      filter: 'agNumberColumnFilter',
      valueFormatter: (params) => params.value != null ? `$${params.value.toFixed(2)}` : '',
      width: 120
    },
    { field: 'createdDate', headerName: 'created', filter: 'agDateColumnFilter', width: 180 },
  ];

  // Modal Dialog handle
  @ViewChild('modelDialog') modelDialog!: ElementRef<HTMLDialogElement>;
  selectedModelJson = signal<string>('');

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    this.isLoading.set(true);
    this.errorMessage.set('');
    
    this.apiService.getModels().subscribe({
      next: (data) => {
        this.rawModels = data;
        this.processData(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load OpenRouter models:', err);
        this.errorMessage.set(err.message || 'Error occurred while loading models.');
        this.isLoading.set(false);
      }
    });
  }

  processData(data: OpenRouterModel[]) {
    if (data.length === 0) return;

    const validEpochs = data.map(d => d.created).filter(d => d);
    this.globalMinEpoch = Math.min(...validEpochs);
    this.globalMaxEpoch = Math.max(...validEpochs);

    let minCtx = Infinity, maxCtx = -Infinity;
    let minCost = Infinity, maxCost = -Infinity;

    data.forEach(m => {
      const output = m.outputCost || 0;
      const ctx = m.context_length || 0;

      if (ctx < minCtx) minCtx = ctx;
      if (ctx > maxCtx) maxCtx = ctx;

      if (output < minCost && output >= 0) minCost = output;
      if (output > maxCost) maxCost = output;
    });

    this.globalMinContext = minCtx === Infinity ? 0 : minCtx;
    this.globalMaxContext = maxCtx === -Infinity ? 0 : maxCtx;
    this.globalMinCost = minCost === Infinity ? 0 : minCost;
    this.globalMaxCost = maxCost === -Infinity ? 0 : maxCost;

    // Reset range boundaries
    this.minContext = this.globalMinContext;
    this.maxContext = this.globalMaxContext;
    this.minCost = this.globalMinCost;
    this.maxCost = this.globalMaxCost;

    this.sliderMinCost = 0;
    this.sliderMaxCost = 100;

    this.minEpoch = this.globalMinEpoch;
    this.maxEpoch = this.globalMaxEpoch;

    this.applyFilters();
  }

  getCostFromSlider(sliderVal: number): number {
    const t = sliderVal / 100;
    const factor = Math.pow(t, 4); // x^4 curve to normalize data skew
    return this.globalMinCost + (this.globalMaxCost - this.globalMinCost) * factor;
  }

  onCostSliderChange() {
    if (this.sliderMinCost > this.sliderMaxCost) {
      this.sliderMinCost = this.sliderMaxCost;
    }
    this.minCost = this.getCostFromSlider(this.sliderMinCost);
    this.maxCost = this.getCostFromSlider(this.sliderMaxCost);
    this.applyFilters();
  }

  applyFilters() {
    if (this.minContext > this.maxContext) this.minContext = this.maxContext;
    if (this.minCost > this.maxCost) this.minCost = this.maxCost;
    if (this.minEpoch > this.maxEpoch) this.minEpoch = this.maxEpoch;

    const filtered = this.rawModels.filter(m => {
      const output = m.outputCost || 0;
      const ctx = m.context_length || 0;
      const created = m.created || 0;

      return (
        ctx >= this.minContext && ctx <= this.maxContext &&
        output >= this.minCost && output <= this.maxCost &&
        created >= this.minEpoch && created <= this.maxEpoch
      );
    });

    this.models.set(filtered);
    this.updateChartOptions(filtered);
  }

  updateChartOptions(filteredModels: OpenRouterModel[]) {
    const groups: { [key: string]: OpenRouterModel[] } = {};
    
    filteredModels.forEach(m => {
      const provider = m.id.split('/')[0] || 'other';
      if (!groups[provider]) {
        groups[provider] = [];
      }
      groups[provider].push(m);
    });

    const series = Object.keys(groups).map(providerName => {
      return {
        name: providerName,
        type: 'scatter',
        symbolSize: (data: any) => {
          const ctx = data[2] || 0;
          if (ctx <= 0) return 6;
          // Return radius styled based on context length logarithmic scale
          return Math.max(6, Math.min(50, Math.log2(ctx / 1000 + 1) * 4.5));
        },
        data: groups[providerName].map(m => {
          return {
            name: m.id,
            value: [
              m.created * 1000, // X axis: datetime milliseconds
              m.outputCost === 0 ? 0.01 : m.outputCost, // Y axis: completion cost log scale
              m.context_length
            ],
            model: m
          };
        })
      };
    });

    const options: EChartsOption = {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item',
        formatter: (params: any) => {
          const m = params.data.model as OpenRouterModel;
          return `
            <div style="background: rgba(17, 24, 39, 0.95); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 8px; padding: 12px; color: #f9fafb; font-family: var(--font-sans), sans-serif; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);">
              <strong style="color: #06b6d4; font-size: 14px; display: block; margin-bottom: 6px;">${m.name}</strong>
              <p style="margin: 3px 0; font-size: 12px;"><span style="color: #9ca3af;">Model:</span> ${m.id}</p>
              <p style="margin: 3px 0; font-size: 12px;"><span style="color: #9ca3af;">Context Length:</span> ${m.context_length.toLocaleString()}</p>
              <p style="margin: 3px 0; font-size: 12px;"><span style="color: #9ca3af;">Input $/M:</span> $${m.inputCost?.toFixed(2)}</p>
              <p style="margin: 3px 0; font-size: 12px;"><span style="color: #9ca3af;">Output $/M:</span> $${m.outputCost?.toFixed(2)}</p>
              <p style="margin: 3px 0; font-size: 12px;"><span style="color: #9ca3af;">Created:</span> ${m.createdDate}</p>
            </div>
          `;
        }
      },
      legend: {
        show: true,
        type: 'scroll',
        textStyle: { color: '#9ca3af' },
        top: 0
      },
      grid: {
        left: '5%',
        right: '5%',
        bottom: '10%',
        top: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'time',
        name: 'Release Date',
        nameTextStyle: { color: '#9ca3af' },
        splitLine: { show: false },
        axisLabel: { color: '#9ca3af' }
      },
      yAxis: {
        type: 'log',
        name: 'Output Cost ($/M)',
        nameTextStyle: { color: '#9ca3af' },
        splitLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.08)' } },
        axisLabel: {
          color: '#9ca3af',
          formatter: (value: number) => `$${value}`
        }
      },
      series: series as any
    };

    this.chartOptions.set(options);
  }

  formatDate(epoch: number): string {
    if (!epoch) return '';
    return new Date(epoch * 1000).toLocaleDateString();
  }

  showModal(modelData: OpenRouterModel) {
    this.selectedModelJson.set(JSON.stringify(modelData, null, 2));
    this.modelDialog.nativeElement.showModal();
  }

  closeModal() {
    this.modelDialog.nativeElement.close();
  }
}
