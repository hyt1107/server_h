<template>
  <div class="align-items-center justify-content-center surface-ground grid p-fluid flex">
    <div class="col-11 xl:col-10">
      <div class="card">
        <div>

        <div class="card-header">
            <h4><b>振動數據</b></h4>
            <div v-if="!loading" class="connection-time">
              <p>連接已關閉 {{ connectionTime }}</p>
            </div>
            <div v-if="loading" class="connection-time">
              <p>連接中 {{ connectionTime }}</p>
            </div>
        </div>
       
          <ShowData :data="chartData" :options="chartOptions" />
        
          <br />
          <br />
        </div>
        <div class="flex justify-content-between mb-3" style="gap: 10px;" > 
            <div style="width:380px">   
              <FileUpload
                name="demo[]"
                @uploader="onUpload"
                :multiple="false"
                accept=".csv"
                :maxFileSize="1000000000"
                customUpload
                size= "small"
              />
            </div>
                   
            <div class="cards">
              <Button
                label="Connect"
                style="width: 100px; height: 30px; font-size: 13px;"
                class="mr-2 mb-2"
                icon="pi pi-share-alt"
                :loading="loading"
                @click="connect"
                
              />
              <Button
                label="Disable"
                style="width: 95px; height: 30px; font-size: 13px;"
                class="mr-2 mb-2"
                icon="pi pi-times"
                @click="disconnect"
                
              />
              <Button
                label="Clear"
                style="width: 95px; height: 30px; font-size: 13px;"
                class="mr-2 mb-2"
                icon="pi pi-eraser"
                :disabled="loading"
                @click="clear"
                
              />
              <br />
            </div>
                     
            <div class="flex flex-wrap gap-2">
              <div class="flex-auto">
                <label for="stacked-buttons" class="font-bold block mb-2"> 高異常值 </label>
                <InputNumber v-model="inputNumberValueHigh" showButtons mode="decimal" style="width: 9rem" :min="-49" :max="1000" :placeholder="maxLimit"></InputNumber>
              </div>
              <div class="flex-auto">  
                <label for="stacked-buttons" class="font-bold block mb-2"> 低異常值 </label>
                <InputNumber v-model="inputNumberValueLow" showButtons mode="decimal" style="width: 9rem" :min="-50" :max="999" :placeholder="minLimit"></InputNumber>
              </div>
            </div>
        </div>

        <div>
            <br />
            <h5>Parsed JSON Data</h5>
            <pre>{{ parsedJsonData }}</pre>
            <div v-if="loading" class="text-center mt-3">
               <i class="pi pi-spin pi-spinner" style="font-size: 2em;"></i>
            </div>
        </div>
      </div>
    </div>
    <div>
      <!-- <SpeedDial :model="items" direction="down" style="position: absolute; left: calc(50% - 2rem); top: 0" /> -->
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent,watch  } from 'vue';
import ShowData from '../utilities/Showdata.vue';
import Papa from 'papaparse';
import axios from 'axios';


export default defineComponent({
  name: 'Monitor',
  components: {
    ShowData,
  },
  data() {
    let maxLimit = 70; //預設差異值
    let minLimit = 20;
    return {
      chartData: {
        labels: [],
        datasets: [
          {
            label: 'X',
            data: [],
            fill: false,
            borderColor: 'rgb(137, 104, 205)',
            tension: 0.1
          },
          {
            label: 'Y',
            data: [],
            fill: false,
            borderColor: 'rgb(16, 78 ,139)',
            tension: 0.1
          },
          {
            label: 'Z',
            data: [],
            fill: false,
            borderColor: 'rgb(69 ,139 ,0)',
            tension: 0.1
          }
        ]
      },
      chartOptions: {
        responsive: true,
        plugins: {
          zoom: {
            zoom: {
              wheel: {
                enabled: true
              },
              pinch: {
                enabled: true
              },
              mode: 'x'
            },
            pan: {
              enabled: true,
              mode: 'x'
            }
          },
          annotation: {
            annotations: {
              maxLine: {
                type: 'line',
                yMin: maxLimit, // 设置您的最高标准值
                yMax: maxLimit,
                borderColor: '#FF2D2D',
                borderWidth: 2,
                label: {
                  content: 'Max Limit',
                  enabled: true,
                  position: 'center'
                }
              },
              minLine: {
                type: 'line',
                yMin: minLimit, // 设置您的最低标准值
                yMax: minLimit,
                borderColor: '#28FF28',
                //borderDash: [5, 5],
                //tension: 0.4,
                borderWidth: 2,
                label: {
                  content: 'Min Limit',
                  enabled: true,
                  position: 'center'
                }
              }
            }
          }
        }
      },
      maxLimit ,
      minLimit ,
      inputNumberValueHigh:null,
      inputNumberValueLow:null,
      parsedJsonData: null,
      loading: false,
      intervalId: null,
      connectionTime: '00:00',
      connectionInterval: null,
      elapsedSeconds:0
    };
  },
  watch: {
    inputNumberValueHigh(newValue) {
      this.chartOptions.plugins.annotation.annotations.maxLine.yMin = newValue;
      this.chartOptions.plugins.annotation.annotations.maxLine.yMax = newValue;
    },
    inputNumberValueLow(newValue) {
      this.chartOptions.plugins.annotation.annotations.minLine.yMin = newValue;
      this.chartOptions.plugins.annotation.annotations.minLine.yMax = newValue;
    }
  },
  methods: {
    onUpload(event: any) {
      const file = event.files[0];
      if (file) {
        this.loading = true;
        const reader = new FileReader();
        reader.onload = (e: any) => {
          const csv = e.target.result;
          this.parseCSV(csv);
        };
        reader.readAsText(file);
      }
    },
    parseCSV(csv: string) {
      Papa.parse(csv, {
        header: true,
        skipEmptyLines: true,
        complete: (result: Papa.ParseResult<any>) => {
          const data = result.data;
          this.parsedJsonData = data;
          this.updateChartData(data);
          this.loading = false;
        }
      });
    },
    updateChartData(data: any[]) {
      const labels = data.map((_, index) => (index + 1).toString());
      const xValues = data.map(row => parseFloat(row['X']));
      const yValues = data.map(row => parseFloat(row['Y']));
      const zValues = data.map(row => parseFloat(row['Z']));
      this.chartData = {
        labels,
        datasets: [
          {
            label: 'X',
            data: xValues,
            fill: false,
            borderColor: 'rgb(137, 104, 205)',
            tension: 0.1
          },
          {
            label: 'Y',
            data: yValues,
            fill: false,
            borderColor: 'rgb(16, 78 ,139)',
            tension: 0.1
          },
          {
            label: 'Z',
            data: zValues,
            fill: false,
            borderColor: 'rgb(69 ,139 ,0)',
            tension: 0.1
          }
        ]
      };
    },
    async fetchData() {
      try {
        const apiBaseUrl = 'http://192.168.123.235:3000';
        const response = await axios.get(`${apiBaseUrl}/vib`);
        const data = response.data;
        this.parsedJsonData = data;
        this.updateChartData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    },
    connect() {
       if (this.elapsedSeconds === 0) {
        this.connectionTime = '00:00';
      }
      this.loading = true;
      this.fetchData(); // Fetch initial data
      this.intervalId = setInterval(this.fetchData, 3000); // Fetch data every 5 seconds
      this.startConnectionTimer();
      console.log('連接中');
    },
    disconnect() {
      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = null;
      }
      if (this.connectionInterval) {
        clearInterval(this.connectionInterval);
        this.connectionInterval = null;
      }
      this.loading = false;
      console.log('斷開連結');
    },
    clear() {
      this.loading = true;
      this.elapsedSeconds = 0;
      this.connectionTime = '00:00';
      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = null;
      }
      if (this.connectionInterval) {
        clearInterval(this.connectionInterval);
        this.connectionInterval = null;
      }
      this.parsedJsonData = null;
      this.chartData = {
        labels: [],
        datasets: [
          {
            label: 'X',
            data: [],
            fill: false,
            borderColor: 'rgb(137, 104, 205)',
            tension: 0.1,
          },
          {
            label: 'Y',
            data: [],
            fill: false,
            borderColor: 'rgb(16, 78 ,139)',
            tension: 0.1,
          },
          {
            label: 'Z',
            data: [],
            fill: false,
            borderColor: 'rgb(69 ,139 ,0)',
            tension: 0.1,
          },
        ],
      };
      this.loading = false;
      console.log('清除紀錄');
    },
    startConnectionTimer() {
      if (this.connectionInterval) {
        clearInterval(this.connectionInterval);
      }
      this.connectionInterval = setInterval(() => {
        this.elapsedSeconds++;
        const minutes = Math.floor(this.elapsedSeconds / 60);
        const displaySeconds = this.elapsedSeconds % 60;
        this.connectionTime = `${this.pad(minutes)}:${this.pad(displaySeconds)}`;
      }, 1000);
    },
    pad(num: number) {
      return num.toString().padStart(2, '0');
    }
  }
  
});
</script>

<style scoped>
.outside-card {
  display: flex;
  flex-direction: column;
}

.inside-card {
  display: flex;
  flex-direction: row; /* 垂直排列文字和InputNumber */
  align-items: flex-start; /* 左對齊 */
  
}
.card {
  min-width: 400px;
  margin: 0 auto;
}
.cards {
    width:390px;
    background: var(--surface-card);
    border: 1px solid var(--surface-border);
    padding: 1rem;
    padding-top: 1rem;
    margin-bottom: 0rem;
    box-shadow: var(--card-shadow);
    border-radius: 10px;

}
.spinner-container {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  /* background-color: rgba(255, 255, 255, 0.7); /* Optional: Add a light background overlay */
  /* z-index: 1000;  */
}

.connection-status {
  position: absolute;
  top: 10px;
  right: 10px;
  color: red;
  font-weight: bold;
}
.text-center {
  text-align: center;
}
.mt-3 {
  margin-top: 1rem;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.connection-time {
  color: green;
  font-weight: bold;
}
</style>
