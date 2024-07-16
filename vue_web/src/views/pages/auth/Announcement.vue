<template>
  <div class="flex justify-content-center align-items-center">
      <div class="col-12 xl:col-8 ">
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
            <li v-for="note in shownotes.filter(n => n.category !== 'operation')" :key="note.createtime" class="flex align-items-center py-2 border-bottom-1 surface-border">
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
            <li v-for="note in shownotes.filter(n => n.category === 'operation')" :key="note.createtime" class="flex align-items-center py-2 border-bottom-1 surface-border">
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

  <div class="grid">
    <div class="col-12">
      <div class="card">
        <h5><b>搜尋表</b></h5>
        <DataTable
          :value="notes"
          :paginator="true"
          :rows="15"
          dataKey="createtime"
          :rowHover="true"
           v-model:filters="filters1"
          filterDisplay="menu"
          :loading="loading1"
          :globalFilterFields="['category', 'createtime', 'content']"
          showGridlines
        >
         <template #header>
            <div class="flex justify-content-between flex-column sm:flex-row">
              <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter1()" />
              <IconField iconPosition="left">
                <InputIcon class="pi pi-search" />
                <InputText v-model="filters1['global'].value" placeholder="關鍵字搜尋" style="width: 100%" />
              </IconField>
              <Button type="button" icon="pi pi-plus" @click="showModal = true" />
            </div>
          </template>

          <template #empty> 無宣布任何通知 </template>
          <template #loading> Loading data ... Please wait. </template>

          <Column header="修改日期" field="createtime" style="min-width: 10rem" sortable>
            <template #body="{ data }">
              {{ formatDateTime(data.createtime) }}
            </template>
            <template #filter>
              <div class="flex align-items-center">
                <InputText type="text" v-model="filters1['createtime'].constraints[0].value" placeholder="關鍵字搜尋" style="width: 100%" />
                <Button type="button" icon="pi pi-sort-alt" class="ml-2" @click="toggleSortOrder()" />
              </div>
            </template>
          </Column>

          <Column header="類別" field="category" :showFilterMatchModes="false" :filterMenuStyle="{ width: '8rem' }" bodyClass="text-center" style="min-width: 4rem">
            <template #body="{ data }">
              <Tag :severity="getSeverity(data.category)">{{ data.category ? data.category.toUpperCase() : '' }}</Tag>
            </template>
            <template #filter="{ filterModel }">
              <MultiSelect v-model="filterModel.value" :options="statuses" placeholder="Any" class="p-column-filter" />
            </template>
          </Column>

          <Column header="內容" field="content" style="min-width: 14rem">
            <template #body="{ data }">
              <span>{{ data.content }}</span>
            </template>
            <template #filter="{ filterModel }">
              <InputText type="text" v-model="filterModel.value" class="p-column-filter"  placeholder="關鍵字搜尋" />
            </template>
          </Column>

          <Column header="公布" field="Shown" style="min-width: 5rem">
            <template #body="{ data }">
                <div v-if="data.shown === 1">
                    <Button type="button" icon="pi pi-eye text-green-500"  @click="toggleVisibility(data)" text rounded/>  
                </div>
               <div v-else>
                   <Button type="button" icon="pi pi-eye-slash text-gray-500"  @click="toggleVisibility(data)" text rounded/> 
               </div>
            </template>
          </Column>

          <Column header="編輯" bodyClass="text-center" style="min-width: 4rem">
            <template #body="{ data }">
              <Button icon="pi pi-pencil text-green-500" @click="editNotify(data)" text rounded />
            </template>
          </Column>

          <Column header="刪除" bodyClass="text-center" style="min-width: 4rem">
            <template #body="{ data }">
              <Button icon="pi pi-trash text-red-500" @click="openConfirmation(data)" text rounded />
            </template>
          </Column>
        </DataTable>
      </div>
    </div>
  </div>

  <Dialog header="刪除" v-model:visible="displayConfirmation" :style="{ width: '300px' }" :modal="true">
    <div class="flex align-items-center justify-content-center">
      <div>
        <div>
          <i class="pi pi-exclamation-triangle mr-2" style="font-size: 1.5rem" />
          <span>是否刪除此通知 ?</span>
        </div>
        <p></p>
        <p>  類別: {{ dlpf.category }}</p>
        <p>  創建之時間: {{ dlpf.createtime }}</p>
        <p>  內容: {{ dlpf.content }}</p>
      </div>
    </div>
    <template #footer>
      <Button label="否" icon="pi pi-times" @click="closeConfirmation" class="p-button-text" />
      <Button label="是" icon="pi pi-check" @click="deleteNotify" class="p-button-text" />
    </template>
  </Dialog>

  <!-- Implementation -->
  <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
    <div class="modal">
      <div class="modal-header">
        <h3>新增公告</h3>
        <Button icon="pi pi-times" text class="mb-2 mr-2" @click="showModal = false" />
      </div>
      <div class="modal-body">
        <Addnotify @close="handleClose" @registered="fetchDailynote" />
      </div>
    </div>
  </div>

  <!-- showModalEdit Implementation -->
  <div v-if="showModalEdit" class="modal-overlay" @click.self="showModalEdit = false">
    <div class="modal">
      <div class="modal-header">
        <h3>編輯</h3>
        <Button icon="pi pi-times" text class="mb-2 mr-2" @click="showModalEdit = false" />
      </div>
      <div class="modal-body">
        <Editnotify :notifytData="selectedNotify" @close="handleClose" @registered="fetchDailynote" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeMount, reactive } from 'vue';
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import axios from 'axios';
import Addnotify from '../../utilities/Addnotify.vue';
import Editnotify from '../../utilities/Editnotify.vue';


const showModal = ref(false);
const showModalEdit = ref(false);
const selectedNotify = ref(null);
const displayConfirmation = ref(false);
const apiBaseUrl = 'http://192.168.123.235:3000';
const filters1 = ref(null);
const loading1 = ref(false);
const sortOrder = ref(null); // 追加：排序顺序，'asc' 或 'desc'
const statuses = reactive(['operation', 'repair', 'question']);
const loading = ref(false); // Add this data property for loading state
const notes = ref([]); // Add notes state
const shownotes = ref([]);
const categoryCounts = ref({
  operation: 0,
  latest: 0,
});
const dlpf = ref(null); // Add dlpf state

const getSeverity = (status) => {
  switch (status) {
    case 'question':
      return 'danger';
    case 'operation':
      return 'warning';
    case 'repair':
      return 'info';
    default:
      return 'success';
  }
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

const fetchDailynote = async () => {
  try {
    loading.value = true;
    const response = await axios.get(`${apiBaseUrl}/daily_note`);
    notes.value = response.data;
    shownotes.value = response.data.filter(note => note.shown === 1);

     // 计算不同类别的数量
    const operationCount = shownotes.value.filter(note => note.category === 'operation').length;
    const latestCount = shownotes.value.filter(note => note.category === 'repair' || note.category === 'question').length;

   //console.log("operationCount ",operationCount)
   //console.log("latestCount",latestCount)

    // 存储计算结果
    categoryCounts.value = {
      operation: operationCount,
      latest: latestCount,
    };

  } catch (error) {
    console.error('Error fetching notes:', error);
  } finally {
    loading.value = false; // Set loading to false after the request
  }
};

const debounce = (fn, delay) => {
  let timeoutID;
  return function (...args) {
    if (timeoutID) clearTimeout(timeoutID);
    timeoutID = setTimeout(() => {
      fn(...args);
    }, delay);
  };
};

const formatDateTime = (datetimeStr) => {
  const date = new Date(datetimeStr);
  return `${date.getFullYear()}-${padZero(date.getMonth() + 1)}-${padZero(date.getDate())} ` +
         `${padZero(date.getHours())}:${padZero(date.getMinutes())}:${padZero(date.getSeconds())}`;
};

const padZero = (num) => {
  return num < 10 ? '0' + num : num;
};


const handleClose = async () => {
  showModalEdit.value = false;
  showModal.value = false;
  await fetchDailynote(); // 更新後重新加載數據
};

const editNotify = (customer) => {
  selectedNotify.value = customer;
  //console.log(selectedNotify.value.createtime)
  showModalEdit.value = true;
};

const toggleSortOrder = () => {
  sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  fetchDailynote(); // 重新获取并排序数据
};

const toggleVisibility = async (note) => {
  const updatedNote = { ...note, shown: note.shown === 1 ? 0 : 1 };
  updatedNote.createtime = formatDateTime(note.createtime);
 
  try {
    await axios.put(`${apiBaseUrl}/daily_note/${updatedNote.createtime}`,updatedNote);
     //console.log("GG ",updatedNote.createtime)
     console.log(`${apiBaseUrl}/daily_note/${updatedNote.createtime}`)
    await fetchDailynote(); // 更新後重新加載數據
  } catch (error) {
    console.error('Error updating visibility:', error);
  }
};

onBeforeMount(() => {
  initFilters1();
  fetchDailynote();
});

const initFilters1 = () => {
 filters1.value = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    category: { value: null, matchMode: FilterMatchMode.IN },
    createtime: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    content: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
  };
};

const clearFilter1 = () => {
  initFilters1();
};

const deleteNotify = async () => {
  try {
    await axios.delete(`${apiBaseUrl}/notify/${dlpf.value.createtime}`);
    fetchDailynote();
  } catch (error) {
    console.error('Error deleting profile:', error);
  }
  console.log(dlpf.value.createtime,"刪除成功")
  closeConfirmation();
};

const closeConfirmation = () => {
  displayConfirmation.value = false;
};

const openConfirmation = (notify) => {
  dlpf.value = notify;
  dlpf.value.createtime = formatDateTime(notify.createtime);
  displayConfirmation.value = true;
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background: #fff;
  padding: 20px;
  border-radius: 20px;
  width: 50%;
  max-width: 500px;
  max-height: 80%;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ddd;
  margin-bottom: 15px;
}

.modal-body {
  padding: 10px 0;
}
</style>
