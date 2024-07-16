<script setup>
import { ref, computed ,onMounted, onUnmounted} from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
const calendarValue = ref(null);
const apiBaseUrl = 'http://192.168.123.235:3000';
const message = ref([]);
let count = ref(0);
let lastcategory = ref('');
const account = ref('');
const password = ref('');
const email = ref('');
const permission = ref(null);
let datetime = ref(new Date().toLocaleString());
let createtime = ref('');
const category = ref('');
const content = ref('');
const currentTime = ref(new Date().toLocaleString());

const errorMessage = ref('');
const display = ref(false);
const router = useRouter();
const toast = useToast();
const dropdownValues = ref([
    { name: 'operation' },
    { name: 'repair' },
    { name: 'question' },
]);
const displayConfirmation = ref(false);

const addMessage = (type) => {
    if (type === 'success') {
        message.value = [{ severity: 'success', detail: 'Success', content: ('通知建立成功'), id: count.value++ }];
    } else if (type === 'warn') {
        message.value = [{ severity: 'warn', detail: 'Warn', content: '請勿空白', id: count.value++ }];
    } else if (type === 'error') {
        message.value = [{ severity: 'error', detail: 'Error', content: '通知建立失敗', id: count.value++ }];
    }
};

const openConfirmation = () => {
    displayConfirmation.value = true;
};
const emit = defineEmits(['close', 'registered']);
const closeConfirmation = () => {
    displayConfirmation.value = false;
    emit('close');
};
const check = () => {
    errorMessage.value = ''; // 清除之前的錯誤消息
    //createtime = currentTime.value;

    const now = new Date();
    //const taipeiTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Taipei' }));
    now.setHours(now.getHours() + 8);
    createtime.value = now.toISOString().slice(0, 19).replace('T', ' ');
    //createtime.value = taipeiTime.toISOString().slice(0, 19).replace('T', ' ');

    if (!category.value ||  !content.value ) {
        errorMessage.value = '類別, 時間 和 內容 不能為空!';
        toast.add({ severity: 'error', summary: 'Error', detail: errorMessage.value, life: 3000 });
        addMessage('warn');
        return;
    }
    //datetime = new Date(createtime);
    console.log("category",category.value.name)
    console.log("createtime",createtime)
    console.log("content",content.value)
    openConfirmation();
    //console.log("Get: ", category.value, createtime.value, content.value)
}


const createnotify = async () => {
    try {
        const response = await axios.post(`${apiBaseUrl}/addnotify`, {
            category: category.value.name,
            createtime: createtime.value,
            content: content.value
        });
        lastcategory.value = category.value;
        addMessage('success');
        closeConfirmation();

        category.value = null;
        createtime = '';
        content.value = null;
    } catch (error) {
        console.error('新增失敗!', error);
        errorMessage.value = error.response.data || '新增失敗，請重試!';
        addMessage('error');
        closeConfirmation();
    }
};
// 定義一個變量來存儲當前時間

// 定義一個方法來更新時間
const updateTime = () => {
  currentTime.value = new Date().toLocaleString();
};

// 在組件掛載時設置一個定時器來每秒更新時間
onMounted(() => {
  const interval = setInterval(updateTime, 1000);

  // 在組件卸載時清除定時器
  onUnmounted(() => {
    clearInterval(interval);
  });
});
</script>

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
                            <label for="category" class="block text-900 text-lg font-medium mb-1">類別</label>
                            <Dropdown v-model="category" :options="dropdownValues" optionLabel="name" placeholder="Select" class="w-full md:w-20rem mb-3" style="padding: 0.3rem" />

                            <label for="createtime" class="block text-900 text-lg font-medium mb-1">創建日期</label>
                            <InputText id="createtime" type="createtime" v-model="createtime.value" :placeholder="currentTime" class="w-full md:w-20rem mb-3" style="padding: 0.5rem" disabled />
                            <!-- <Calendar :showIcon="true" :showButtonBar="true" v-model="calendarValue"></Calendar> -->
                            
                            <label for="content" class="block text-900 font-medium text-lg mb-1">發布內容</label>
                            <Textarea id="content" type="content" placeholder="內容" class="w-full md:w-20rem mb-3" style="padding: 0.5rem" v-model="content" />
                            <br>
                             <br>
                            <Button label="發布" class="w-full p-2 text-lg md:w-20rem mb-3" @click="check"></Button>
                            <div v-if="errorMessage" class="error-message"><small id="username-help" class="p-error">{{ errorMessage }}</small></div>

                            <transition-group name="p-message" tag="div">
                                <Message v-for="msg in message" :severity="msg.severity" :key="msg.id" class="w-full md:w-20rem mb-3">{{ msg.content }}</Message>
                            </transition-group>

                            <Dialog header="Confirmation" v-model:visible="displayConfirmation" :style="{ width: '300px' }" :modal="true">
                                <div class="flex align-items-center justify-content-center">
                                    <div>
                                        <div>
                                            <i class="pi pi-exclamation-triangle mr-2" style="font-size: 1.5rem" />
                                            <span>是否發布此通知 ?</span>
                                        </div>
                                        <p></p>
                                        <p>  類別: {{ category.name }}</p>
                                        <p>  創立時間: {{ createtime }}</p>
                                        <p>  發布內容: {{ content }}</p>
                                        
                                    </div>
                                </div>
                                <template #footer>
                                    <Button label="否" icon="pi pi-times" @click="closeConfirmation" class="p-button-text" />
                                    <Button label="是" icon="pi pi-check" @click="createnotify" class="p-button-text" />
                                </template>
                            </Dialog>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.error-message {
    color: red;
    margin-top: 10px;
    z-index: 1000; /* 提升 z-index */
    position: relative; /* 確保相對於其父容器定位 */
}
.profile-card {
    border-radius: 20px;
    padding: 0.5rem;
    /* background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%); */
    width: 400px; /* Adjust the width as needed */
    max-width: 100%; /* Set a max-width for larger screens */
    height: auto; /* Adjust the height as needed */
    position: relative; /* 確保相對定位 */
}
</style>
