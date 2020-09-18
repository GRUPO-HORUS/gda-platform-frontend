import { Component, OnInit } from '@angular/core';
import { LayoutService } from '../../../../../core';
import { DashboardService } from '../../../dashboards/dashboard.service';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-mixed-bienes',
  templateUrl: './mixed-bienes.component.html',
})
export class MixedBienesComponent implements OnInit {
  chartOptions: any = {};
  fontFamily = '';
  colorsGrayGray500 = '';
  colorsGrayGray200 = '';
  colorsGrayGray300 = '';
  colorsThemeBaseDanger = '';

  totalBienes:number=0;
  pendientesEtiqueta:number=0;
  pendientesAprobacion:number=0;
  recordatoriosProx:number=0;

  constructor(private layout: LayoutService, private dashboardService: DashboardService, private router: Router) {
    this.fontFamily = this.layout.getProp('js.fontFamily');
    this.colorsGrayGray500 = this.layout.getProp('js.colors.gray.gray500');
    this.colorsGrayGray200 = this.layout.getProp('js.colors.gray.gray200');
    this.colorsGrayGray300 = this.layout.getProp('js.colors.gray.gray300');
    this.colorsThemeBaseDanger = this.layout.getProp('js.colors.theme.base.danger');

  }

  ngOnInit(): void {
    this.chartOptions = this.getChartOptions();

    this.dashboardService.getStatsDashboard().subscribe(stats => {
      this.totalBienes = stats.totalElementos;
      this.pendientesEtiqueta = stats.pendientesEtiquetado;
      this.pendientesAprobacion = stats.pendientesAprobacion;
      //console.log(this.totalBienes);
    });
  }

  getChartOptions() {
    const strokeColor = '#D13647';
    return {
      series: [
        {
          name: 'Net Profit',
          data: [30, 45, 32, 70, 40, 40, 40],
        },
      ],
      chart: {
        type: 'area',
        height: 200,
        toolbar: {
          show: false,
        },
        zoom: {
          enabled: false,
        },
        sparkline: {
          enabled: true,
        },
        dropShadow: {
          enabled: true,
          enabledOnSeries: undefined,
          top: 5,
          left: 0,
          blur: 3,
          color: strokeColor,
          opacity: 0.5,
        },
      },
      plotOptions: {},
      legend: {
        show: false,
      },
      dataLabels: {
        enabled: false,
      },
      fill: {
        type: 'solid',
        opacity: 0,
      },
      stroke: {
        curve: 'smooth',
        show: true,
        width: 3,
        colors: [strokeColor],
      },
      xaxis: {
        categories: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        labels: {
          show: false,
          style: {
            colors: this.colorsGrayGray500,
            fontSize: '12px',
            fontFamily: this.fontFamily,
          },
        },
        crosshairs: {
          show: false,
          position: 'front',
          stroke: {
            color: this.colorsGrayGray300,
            width: 1,
            dashArray: 3,
          },
        },
      },
      yaxis: {
        min: 0,
        max: 80,
        labels: {
          show: false,
          style: {
            colors: this.colorsGrayGray500,
            fontSize: '12px',
            fontFamily: this.fontFamily,
          },
        },
      },
      states: {
        normal: {
          filter: {
            type: 'none',
            value: 0,
          },
        },
        hover: {
          filter: {
            type: 'none',
            value: 0,
          },
        },
        active: {
          allowMultipleDataPointsSelection: false,
          filter: {
            type: 'none',
            value: 0,
          },
        },
      },
      tooltip: {
        style: {
          fontSize: '12px',
          fontFamily: this.fontFamily,
        },
        y: {
          // tslint:disable-next-line
          formatter: function (val) {
            return '$' + val + ' thousands';
          },
        },
        marker: {
          show: false,
        },
      },
      colors: ['transparent'],
      markers: {
        colors: this.colorsThemeBaseDanger,
        strokeColor: [strokeColor],
        strokeWidth: 3,
      },
    };
  }
}
