<script setup>
import { ref, watch } from 'vue';
import { useLayout } from '@/layout/composables/layout';

const { layoutConfig } = useLayout();
let documentStyle = getComputedStyle(document.documentElement);
let textColor = documentStyle.getPropertyValue('--text-color');
let textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
let textColorThird = documentStyle.getPropertyValue('--text-color-third');
let surfaceBorder = documentStyle.getPropertyValue('--surface-border');

const lineData = ref(null);
const pieData = ref(null);
const polarData = ref(null);
const barData = ref(null);
const radarData = ref(null);

const lineOptions = ref(null);
const pieOptions = ref(null);
const polarOptions = ref(null);
const barOptions = ref(null);
const radarOptions = ref(null);

const setColorOptions = () => {
    documentStyle = getComputedStyle(document.documentElement);
    textColor = documentStyle.getPropertyValue('--text-color');
    textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    surfaceBorder = documentStyle.getPropertyValue('--surface-border');
};

const generateLabels = (maxValue, step) => {
    const labels = [];
    for (let i = 0; i <= maxValue; i += step) {
        labels.push(`${i}`);
    }
    return labels;
};

const setChart = () => {

    const dynamicLabels = generateLabels(25000, 2500);
    barData.value = {
        labels: dynamicLabels,
        datasets: [
            {
                label: 'X',
                backgroundColor: documentStyle.getPropertyValue('--primary-900'),
                borderColor: documentStyle.getPropertyValue('--primary-900'),
                data: Array.from({ length: dynamicLabels.length }, () => Math.floor(Math.random() * 100))
            },
            {
                label: 'Y',
                backgroundColor: documentStyle.getPropertyValue('--primary-500'),
                borderColor: documentStyle.getPropertyValue('--primary-500'),
                data: Array.from({ length: dynamicLabels.length }, () => Math.floor(Math.random() * 100))
            },
            {
                label: 'Z',
                backgroundColor: documentStyle.getPropertyValue('--primary-200'),
                borderColor: documentStyle.getPropertyValue('--primary-200'),
                data: Array.from({ length: dynamicLabels.length }, () => Math.floor(Math.random() * 100))
            }
        ]
    };
    barOptions.value = {
        plugins: {
            legend: {
                labels: {
                    fontColor: textColor
                }
            }
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Amp',
                    color: textColor
                },
                ticks: {
                    color: textColorSecondary,
                    font: {
                        weight: 500
                    }
                },
                grid: {
                    display: false,
                    drawBorder: false
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'db',
                    color: textColor
                },
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder,
                    drawBorder: false
                }
            }
        }
    };

    pieData.value = {
        labels: ['A', 'B'],
        datasets: [
            {
                data: [540, 325],
                backgroundColor: [documentStyle.getPropertyValue('--indigo-500'), documentStyle.getPropertyValue('--purple-500'), documentStyle.getPropertyValue('--teal-500')],
                hoverBackgroundColor: [documentStyle.getPropertyValue('--indigo-400'), documentStyle.getPropertyValue('--purple-400'), documentStyle.getPropertyValue('--teal-400')]
            }
        ]
    };

    pieOptions.value = {
        plugins: {
            legend: {
                labels: {
                    usePointStyle: true,
                    color: textColor
                }
            }
        }
    };

    lineData.value = {
        labels: ['0s', '1s', '2s', '3s', '4s', '5s', '6s', '7s', '8s', '9s', '10s'], // 少量的標籤
        datasets: [
            {
                label: 'X',
                data: Array.from({ length: 1000 }, () => Math.floor(Math.random() * 100 * (-1))), // 生成一組隨機振幅數據，範圍為 0 到 100
                fill: false,
                backgroundColor: documentStyle.getPropertyValue('--primary-900'),
                borderColor: documentStyle.getPropertyValue('--primary-900'),
                tension: 0.4,
                pointRadius: 1 // 資料點的半徑大小
            },
            {
                label: 'Y',
                data: Array.from({ length: 1000 }, () => Math.floor(Math.random() * 100 * (-1))), // 生成另一組隨機振幅數據，範圍為 0 到 100
                fill: false,
                backgroundColor: documentStyle.getPropertyValue('--primary-500'),
                borderColor: documentStyle.getPropertyValue('--primary-500'),
                tension: 0.4,
                pointRadius: 1 // 資料點的半徑大小
            },
            {
                label: 'Z',
                data: Array.from({ length: 1000 }, () => Math.floor(Math.random() * 100 * (-1))), // 生成另一組隨機振幅數據，範圍為 0 到 100
                fill: false,
                backgroundColor: documentStyle.getPropertyValue('--primary-200'),
                borderColor: documentStyle.getPropertyValue('--primary-200'),
                tension: 0.4,
                pointRadius: 1 // 資料點的半徑大小
            }
        ]
    };

    lineOptions.value = {
        plugins: {
            legend: {
                labels: {
                    fontColor: textColor
                }
            }
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Time (s)',
                    color: textColor
                },
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder,
                    drawBorder: false
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Amplitude',
                    color: textColor
                },
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder,
                    drawBorder: false
                }
            }
        }
    };



    polarData.value = {
        datasets: [
            {
                data: [11, 16, 7, 3],
                backgroundColor: [documentStyle.getPropertyValue('--indigo-500'), documentStyle.getPropertyValue('--purple-500'), documentStyle.getPropertyValue('--teal-500'), documentStyle.getPropertyValue('--orange-500')],
                label: 'My dataset'
            }
        ],
        labels: ['Indigo', 'Purple', 'Teal', 'Orange']
    };

    polarOptions.value = {
        plugins: {
            legend: {
                labels: {
                    color: textColor
                }
            }
        },
        scales: {
            r: {
                grid: {
                    color: surfaceBorder
                }
            }
        }
    };

    radarData.value = {
        labels: ['Eating', 'Drinking', 'Sleeping', 'Designing', 'Coding', 'Cycling', 'Running'],
        datasets: [
            {
                label: 'My First dataset',
                borderColor: documentStyle.getPropertyValue('--indigo-400'),
                pointBackgroundColor: documentStyle.getPropertyValue('--indigo-400'),
                pointBorderColor: documentStyle.getPropertyValue('--indigo-400'),
                pointHoverBackgroundColor: textColor,
                pointHoverBorderColor: documentStyle.getPropertyValue('--indigo-400'),
                data: [65, 59, 90, 81, 56, 55, 40]
            },
            {
                label: 'My Second dataset',
                borderColor: documentStyle.getPropertyValue('--purple-400'),
                pointBackgroundColor: documentStyle.getPropertyValue('--purple-400'),
                pointBorderColor: documentStyle.getPropertyValue('--purple-400'),
                pointHoverBackgroundColor: textColor,
                pointHoverBorderColor: documentStyle.getPropertyValue('--purple-400'),
                data: [28, 48, 40, 19, 96, 27, 100]
            }
        ]
    };

    radarOptions.value = {
        plugins: {
            legend: {
                labels: {
                    fontColor: textColor
                }
            }
        },
        scales: {
            r: {
                grid: {
                    color: textColorSecondary
                }
            }
        }
    };
};

watch(
    layoutConfig.theme,
    () => {
        setColorOptions();
        setChart();
    },
    { immediate: true }
);
</script>

<template>
    <div class="grid p-fluid">
        <div class="col-12 xl:col-6">
            <div class="card">
                <h5>時域圖_01</h5>
                <Chart type="line" :data="lineData" :options="lineOptions"></Chart>
            </div>
        </div>
        <div class="col-12 xl:col-6">
            <div class="card">
                <h5>頻域圖_01</h5>
                <Chart type="bar" :data="barData" :options="barOptions"></Chart>
            </div>
        </div>
        <div class="col-12 xl:col-6">
            <div class="card flex flex-column align-items-center">
                <h5 class="text-left w-full">Pie Chart</h5>
                <Chart type="pie" :data="pieData" :options="pieOptions"></Chart>
            </div>
        </div>
        <div class="col-12 xl:col-6">
            <div class="card flex flex-column">
                <h5 class="text-left w-full" >模型判斷結果</h5>
                <div class="flex justify-content-between align-items-center">
                    <div style="margin-left: 10%;border-radius:50px;opacity:0.8;width:100px;height:100px;background-color: #FFA500;">
                    </div>
                    <div class="status flex align-items-center" style="padding:10px">
                        <span style="padding:10px">狀態: </span>
                        <span>需維修</span>
                    </div>
                    <div class="classification" style="margin-right: 10%;">
                        <div class="flex align-items-center">
                            <div class="segment" data-range="81-100">81-100</div>
                            <div class="flex align-items-center" style="padding:10px">
                                <div>良好</div>
                            </div>
                        </div>
                        <div class="flex align-items-center">
                            <div class="segment" data-range="61-80">61-80</div>
                            <div class="flex align-items-center" style="padding:10px">
                                <div>正常</div>
                            </div>
                        </div>
                        <div class="flex align-items-center">
                            <div class="segment" data-range="41-60">41-60</div>
                            <div class="flex align-items-center" style="padding:10px">
                                <div>需維修</div>
                            </div>
                        </div>
                        <div class="flex align-items-center">
                            <div class="segment" data-range="21-40">21-40</div>
                            <div class="flex align-items-center" style="padding:10px">
                                <div>部分損壞</div>
                            </div>
                        </div>
                        <div class="flex align-items-center">
                            <div class="segment" data-range="0-20">0-20</div>
                            <div class="flex align-items-center" style="padding:10px">
                                <div>完全損壞</div>
                            </div>
                        </div>
                    </div>
                </div>
                <hr />
                <div class="pred-title flex justify-content-between align-items-center">
                    <div class="mt-4">
                        <h1>預測結果</h1>
                        <p>健康程度: 41~60 %</p>
                    </div>
                    <div class="mt-4">
                        <h1>建議動作</h1>
                        <p>設備異常，建議停機檢查</p>
                    </div>
                    <div></div>
                </div>
            </div>
        </div>
    </div>
</template>



<style scoped>
.status {
    font-size: 60px;
}

.segment {
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    font-weight: bold;
    font-size: 12px;
}

.segment.active {
    box-shadow: inset 0 0 0 3px white;
}

/* 顏色定義 */
.segment[data-range="81-100"] {
    background-color: #00A8FF;
    border-radius: 10px;
    opacity: 0.8;
    width: 80px;
    height: 30px;
}

.segment[data-range="61-80"] {
    background-color: #7cfc00;
    border-radius: 10px;
    opacity: 0.8;
    width: 80px;
    height: 30px;
}

.segment[data-range="41-60"] {
    background-color: #FFA500;
    border-radius: 10px;
    opacity: 0.8;
    width: 80px;
    height: 30px;
}

.segment[data-range="21-40"] {
    background-color: #FF0000;
    border-radius: 10px;
    opacity: 0.8;
    width: 80px;
    height: 30px;
}

.segment[data-range="0-20"] {
    background-color: #000000;
    border-radius: 10px;
    opacity: 0.8;
    width: 80px;
    height: 30px;
}

.pred-title {
    font-size: 20px;
    align-items: center;
}
</style>