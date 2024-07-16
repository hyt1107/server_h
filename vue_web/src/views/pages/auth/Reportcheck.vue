<template>
  <div class="grid">
    <div class="col-12">
      <div class="card">
        <h5><b>表單</b></h5>
        <DataTable
          :value="customer1"
          :paginator="true"
          :rows="15"
          dataKey="Num"
          :rowHover="true"
          v-model:filters="filters1"
          filterDisplay="menu"
          :loading="loading1"
          :filters="filters1"
          :globalFilterFields="['AccountID', 'Email', 'Date','Content']"
          :sortField="sortField"
          :sortOrder="sortOrder"
          @sort="onSort"
          showGridlines
        >
          <template #header>
            <div class="flex justify-content-between flex-column sm:flex-row">
              <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter1()" />
              <IconField iconPosition="left">
                <InputIcon class="pi pi-search" />
                <InputText v-model="filters1['global'].value" placeholder="關鍵字搜尋" style="width: 100%" />
              </IconField>
            </div>
          </template>

          <template #empty> 無此資訊 </template>
          <template #loading> Loading data ... Please wait. </template>

         <Column header="工號" field="AccountID" style="min-width: 10rem" sortable>
            <template #body="{ data }">
                {{ data.AccountID }}
            </template>
            <template #filter>
                <div class="flex align-items-center">
                <InputText type="text" v-model="filters1['AccountID'].constraints[0].value" class="p-column-filter" placeholder="Search by AccountID" />
                <Button type="button" icon="pi pi-sort-alt" class="ml-2" @click="toggleSortOrder('AccountID')" />
                </div>
            </template>
        </Column>


          <Column header="日期" field="Date" style="min-width: 4rem" sortable>
            <template #body="{ data }">
               <span>{{ formatDateTime(data.Date) }}</span>
            </template>
            <template #filter>
              <div class="flex align-items-center">
                <InputText type="text" v-model="filters1['Date'].constraints[0].value" class="p-column-filter" placeholder="Search by Date" />
                <Button type="button" icon="pi pi-sort-alt" class="ml-2" @click="toggleSortOrder('Date')" />
              </div>
            </template>
          </Column>

          <Column header="Email" field="Email" style="min-width: 14rem" >
            <template #body="{ data }">
              <span>{{ data.Email }}</span>
            </template>
            <template #filter="{ filterModel }">
              <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Search by Email" />
            </template>
          </Column>

          <Column header="內容" field="Content"  bodyClass="text-center" style="min-width: 14rem" >
            <template #body="{ data }">
              <span>{{ data.Content }}</span>
            </template>
            <template #filter="{ filterModel }">
              <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Search by Content" />
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
              <span>是否刪除此回饋內容 ?</span>
          </div>
          <p></p>
          <p>  工號: {{ dlpf.AccountID }}</p>
          <!-- <p>  password: {{ password }}</p> -->
          <p>  email: {{ dlpf.Email }}</p>
          <!-- <p>  content: {{ dlpf.Content }}</p> -->
      </div>
      </div>
      <template #footer>
      <Button label="否" icon="pi pi-times" @click="closeConfirmation" class="p-button-text" />
      <Button label="是" icon="pi pi-check" @click="deleteForm" class="p-button-text" />
      </template>
  </Dialog>

</template>

<script setup>
import { ref, onBeforeMount, reactive, computed } from 'vue';
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import axios from 'axios';
import Register from './Register.vue';
import Edit from './Edit.vue';
let dlpf = ref(null)
const selectedAccount = ref(null);
const displayConfirmation = ref(false);
const apiBaseUrl = 'http://192.168.123.235:3000';
const customer1 = ref(null);
const filters1 = ref(null);
const loading1 = ref(null);
const sortField = ref(null);
const sortOrder = ref(1); // 追加：排序顺序，'asc' 或 'desc'

const toggleSortOrder = (field) => {
  if (sortField.value === field) {
    sortOrder.value = sortOrder.value === 1 ? -1 : 1;
  } else {
    sortField.value = field;
    sortOrder.value = 1;
  }
  fetchForms(); // 重新获取并排序数据
};

onBeforeMount(() => {
  fetchForms();
  initFilters1();
});

const initFilters1 = () => {
  filters1.value = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    AccountID: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    Email: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    Date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]},
    Content: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
  };
};

const clearFilter1 = () => {
  initFilters1();
};

const fetchForms = async () => {
  loading1.value = true;
  try {
    const response = await axios.get(`${apiBaseUrl}/forms`);
    let data = response.data;

    // 追加：按照 sortOrder 进行排序
    if (sortField.value || sortOrder.value) {
      data.sort((a, b) => {
        let result = 0;
        if (a[sortField.value] < b[sortField.value]) {
          result = -1;
        } else if (a[sortField.value] > b[sortField.value]) {
          result = 1;
        }
        return sortOrder.value === 1 ? result : -result;
      });
    }
    customer1.value = []; // Clear previous data
    customer1.value = data;
  } catch (error) {
    console.error('Error fetching profiles:', error);
  } finally {
    loading1.value = false;
  }
};

const onSort = (event) => {
  sortField.value = event.sortField;
  sortOrder.value = event.sortOrder;
  fetchForms();
};

//const formId = 999;
//const formDate = '0000-00-00 00:00:00';

const deleteForm = async () => {
    try {
        const response = await axios.delete(`${apiBaseUrl}/forms/${dlpf.Num}`);
        console.log('data : ', dlpf.Num);
        console.log('Form deleted successfully:', response.data);
        fetchForms();  // 删除后刷新数据
    } catch (error) {
        console.error('Error deleting form:', error);
    }
    closeConfirmation();
};


const formatDateTime = (datetime) => {
   if (datetime === '0000-00-00 00:00:00') {
    return 'Invalid Date';
  }
  const date = new Date(datetime);
  if (isNaN(date)) {
    return 'Invalid Date';
  }
  // 增加8小时的时差
  date.setHours(date.getHours() + 8);
  return date.toISOString().slice(0, 19).replace('T', ' ');
};

const closeConfirmation = () => {
    displayConfirmation.value = false;
};
const openConfirmation = (profile) => {
    dlpf = profile;
    displayConfirmation.value = true;
};

</script>

<style scoped>


</style>
