import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from 'services/analytics.service';
import {
  BreakpointObserver,
  Breakpoints,
  BreakpointState,
} from '@angular/cdk/layout';
import {
  Chart,
  ArcElement,
  LineElement,
  BarElement,
  PointElement,
  BarController,
  BubbleController,
  DoughnutController,
  LineController,
  PieController,
  PolarAreaController,
  RadarController,
  ScatterController,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  RadialLinearScale,
  TimeScale,
  TimeSeriesScale,
  Decimation,
  Filler,
  Legend,
  Title,
  Tooltip,
} from 'chart.js';

Chart.register(
  ArcElement,
  LineElement,
  BarElement,
  PointElement,
  BarController,
  BubbleController,
  DoughnutController,
  LineController,
  PieController,
  PolarAreaController,
  RadarController,
  ScatterController,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  RadialLinearScale,
  TimeScale,
  TimeSeriesScale,
  Decimation,
  Filler,
  Legend,
  Title,
  Tooltip
);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.sass'],
})
export class DashboardComponent implements OnInit {
  productsCount: number = 0;
  ordersCount: number = 0;
  usersCount: number = 0;
  revenue: number = 0;
  ordersDataByMonth: any[] = [];
  colspan: number = 1;
  rowspanChart: number = 4;
  colspanChart: number = 2;

  constructor(
    private analyticsService: AnalyticsService,
    public breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit(): void {
    this.breakpointObserver
      .observe([
        Breakpoints.Small,
        Breakpoints.HandsetPortrait,
        Breakpoints.XLarge,
      ])
      .subscribe((state: BreakpointState) => {
        if (
          state.breakpoints[Breakpoints.Small] ||
          state.breakpoints[Breakpoints.HandsetPortrait]
        ) {
          this.colspan = 4;
          this.rowspanChart = 4;
          this.colspanChart = 4;
        } else if (state.breakpoints[Breakpoints.XLarge]) {
          this.colspan = 1;
          this.rowspanChart = 4;
          this.colspanChart = 2;
        } else {
          this.colspan = 2;
          this.rowspanChart = 4;
          this.colspanChart = 2;
        }
      });

    let labels: string[] = [];
    let chartData: number[] = [];

    this.analyticsService.overview().subscribe({
      next: (data: any) => {
        this.productsCount = data.productsCount;
        this.ordersCount = data.ordersCount;
        this.usersCount = data.usersCount;
        this.ordersDataByMonth = data.ordersDataByMonth;
        this.revenue = data.revenue;

        for (let i = 0; i <= 31; i++) {
          let date = new Date(Date.now() - 1000 * 3600 * 24 * (31 - i));
          let item = this.ordersDataByMonth.find((item) => {
            return (
              item._id.dayOfMonth == date.getDate() &&
              item._id.month == date.getMonth() + 1
            );
          });

          chartData.push(item?.count ? item.count : 0);
          labels.push('' + date.getDate());
        }
        this.drawChart(labels, chartData);
      },
    });
  }
  drawChart(labels: string[], data: number[]) {
    const chart = new Chart('chart', {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Кількість замовлень',
            data: data,
            cubicInterpolationMode: 'monotone',
            tension: 0.4,
            fill: true,
            backgroundColor: [
              'rgba(255, 88, 121, 0.5)',
              // 'rgba(54, 162, 235, 0.2)',
              // 'rgba(255, 206, 86, 0.2)',
              // 'rgba(75, 192, 192, 0.2)',
              // 'rgba(153, 102, 255, 0.2)',
              // 'rgba(255, 159, 64, 0.2)',
            ],
            borderColor: [
              'rgba(255, 88, 121)',
              // 'rgba(54, 162, 235, 1)',
              // 'rgba(255, 206, 86, 1)',
              // 'rgba(75, 192, 192, 1)',
              // 'rgba(153, 102, 255, 1)',
              // 'rgba(255, 159, 64, 1)',
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
            },
          },
          x: {
            ticks: {
              stepSize: 1,
            },
          },
        },
      },
    });
  }
}
