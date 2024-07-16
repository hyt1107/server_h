<template>
  <div class="grid">
    <div class="col-12">
      <div class="card">
        <h5><b>員工表</b></h5>
        <DataTable
          :value="customer1"
          :paginator="true"
          :rows="15"
          dataKey="AccountID"
          :rowHover="true"
          v-model:filters="filters1"
          filterDisplay="menu"
          :loading="loading1"
          :filters="filters1"
          :globalFilterFields="['AccountID', 'Email', 'Permission']"
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

          <template #empty> 無此帳號資訊 </template>
          <template #loading> Loading data ... Please wait. </template>

          <Column header="工號" field="AccountID" style="min-width: 10rem" sortable>
            <template #body="{ data }">
              {{ data.AccountID }}
            </template>
            <template #filter>
              <div class="flex align-items-center">
                <InputText type="text" v-model="filters1['AccountID'].constraints[0].value" class="p-column-filter" placeholder="Search by AccountID" />
                <Button type="button" icon="pi pi-sort-alt" class="ml-2" @click="toggleSortOrder()" />
              </div>
            </template>
          </Column>

          <Column header="密碼" style="min-width: 4rem">
            <template #body="{ data }">
              無法查看
            </template>
          </Column>

          <Column header="Email" field="Email" style="min-width: 14rem">
            <template #body="{ data }">
              <span>{{ data.Email }}</span>
            </template>
            <template #filter="{ filterModel }">
              <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Search by Email" />
            </template>
          </Column>

          <Column header="權限" field="Permission" :showFilterMatchModes="false" :filterMenuStyle="{ width: '8rem' }" bodyClass="text-center" style="min-width: 4rem">
            <template #body="{ data }">
              <Tag :severity="getSeverity(data.Permission)">{{ data.Permission.toUpperCase() }}</Tag>
            </template>
            <template #filter="{ filterModel }">
              <MultiSelect v-model="filterModel.value" :options="statuses" placeholder="Any" class="p-column-filter" />
            </template>
          </Column>

          <Column header="編輯" bodyClass="text-center" style="min-width: 4rem">
            <template #body="{ data }">
              <Button icon="pi  pi-pencil text-green-500"  @click="editAccount(data)" text rounded />
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
              <span>是否刪除此帳號 ?</span>
          </div>
          <p></p>
          <p>  account: {{ dlpf.AccountID }}</p>
          <!-- <p>  password: {{ password }}</p> -->
          <p>  email: {{ dlpf.Email }}</p>
          <p>  permission: {{ dlpf.Permission }}</p>
      </div>
      </div>
      <template #footer>
      <Button label="否" icon="pi pi-times" @click="closeConfirmation" class="p-button-text" />
      <Button label="是" icon="pi pi-check" @click="deleteProfile" class="p-button-text" />
      </template>
  </Dialog>

  <!--  Implementation -->
    <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
      <div class="modal">
        <div class="modal-header">
          <h3>註冊</h3>
        <Button  icon="pi pi-times" text class="mb-2 mr-2" @click="showModal = false" />
        </div>
        <div class="modal-body">
          <Register @close="handleClose" @registered="fetchProfiles" />
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
          <Edit :accountData="selectedAccount" @close="handleClose" @registered="fetchProfiles" />
        </div>
      </div>
    </div>

</template>

<script setup>
import { ref, onBeforeMount, reactive, computed } from 'vue';
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import axios from 'axios';
import Register from './Register.vue';
import Edit from './Edit.vue';
let dlpf = ref(null)
const showModal = ref(false);
const showModalEdit = ref(false);
const selectedAccount = ref(null);
const displayConfirmation = ref(false);
const apiBaseUrl = 'http://192.168.123.235:3000';
const customer1 = ref(null);
const filters1 = ref(null);
const loading1 = ref(null);
let sortOrder = ref(null); // 追加：排序顺序，'asc' 或 'desc'
const rootUrl = computed(() => {
  return `../../../public/layout/images//crown.png`;
});
const AUrl = computed(() => {
  return `../../../public/layout/images//A_letter.png`;
});
const BUrl = computed(() => {
  return `../../../public/layout/images//B_letter.png`;
});
const statuses = reactive(['Root', 'A', 'B']);
const representatives = reactive([
  { name: 'Root', image: rootUrl },
  { name: 'A', image: AUrl },
  { name: 'B', image: BUrl },
]);

const getSeverity = (status) => {
  switch (status) {
    case 'Root':
      return 'danger';

    case 'A':
      return 'warning';

    case 'B':
      return 'success';
  }
};
const deleteAccount = (customer) => {
  customer1.value = customer1.value.filter((c) => c.id !== customer.id);
};

const handleClose = async () => {
  showModalEdit.value = false;
  showModal.value = false;
  await fetchProfiles(); // 更新後重新加載數據
};

const editAccount = (customer) => {
  selectedAccount.value = customer;
  showModalEdit.value = true;
};

const toggleSortOrder = () => {
  if (sortOrder.value === 'asc') {
    sortOrder.value = 'desc';
  } else {
    sortOrder.value = 'asc';
  }
  fetchProfiles(); // 重新获取并排序数据
};

onBeforeMount(() => {
  fetchProfiles();
  initFilters1();
});

const initFilters1 = () => {
  filters1.value = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    AccountID: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    Email: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    Permission: { value: null, matchMode: FilterMatchMode.IN },
  };
};

const clearFilter1 = () => {
  initFilters1();
};

const fetchProfiles = async () => {
  loading1.value = true;
  try {
    const response = await axios.get(`${apiBaseUrl}/profiles`);
    let data = response.data;

    // 追加：按照 sortOrder 进行排序
    if (sortOrder.value) {
      data.sort((a, b) => {
        const comparison = a.AccountID.localeCompare(b.AccountID);
        return sortOrder.value === 'asc' ? comparison : -comparison;
      });
    }

    customer1.value = data;
  } catch (error) {
    console.error('Error fetching profiles:', error);
  } finally {
    loading1.value = false;
  }
};

const deleteProfile = async () => {
  try {
    await axios.delete(`${apiBaseUrl}/profile/${dlpf.AccountID}`);
    fetchProfiles();
  } catch (error) {
    console.error('Error deleting profile:', error);
  }
  closeConfirmation();
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
