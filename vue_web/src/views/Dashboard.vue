<script setup>
import { onMounted, reactive, ref, watch } from 'vue';
import { useLayout } from '@/layout/composables/layout';
import axios from 'axios';
import ShowData from './utilities/Showdata.vue';
import Papa from 'papaparse';

const pic_path = '../layout/images/';
const { isDarkTheme } = useLayout();
const apiBaseUrl = 'http://192.168.123.235:3000';
const products = ref(null);
const items = ref([
    { label: 'Add New', icon: 'pi pi-fw pi-plus' },
    { label: 'Remove', icon: 'pi pi-fw pi-minus' }
]);
const lineOptions = ref(null);
const displayConfirmation = ref(false);
const notes = ref([]);
let sin_pro = ref(123);
const categoryCounts = ref({
  operation: 0,
  latest: 0,
});
//拿取資料庫資料

//高低異常值預設
let maxLimit = ref(70);
let minLimit = ref(20);
let rangevalue = ref([minLimit.value, maxLimit.value]);

onMounted(() => {
    fetcDailynote();
    fetchProducts();
    applyTheme();
});

const fetchProducts = async () => {
  try {
    const response = await axios.get(`${apiBaseUrl}/product`);
    products.value = response.data;
    //console.log("take", products.value);
  } catch (error) {
    console.error('Error fetching profiles:', error);
  } 
};
const fetcDailynote = async () => {
  try {
    loading.value = true;
    const responses = await axios.get(`${apiBaseUrl}/daily_note`);
    notes.value = responses.data.filter(note => note.shown === 1);

    const operationCount = notes.value.filter(note => note.category === 'operation').length;
    const latestCount = notes.value.filter(note => note.category === 'repair' || note.category === 'question').length;
    
    categoryCounts.value = {
        operation: operationCount,
        latest: latestCount,
    };

    //console.log("note", notes.value);
  } catch (error) {
    console.error('Error fetching profiles:', error);
  } finally {
     loading.value = false; // Set loading to false after the request
  }
};

const applyLightTheme = () => {
    lineOptions.value = {
        plugins: {
            legend: {
                labels: {
                    color: '#495057'
                }
            },
            annotation: {
                annotations: {
                    maxLine: {
                        type: 'line',
                        yMin: maxLimit.value,
                        yMax: maxLimit.value,
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
                        yMin: minLimit.value,
                        yMax: minLimit.value,
                        borderColor: '#28FF28',
                        borderWidth: 2,
                        label: {
                            content: 'Min Limit',
                            enabled: true,
                            position: 'center'
                        }
                    }
                }
            },
        },
        scales: {
            x: {
                ticks: {
                    color: '#495057'
                },
                grid: {
                    color: '#ebedef'
                }
            },
            y: {
                ticks: {
                    color: '#495057'
                },
                grid: {
                    color: '#ebedef'
                }
            }
        }
    };
};

const applyDarkTheme = () => {
    lineOptions.value = {
        plugins: {
            legend: {
                labels: {
                    color: '#ebedef'
                }
            },
            annotation: {
                annotations: {
                    maxLine: {
                        type: 'line',
                        yMin: maxLimit.value,
                        yMax: maxLimit.value,
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
                        yMin: minLimit.value,
                        yMax: minLimit.value,
                        borderColor: '#28FF28',
                        borderWidth: 2,
                        label: {
                            content: 'Min Limit',
                            enabled: true,
                            position: 'center'
                        }
                    }
                }
            },
        },
        scales: {
            x: {
                ticks: {
                    color: '#ebedef'
                },
                grid: {
                    color: 'rgba(160, 167, 181, .3)'
                }
            },
            y: {
                ticks: {
                    color: '#ebedef'
                },
                grid: {
                    color: 'rgba(160, 167, 181, .3)'
                }
            }
        }
    };
};

const closeConfirmation = () => {
    displayConfirmation.value = false;
};
const openConfirmation = (data) => {
    sin_pro.value = data;
    console.log("sin",sin_pro)
    console.log("open", data);
    displayConfirmation.value = true;
    
};
const getIconClass = (category) => {
    switch (category) {
        case 'repair':
            return { iconClass: 'pi pi-wrench', bgColor: 'bg-blue-100', textColor: 'text-blue-500' };
        case 'question':
            return { iconClass: 'pi pi-question', bgColor: 'bg-red-100', textColor: 'text-red-500' };
        default:
            return { iconClass: 'pi pi-info-circle', bgColor: 'bg-gray-100', textColor: 'text-gray-500' };
    }
};

// Monitor functionality
let chartData = {
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
};

let chartOptions = {
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
                mode: 'x', // Zoom on the x-axis
            },
            pan: {
                enabled: true,
                mode: 'x' // Pan on the x-axis
            }
        },
        annotation: {
            annotations: {
              maxLine: {
                type: 'line',
                yMin: maxLimit.value, // 设置您的最高标准值
                yMax: maxLimit.value,
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
                yMin: minLimit.value, // 设置您的最低标准值
                yMax: minLimit.value,
                borderColor: '#28FF28',
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
};
let parsedJsonData = ref(null); // Add this data property to store parsed JSON data
let loading = ref(false); // Add this data property for loading state
let loadingData = ref(false);
let intervalId = ref(null);
let connectionTime = ref('00:00');
let connectionInterval = ref(null);
let elapsedSeconds = ref(0);

const applyTheme = () => {
    if (isDarkTheme.value) {
        applyDarkTheme();
    } else {
        applyLightTheme();
    }
};

const updateChartData = (data) => {
  const labels = data.map((_, index) => (index + 1).toString());
  const xValues = data.map(row => parseFloat(row['X']));
  const yValues = data.map(row => parseFloat(row['Y']));
  const zValues = data.map(row => parseFloat(row['Z']));

//   chartData.labels = [...labels];
//   chartData.datasets[0].data = [...xValues];
//   chartData.datasets[1].data = [...yValues];
//   chartData.datasets[2].data = [...zValues];
    chartData = {
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

//   console.log(" label: ", chartData.labels);
//   console.log(" x: ", chartData.datasets[0].data);
//   console.log(" y: ", chartData.datasets[1].data);
//   console.log(" z: ", chartData.datasets[2].data);
};
//感測器震動數據

const fetchData = async () => {
    try {
        const responsevib = await axios.get(`${apiBaseUrl}/vib`);
        const data = responsevib.data;
        parsedJsonData.value = data;
        updateChartData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
};

const connect = () => {
    if (elapsedSeconds.value === 0) {
        connectionTime.value = '00:00';
    }
    loadingData.value = true;
    fetchData(); // Fetch initial data
    intervalId.value = setInterval(fetchData, 5000); // Fetch data every 5 seconds
    startConnectionTimer();
    console.log('連接中');
};

const disconnect = () => {
   
    if (intervalId.value) {
        clearInterval(intervalId.value);
        intervalId.value = null;
    }
    if (connectionInterval.value) {
        clearInterval(connectionInterval.value);
        connectionInterval.value = null;
    }
    loadingData.value = false;
    console.log('斷開連結');
    
};

const clear = () => {
    elapsedSeconds.value = 0;
    connectionTime.value = '00:00';
    if (intervalId.value) {
        clearInterval(intervalId.value);
        intervalId.value = null;
    }
    if (connectionInterval.value) {
        clearInterval(connectionInterval.value);
        connectionInterval.value = null;
    }
    parsedJsonData.value = null;
    // chartData.value.labels = [];
    // chartData.value.datasets.forEach(dataset => dataset.data = []);
    chartData = {
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
    loadingData.value = false;
    console.log('清除紀錄');
}

//時間
const startConnectionTimer = () => {
    if (connectionInterval.value) {
        clearInterval(connectionInterval.value);
    }
    connectionInterval.value = setInterval(() => {
        elapsedSeconds.value++;
        const minutes = Math.floor(elapsedSeconds.value / 60);
        const displaySeconds = elapsedSeconds.value % 60;
        connectionTime.value = `${pad(minutes)}:${pad(displaySeconds)}`;
    }, 1000);
};

const pad = (num) => {
    return num.toString().padStart(2, '0');
}
watch(rangevalue, (newValue) => {
    chartOptions.plugins.annotation.annotations.maxLine.yMin = newValue[1];
    chartOptions.plugins.annotation.annotations.maxLine.yMax = newValue[1];
    chartOptions.plugins.annotation.annotations.minLine.yMin = newValue[0];
    chartOptions.plugins.annotation.annotations.minLine.yMax = newValue[0];
    applyTheme();
});

</script>

<template>
    <div class="grid">
        <div class="col-12 xl:col-6">
            <div class="card">
                <h5><b>產品   Prodoct</b></h5>
                <DataTable :value="products" :rows="5" :paginator="true" responsiveLayout="scroll">
                    <Column field="p_name" header="產品編號" :sortable="true" style="width: 25%">
                        <template #body="slotProps">
                            {{ slotProps.data.p_name }}
                        </template>
                    </Column>
                    <Column field="p_category" header="類別" :sortable="true" style="width: 15%">
                        <template #body="slotProps">
                            {{ slotProps.data.p_category }}
                        </template>
                    </Column>
                    <Column style="width: 15%">
                        <template #header> 示意圖 </template>
                        <template #body="slotProps">
                          <!-- <img :src="`${pic_path}/${slotProps.data.image_path}`" :alt="slotProps.data.p_name" width="50" class="shadow-2" /> -->
                           <img :src="`${pic_path}/${slotProps.data.p_name}.JPG`" :alt="slotProps.data.p_name" width="50" class="shadow-2" />
                        </template>
                    </Column>
                     <Column style="width: 5%">
                        <template #header> 查看 </template>
                        <template #body="slotProps">
                            <Button icon="pi pi-search" type="button" class="p-button-text" @click="openConfirmation(slotProps.data)"></Button>
                        </template>
                    </Column>
                </DataTable>
                
            </div>

            <div class="card">
                <div class="flex justify-content-between align-items-center mb-5">
                    <h5><b>模型 Model</b></h5>
                    <!-- <div>
                        <Button icon="pi pi-ellipsis-v" class="p-button-text p-button-plain p-button-rounded" @click="$refs.menu2.toggle($event)"></Button>
                        <Menu ref="menu2" :popup="true" :model="items"></Menu>
                    </div> -->
                </div>
                <ul class="list-none p-0 m-0">
                    
                    <li class="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                        <div>
                            <span class="text-900 font-medium mr-2 mb-1 md:mb-0">SVM</span>
                            <div class="mt-1 text-600">支持向量機</div>
                        </div>
                        <div class="mt-2 md:mt-0 ml-0 md:ml-8 flex align-items-center">
                            <div class="surface-300 border-round overflow-hidden w-10rem lg:w-6rem" style="height: 8px">
                                <div class="bg-cyan-500 h-full" style="width: 85%"></div>
                            </div>
                            <span class="text-cyan-500 ml-3 font-medium">%85</span>
                        </div>
                    </li>
                    <li class="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                        <div>
                            <span class="text-900 font-medium mr-2 mb-1 md:mb-0">CNN</span>
                            <div class="mt-1 text-600">捲積神經網路</div>
                        </div>
                        <div class="mt-2 md:mt-0 ml-0 md:ml-8 flex align-items-center">
                            <div class="surface-300 border-round overflow-hidden w-10rem lg:w-6rem" style="height: 8px">
                                <div class="bg-pink-500 h-full" style="width: 67%"></div>
                            </div>
                            <span class="text-pink-500 ml-3 font-medium">%67</span>
                        </div>
                    </li>
                    
                    <li class="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                        <div>
                            <span class="text-900 font-medium mr-2 mb-1 md:mb-0">Random Forest</span>
                            <div class="mt-1 text-600">隨機森林</div>
                        </div>
                        <div class="mt-2 md:mt-0 ml-0 md:ml-8 flex align-items-center">
                            <div class="surface-300 border-round overflow-hidden w-10rem lg:w-6rem" style="height: 8px">
                                <div class="bg-purple-500 h-full" style="width: 75%"></div>
                            </div>
                            <span class="text-purple-500 ml-3 font-medium">%75</span>
                        </div>
                    </li>

                </ul>
            </div>
        </div>

        <div class="col-12 xl:col-6">
            <div class="card">
                <div>
                    <div class="card-header">
                        <h4><b>振動數據</b></h4>
                        <div v-if="!loadingData" class="connection-time">
                        <p>連接已關閉 {{ connectionTime }}</p>
                        </div>
                        <div v-if="loadingData" class="connection-time">
                        <p>連接中 {{ connectionTime }}</p>
                        </div>
                    </div>

                   <ShowData :data="chartData " :options="chartOptions" />             
                    <br />
                    
                </div>
             <br />
            <!-- <div class="flex justify-content-between mb-3">    
                <br />       -->
               <div class="flex align-items-center">
                    <div class = "buttongp">
                        <ButtonGroup>
                            <Button
                            label="Connect"
                            size="small"
                            style="width: 90px; height: 25px; font-size: 12px;"
                            class="mr-2 mb-2"
                            icon="pi pi-share-alt"
                            :loading="loadingData"
                            @click="connect"
                            />
                            <Button
                            label="Disable"
                            size="small"
                            style="width: 90px; height: 25px; font-size: 13px;"
                            class="mr-2 mb-2"
                            icon="pi pi-times"
                            @click="disconnect"
                            />
                            <Button
                            label="Clear"
                            size="small"
                            style="width: 90px; height: 25px; font-size: 13px;"
                            class="mr-2 mb-2"
                            icon="pi pi-eraser"
                            :disabled="loadingData"
                            @click="clear"
                            />
                        </ButtonGroup>
                    </div>
                    <div class ="rangebox">  
                        <InputText v-model.number="rangevalue" class="w-full mb-4" />
                        <Slider v-model="rangevalue"  range class="w-full" :min="-50" :max="500" />                  
                    </div>
               </div>
<!-- 
            </div> -->

            </div>
                    
            <div class="card">
                <div class="flex align-items-center justify-content-between mb-4">
                    <h5><b>通知事項 Notification</b></h5>
                </div>

                <span class="block text-600 font-medium mb-3">近期</span>
                <ul class="p-0 mx-0 mt-0 mb-4 list-none">
                    <li v-if="!loading && categoryCounts.latest === 0 " class="flex align-items-center py-2 border-bottom-1 surface-border">
                    <div class="w-3rem h-3rem flex align-items-center justify-content-center bg-purple-100 border-circle mr-3 flex-shrink-0">
                        <i class="pi pi-info-circle text-xl text-purple-500"></i>
                    </div>
                    <span class="text-900 line-height-3">
                        <span class="text-700">No notifications now</span>
                    </span>
                    </li>
                    <li v-for="note in notes.filter(n => n.category !== 'operation')" :key="note.createtime" class="flex align-items-center py-2 border-bottom-1 surface-border">
                    <div :class="getIconClass(note.category).bgColor + ' w-3rem h-3rem flex align-items-center justify-content-center border-circle mr-3 flex-shrink-0'">
                        <i :class="getIconClass(note.category).iconClass + ' text-xl ' + getIconClass(note.category).textColor"></i>
                    </div>
                    <span class="text-900 line-height-3">
                        <span class="text-700">{{ note.content }}</span>
                    </span>
                    </li>
                </ul>

                <span class="block text-600 font-medium mb-3 ">操作手冊</span>
                <ul class="p-0 m-0 list-none">
                    <li v-if="!loading && categoryCounts.operation === 0 " class="flex align-items-center py-2 border-bottom-1 surface-border">
                    <div class="w-3rem h-3rem flex align-items-center justify-content-center bg-purple-100 border-circle mr-3 flex-shrink-0">
                        <i class="pi pi-info-circle text-xl text-purple-500"></i>
                    </div>
                    <span class="text-900 line-height-3">
                        <span class="text-700">No notifications now</span>
                    </span>
                    </li>
                    <li v-for="note in notes.filter(n => n.category === 'operation')" :key="note.createtime" class="flex align-items-center py-2 border-bottom-1 surface-border">
                    <div class="w-3rem h-3rem flex align-items-center justify-content-center bg-orange-100 border-circle mr-3 flex-shrink-0">
                        <i class="pi pi-book text-xl text-orange-500"></i>
                    </div>
                    <span class="text-900 line-height-3">
                        <span class="text-700">{{ note.content }}</span>
                    </span>
                    </li>
                </ul>
            </div>
           
        </div>
    </div>
        <Dialog :header="sin_pro.p_name"  v-model:visible="displayConfirmation" :style="{ width: '700px' }" :modal="true">
            <div class="flex align-items-center justify-content-center">
                <div>                    
                    <!-- <p style="font-size: 2.5rem">  <b>{{ sin_pro.p_name }}</b></p> -->
                    <p>  產品名稱:   {{ sin_pro.p_name }}</p>
                    <p>  產品類別:   {{ sin_pro.p_category }}</p>
                    <p>  相關資訊:   {{ sin_pro.p_info }}</p>
                    <img :src="`${pic_path}/${sin_pro.p_name}.JPG`" :alt="sin_pro.p_name" width="100" class="shadow-2" />  
                </div>
            </div>
        </Dialog>

        <Dialog header=" " :visible="loading" modal :closable="false">
            <div class="p-3 text-center">
                <ProgressSpinner />
                <p class="mt-3">Loading...</p>
            </div>
        </Dialog>

</template>
<style scoped>

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
.rangebox {
    max-width: 30%;
    margin-left:25px;
    
}
.buttongp{
     margin-left:20px;
}
</style>
