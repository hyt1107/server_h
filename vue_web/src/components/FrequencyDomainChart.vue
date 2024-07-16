<template>
  <div>
    <v-chart :option="chartOptions" style="width: 100%; height: 400px;"></v-chart>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { use } from 'echarts/core'
import VChart from 'vue-echarts'
import { BarChart } from 'echarts/charts'
import 'echarts/lib/chart/line'
import { GridComponent, TooltipComponent, TitleComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

use([BarChart, GridComponent, TooltipComponent, TitleComponent, CanvasRenderer])

export default defineComponent({
  components: { VChart },
  props: {
    labels: {
      type: Array,
      required: true
    },
    frequencyData: {
      type: Array,
      required: true
    }
  },
  computed: {
    chartOptions() {
      return {
        title: {
          text: 'Frequency Domain Data'
        },
        tooltip: {},
        xAxis: {
          type: 'category',
          data: this.labels
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            type: 'line',  // 使用折線圖
            data: this.frequencyData
          }
        ]
      }
    }
  }
})
</script>
