<script>
import axios from 'axios';
import Chart from 'chart.js/auto';

const apiBaseUrl = 'http://192.168.123.235:3000'; // 替換成您的 API 基礎 URL

export default {
    data() {
        return {
            selectedSource: '',
            confirmed: false,
            csvFile: null,
            databaseResults: [],
            csvData: [],
            chart: null,
            loading: false,
            prediction: null,
            predictionText: null,
            predictionTime: 0,
            requestStartTime: 0,
            requestEndTime: 0,
            showX: true,
            showY: true,
            showZ: true
        };
    },

    computed: {
        canConfirm() {
            return this.selectedSource !== '';
        },
        showPredictionButton() {
            return this.selectedSource === 'database' && this.confirmed && !this.loading;
        },
        wrongbt() {
            return `/layout/images/wrong_button.png`; 
        },
        corrbt(){
            return `/layout/images/correct_button.png`; 
        }
    },

    methods: {
        async confirmSelection() {
            try {
                if (this.selectedSource === 'local' && this.csvFile) {
                    await this.importCSV(this.csvFile);
                } else if (this.selectedSource === 'database') {
                    await this.fetchDataFromDatabase();
                }

                this.loading = true;
                this.requestStartTime = performance.now();

                const response = await axios.post('http://localhost:5000/predict');

                this.requestEndTime = performance.now();

                if (response.status === 200) {
                    this.prediction = response.data.prediction;
                    this.predictionText = this.prediction === 0 ? '損壞' : '良好'; // 根據預測結果設置對應的文字
                    this.predictionTime = this.requestEndTime - this.requestStartTime;
                } else {
                    console.error('意外的回應狀態:', response.status);
                }
            } catch (error) {
                console.error('取得預測結果時發生錯誤:', error);
            } finally {
                this.loading = false;
            }
        },

        async fetchDataFromDatabase() {
            try {
                const response = await axios.get(`${apiBaseUrl}/vibration`);
                this.databaseResults = response.data;
                this.confirmed = true;
                this.updateChart();
            } catch (error) {
                console.error('從資料庫取得資料時發生錯誤:', error);
            }
        },

        importCSV(file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const csv = e.target.result;
                const rows = csv.split('\n');
                const headers = rows[0].split(',');
                const data = [];

                const timeIndex = headers.findIndex((header) => header.trim().toLowerCase() === 'time');
                const xIndex = headers.findIndex((header) => header.trim().toLowerCase() === 'x');
                const yIndex = headers.findIndex((header) => header.trim().toLowerCase() === 'y');
                const zIndex = headers.findIndex((header) => header.trim().toLowerCase() === 'z');

                for (let i = 1; i < rows.length; i++) {
                    const row = rows[i].split(',');
                    if (row.length === headers.length) {
                        const obj = {};
                        obj.Time = parseFloat(row[timeIndex].trim());
                        obj.X = parseFloat(row[xIndex].trim());
                        obj.Y = parseFloat(row[yIndex].trim());
                        obj.Z = parseFloat(row[zIndex].trim());
                        data.push(obj);
                    }
                }

                this.csvData = data;
                this.confirmed = true;
                this.updateChart();
            };
            reader.readAsText(file);
        },

        handleFileUpload(event) {
            this.csvFile = event.target.files[0];
        },

        selectSource(source) {
            this.selectedSource = source;
            this.confirmed = false;
        },

        clearSelection() {
            this.selectedSource = '';
            this.csvFile = null;
            this.databaseResults = [];
            this.csvData = [];
            this.confirmed = false;
            this.destroyChart();
            this.prediction = null;
            this.predictionTime = 0;
        },

        destroyChart() {
            if (this.chart) {
                this.chart.destroy();
                this.chart = null;
            }
        },

        updateChart() {
            if (this.chart) {
                this.chart.destroy();
            }

            const ctx = this.$refs.myChart.getContext('2d');
            this.chart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: this.selectedSource === 'database' ? this.databaseResults.map((item) => item.Time) : this.csvData.map((item) => item.Time),
                    datasets: [
                        {
                            label: 'X',
                            data: this.showX && this.selectedSource === 'database' ? this.databaseResults.map((item) => parseFloat(item.X)) : this.showX ? this.csvData.map((item) => parseFloat(item.X)) : [],
                            borderColor: 'red',
                            backgroundColor: 'rgba(255, 0, 0, 0.1)',
                            fill: false,
                            hidden: !this.showX
                        },
                        {
                            label: 'Y',
                            data: this.showY && this.selectedSource === 'database' ? this.databaseResults.map((item) => parseFloat(item.Y)) : this.showY ? this.csvData.map((item) => parseFloat(item.Y)) : [],
                            borderColor: 'green',
                            backgroundColor: 'rgba(0, 255, 0, 0.1)',
                            fill: false,
                            hidden: !this.showY
                        },
                        {
                            label: 'Z',
                            data: this.showZ && this.selectedSource === 'database' ? this.databaseResults.map((item) => parseFloat(item.Z)) : this.showZ ? this.csvData.map((item) => parseFloat(item.Z)) : [],
                            borderColor: 'blue',
                            backgroundColor: 'rgba(0, 0, 255, 0.1)',
                            fill: false,
                            hidden: !this.showZ
                        }
                    ]
                },
                options: {
                    responsive: true,
                    plugins: {
                        title: {
                            display: true
                        }
                    }
                }
            });
        }
    },

    mounted() {
        const ctx = this.$refs.myChart.getContext('2d');
        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [''],
                datasets: [
                    {
                        label: 'X',
                        data: [],
                        borderColor: 'red',
                        backgroundColor: 'rgba(255, 0, 0, 0.1)',
                        fill: false
                    },
                    {
                        label: 'Y',
                        data: [],
                        borderColor: 'green',
                        backgroundColor: 'rgba(0, 255, 0, 0.1)',
                        fill: false
                    },
                    {
                        label: 'Z',
                        data: [],
                        borderColor: 'blue',
                        backgroundColor: 'rgba(0, 0, 255, 0.1)',
                        fill: false
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true
                    }
                }
            }
        });
    },

    unmounted() {
        if (this.chart) {
            this.chart.destroy();
            this.chart = null;
        }
    }
};
</script>

<template>
    <div class="template-wrapper">
        <!--折線圖-->
        <div class="card" style="flex: 1">
            <h2>振動數據</h2>
            <canvas id="myChart" ref="myChart" style="width: 100%; height: 100px"></canvas>
            <div class="checkboxes">
                <label>
                    <Checkbox v-model="showX" :binary="true" @change="updateChart" />
                    X軸
                </label>
                <label>
                    <Checkbox v-model="showY" :binary="true" @change="updateChart" />
                    Y軸
                </label>
                <label>
                    <Checkbox v-model="showZ" :binary="true" @change="updateChart" />
                    Z軸
                </label>
            </div>
        </div>

        <div class="flex-container">
            <!-- 選擇資料來源面板 -->
            <div class="card" style="flex: 1">
                <p v-if="confirmed">已確定選擇: {{ selectedSource }}</p>
                <p v-else>請選擇資料來源後再點擊「確定」按鈕</p>

                <div class="radio-button-group">
                    <div class="radio-button">
                        <RadioButton v-model="selectedSource" inputId="database" name="source" value="database" @change="selectSource('database')" />
                        <label for="database" class="ml-2">使用資料庫來源</label>
                    </div>

                    <div class="radio-button">
                        <RadioButton v-model="selectedSource" inputId="local" name="source" value="local" @change="selectSource('local')" />
                        <label for="local" class="ml-2">使用本機端</label>
                    </div>
                </div>

                <div class="file-upload" v-if="selectedSource === 'local'">
                    <input type="file" @change="handleFileUpload" accept=".csv" />
                </div>

                <Button label="確定" :disabled="!canConfirm" @click="confirmSelection" />
            </div>

            <!-- 模型預測面板 -->
            <div class="card" style="flex: 1">
                <h2>AI預測結果</h2>
                <div class="prediction-result" style="height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center">
                    <p v-if="loading">正在加載...</p>
                    <div v-if="predictionText === '良好'" style="display: flex; align-items: center">
                        <img :src=corrbt alt="照片 A" style="width: 50px; height: 50px" />
                        <span style="margin-left: 5px; font-size: larger">良好</span>
                    </div>
                    <div v-else style="display: flex; align-items: center">
                        <img :src=wrongbt alt="照片 B" style="width: 50px; height: 50px" />
                        <span style="margin-left: 5px; font-size: larger">損壞</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- <Button label="發送請求" v-if="showPredictionButton" @click="performPrediction" /> -->
        <!--資料表-->
        <!-- <div class="card">
            <div v-if="selectedSource === 'database' && confirmed">
                <h3>從資料庫獲取的資料:</h3>
                <DataTable :value="databaseResults" paginator :rows="5" :rowsPerPageOptions="[5, 10, 20, 50]" tableStyle="min-width: 50rem">
                    <Column field="Time" header="Time"></Column>
                    <Column field="X" header="X"></Column>
                    <Column field="Y" header="Y"></Column>
                    <Column field="Z" header="Z"></Column>
                </DataTable>
            </div>

            <div v-if="selectedSource === 'local' && confirmed">
                <h3>本機端 CSV 資料:</h3>
                <DataTable :value="csv" paginator :rows="5" :rowsPerPageOptions="[5, 10, 20, 50]" tableStyle="min-width: 50rem">
                    <Column field="Time" header="Time"></Column>
                    <Column field="X" header="X"></Column>
                    <Column field="Y" header="Y"></Column>
                    <Column field="Z" header="Z"></Column>
                </DataTable>
            </div>
        </div> -->
        <Button label="清除選擇" severity="danger" outlined @click="clearSelection" />
    </div>
</template>

<style scoped>
.checkboxes {
    margin-bottom: 10px;
}

.radio-button {
    margin-bottom: 5px;
}

.template-wrapper {
    height: 100 vh; /* 設置固定高度 */
    overflow: hidden; /* 隱藏溢出的內容 */
}

.flex-container {
    display: flex;
    flex-direction: row; /* 水平排列 */
    justify-content: space-between; /* 左右對齊 */
}
</style>
