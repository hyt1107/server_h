<template>

    <Line :data="data" :options="options" />
 
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  LineController,
  CategoryScale,
  LinearScale,
  Plugin
} from 'chart.js';
import { Line } from 'vue-chartjs';
import zoomPlugin from 'chartjs-plugin-zoom';
import annotationPlugin from 'chartjs-plugin-annotation'; // Import the annotation plugin

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  LineController,
  Title,
  Tooltip,
  Legend,
  zoomPlugin,
  annotationPlugin // Register the annotation plugin
);

export default defineComponent({
  name: 'ShowData',
  components: {
    Line
  },
  props: {
    data: {
      type: Object,
      required: true
    },
    options: {
      type: Object,
      required: false,
      default: () => ({
        responsive: true,
        plugins: {
          zoom: {
            zoom: {
              wheel: {
                enabled: true // Enable zooming with the mouse wheel
              },
              pinch: {
                enabled: true // Enable zooming with pinch gestures
              },
              mode: 'x' // Zoom on the x-axis
            },
            pan: {
              enabled: true,
              mode: 'x' // Pan on the x-axis
            }
          },
          annotation: {
            annotations: {
              high: {
                type: 'line',
                yMin: 900, // Set your high value here
                yMax: 900,
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 2,
                label: {
                  content: 'High',
                  enabled: true,
                  position: 'end'
                }
              },
              low: {
                type: 'line',
                yMin: 10, // Set your low value here
                yMax: 10,
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 2,
                label: {
                  content: 'Low',
                  enabled: true,
                  position: 'end'
                }
              }
            }
          }
        }
      })
    }
  }
});
</script>

<style scoped>

</style>
