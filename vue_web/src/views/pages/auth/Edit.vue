<template>
<div class="align-items-center justify-content-center surface-ground flex">
        <div class="grid">
            <div class="col-12 lg:col-12">
                <div class="profile-card">
                    <div class="w-full surface-card py-4 px-4 sm:px-6" style="border-radius: 20px; padding: 0.5rem;">
                        <div class="text-center mb-3">
                            <span class="text-600 font-medium">HOLDWELL</span>
                        </div>
                        <div>
                          <label for="account" class="block text-900 text-lg font-medium mb-1">Account</label>
                          <InputText id="account" type="text" placeholder='{{account}}' class="w-full md:w-20rem mb-3" v-model="account" :disabled="true" />

                          <label for="email" class="block text-900 text-lg font-medium mb-1">Email</label>
                          <InputText id="email" type="email" placeholder="Email" class="w-full md:w-20rem mb-3" v-model="email" />

                          <label for="password" class="block text-900 font-medium text-lg mb-1">Password</label>
                          <InputText id="password" type="password" placeholder="Password" class="w-full md:w-20rem mb-3" v-model="password" />

                          <label for="permisssion" class="block text-900 font-medium text-lg mb-1">Permission</label>
                          <Dropdown v-model="permission" :options="dropdownValues" optionLabel="name" placeholder="Select" class="w-full md:w-20rem mb-3" />

                          <Button label="更新" class="w-full p-2 text-lg md:w-20rem mb-3" @click="check"></Button>
                          <div v-if="errorMessage" class="error-message"><small class="p-error">{{ errorMessage }}</small></div>

                          <transition-group name="p-message" tag="div">
                            <Message v-for="msgedit in message" :severity="msgedit.severity" :key="msgedit.id" class="w-full md:w-20rem mb-3">{{ msgedit.content }}</Message>
                          </transition-group>

                          <Dialog header="Confirmation" v-model:visible="displayConfirmation" :style="{ width: '300px' }" :modal="true">
                                    <div class="flex align-items-center justify-content-center">
                                    <div>
                                        <div>
                                            <i class="pi pi-exclamation-triangle mr-2" style="font-size: 1.5rem" />
                                            <span>是否修改此帳號 ?</span>
                                        </div>
                                        <p></p>
                                        <p>  account: {{ account }}</p>
                                        <!-- <p>  password: {{ password }}</p> -->
                                        <p>  email: {{ email }}</p>
                                        <p>  permission: {{ permission.name }}</p>
                                    </div>
                                </div>
                                <template #footer>
                                    <Button label="否" icon="pi pi-times" @click="closeConfirmation" class="p-button-text" />
                                    <Button label="是" icon="pi pi-check" @click="updateAccount" class="p-button-text" />
                                </template>
                          </Dialog>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';
import { useToast } from 'primevue/usetoast';

const props = defineProps({
  accountData: Object,
  onClose: Function,
});

const apiBaseUrl = 'http://192.168.123.235:3000';
const account = ref('');
const password = ref('');
const email = ref('');
const permission = ref(null);
const dropdownValues = ref([
  { name: 'Root' },
  { name: 'A' },
  { name: 'B' },
]);
const errorMessage = ref('');
const message = ref([]);
const toast = useToast();
const displayConfirmation = ref(false);
let count = ref(0);
let lastaccount = ref('');

const emit = defineEmits(['close', 'registered']);

const close = () => {
  props.onClose();
  emit('close');
};

const addMessage = (type) => {
    if (type === 'success') {
        message.value = [{ severity: 'success', detail: 'Success', content: (lastaccount.value + ' 帳號編輯成功'), id: count.value++ }];
    } else if (type === 'warn') {
        message.value = [{ severity: 'warn', detail: 'Warn', content: '請勿空白', id: count.value++ }];
    } else if (type === 'error') {
        message.value = [{ severity: 'error', detail: 'Error', content: '帳號編輯失敗', id: count.value++ }];
    }
};

const closeConfirmation = () => {
    displayConfirmation.value = false;
};
const openConfirmation = () => {
    displayConfirmation.value = true;
};

const initializeData = () => {
  if (props.accountData) {
    account.value = props.accountData.AccountID;
    password.value = props.accountData.Password;
    email.value = props.accountData.Email;
    permission.value = dropdownValues.value.find(p => p.name === props.accountData.Permission);
  }
};

const updateAccount = async () => {
  try {
    const isPasswordChanged = password.value !== props.accountData.Password;
    await axios.put(`${apiBaseUrl}/edit/${props.accountData.AccountID}`, {
      AccountID: account.value,
      Password: password.value,
      Email: email.value,
      Permission: permission.value.name,
      isPasswordChanged: isPasswordChanged,
    });
    lastaccount.value = account.value;
    addMessage('success');
    close();
    closeConfirmation();

  } catch (error) {
    console.error('更新有Error!', error);
    errorMessage.value = '更新失败，请重试';
    addMessage('error');
    closeConfirmation();
  }
};

watch(() => props.accountData, initializeData, { immediate: true });

onMounted(() => {
  initializeData();
});


const check = () => {
    errorMessage.value = ''; // 清除之前的錯誤消息
    if (!account.value || !password.value || !email.value || !permission.value) {
        errorMessage.value = 'AccountID, Email, Password 或 Permission 不能為空!';
        toast.add({ severity: 'error', summary: 'Error', detail: errorMessage.value, life: 3000 });
        addMessage('warn');
        return;
    }
    openConfirmation();
    console.log("Get: ", account.value, password.value, email.value, permission.value)
}
</script>

<style scoped>
.profile-card {
    border-radius: 20px;
    padding: 0.5rem;
    /* background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%); */
    width: 400px; /* Adjust the width as needed */
    max-width: 100%; /* Set a max-width for larger screens */
    height: auto; /* Adjust the height as needed */
    position: relative; /* 確保相對定位 */
}

.error-message {
  color: red;
  margin-top: 10px;
  z-index: 1000; /* 提升 z-index */
  position: relative; /* 确保相对定位 */
}
</style>
