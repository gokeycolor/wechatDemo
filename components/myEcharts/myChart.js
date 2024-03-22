// components/myEcharts/myChart.js
import * as echarts from '../ec-canvas/echarts';

Component({
  /**
   * 组件的对外属性，是属性名到属性设置的映射表
   */
  properties: {
    chartId: {
      type: String
    },
    canvasId: {
      type: String
    },
    height: {
      type: String
    },
    options: {
      type: Object
    }
  },

  /**
   * 组件的内部数据，和 properties 一同用于组件的模板渲染
   */
  data: {
    isloading: true,
    ec: {
      chart: null, // 存储 ECharts 实例
      lazyLoad: true // 延迟加载
    },
    option: {}
  },

  /**
   * 监听 父组件传来的值，并赋值给option
   */
  observers: {
    'options': function(newOption) {
      this.updateOption(newOption);
    }
  },

  /**
   * 组件生命周期
   */
  lifetimes: {
    created()
    {
      setTimeout(()=>{this.initChart()},100)
    },
    ready() {
      console.log('onComponentsReady',this.data.isloading);
      // this.initChart();
    },
    detached(e) {
      if (this.data.ec && this.data.ec.chart) {
        this.data.ec.chart.dispose(); // 销毁图表实例
        this.data.ec.chart = null;
      }
      this[this.data.chartId] = null
      this[this.data.canvasId] = null
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    initChart() {
      this.selectComponent('#' + this.data.chartId).init((canvas, width, height, dpr) => {
        let chart = echarts.init(canvas, null, {
          width: width,
          height: height,
          devicePixelRatio: dpr // 适配低像素密度屏幕
        });
        this.data.ec.chart = chart; // 保存 ECharts 实例
        chart.setOption(this.getOption()); // 使用初始选项渲染图表
        this.setData({ isLoading: false });
        return chart;
      });
    },
    getOption() {
      return this.data.option;
    },
    updateOption(newOption) {
      if (this.data.ec && this.data.ec.chart) {
        this.data.ec.chart.setOption(newOption, true); // 第二个参数 true 表示不合并，替换现有选项
      } else {
        // this.initChart()
      setTimeout(()=>{this.initChart()},10) ;
      }
    }
  }
});