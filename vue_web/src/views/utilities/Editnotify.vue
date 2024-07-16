<template>
  <div class="outer-container">
    <div class="inner-container">
      <div class="w-full surface-card py-4 px-4 sm:px-6" style="border-radius: 20px; padding: 0.5rem">
        <div>
          <label for="permisssion" class="block text-900 font-medium text-lg mb-1">類別</label>
          <Dropdown v-model="category" :options="dropdownValues" optionLabel="name" placeholder="Select" class="w-full md:w-20rem mb-3" />

          <label for="createtime" class="block text-900 text-lg font-medium mb-1">內容</label>
          <Textarea id="content" type="content" :placeholder="content" class="w-full md:w-20rem mb-3" style="padding: 0.5rem" v-model="content" />
         
          <label for="content" class="block text-900 text-lg font-medium mb-1"> </label>
          <div class="grid">
            <div class="col-12 md:col-4">
              <div class="field-radiobutton mb-0">
                <RadioButton id="option1" name="option" value="1" v-model="shown" />
                <label for="option1">公開</label>
              </div>
            </div>
            <div class="col-12 md:col-4">
              <div class="field-radiobutton mb-0">
                <RadioButton id="option2" name="option" value="0" v-model="shown" />
                <label for="option2">私人</label>
              </div>
            </div>
          </div>
          <br/>
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
                  <span>是否修改此公告 ?</span>
                </div>
                <p></p>
                <p>  類別: {{ category.name }}</p>
                <p>  內容: {{ content }}</p>
                <p>  狀態: {{ shown === '1' ? '公開' : '私人' }}</p>
              </div>
            </div>
            <template #footer>
              <Button label="否" icon="pi pi-times" @click="closeConfirmation" class="p-button-text" />
              <Button label="是" icon="pi pi-check" @click="updateNotify" class="p-button-text" />
            </template>
          </Dialog>
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
  notifytData: Object,
  onClose: Function,
});
const radioValue = ref(null);
const apiBaseUrl = 'http://192.168.123.235:3000';
const createtime = ref('');
const content = ref('');
const category = ref(null);
const shown = ref('');
const dropdownValues = ref([
  { name: 'operation' },
  { name: 'repair' },
  { name: 'question' },
]);
const errorMessage = ref('');
const message = ref([]);
const toast = useToast();
const displayConfirmation = ref(false);
let count = ref(0);
let lasttime = ref('');

const emit = defineEmits(['close', 'registered']);

const close = () => {
  props.onClose();
  emit('close');
};

const addMessage = (type) => {
    if (type === 'success') {
        message.value = [{ severity: 'success', detail: 'Success', content: (lasttime.value + '編輯成功'), id: count.value++ }];
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
   
  if (props.notifytData) {
    createtime.value = props.notifytData.createtime;
    content.value = props.notifytData.content;
    category.value = dropdownValues.value.find(p => p.name === props.notifytData.category);
    shown.value = props.notifytData.shown.toString();  // Convert to string for the radio button
  }
};

const updateNotify = async () => {
  try {
    const now = new Date();
    now.setHours(now.getHours() + 8);
    const updatedCreatetime = now.toISOString().slice(0, 19).replace('T', ' ');
    const pasttime = formatDateTime( props.notifytData.createtime);

    await axios.put(`${apiBaseUrl}/edit_note/${pasttime}`, {
      createtime: formatDateTime(updatedCreatetime),
      content: content.value,
      category: category.value.name,
      shown: parseInt(shown.value),  // Convert back to integer for the backend
    });
    
    lasttime.value = updatedCreatetime;
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

watch(() => props.notifytData, initializeData, { immediate: true });

onMounted(() => {
  initializeData();
});

const formatDateTime = (datetimeStr) => {
  const date = new Date(datetimeStr);
  return `${date.getFullYear()}-${padZero(date.getMonth() + 1)}-${padZero(date.getDate())} ` +
         `${padZero(date.getHours())}:${padZero(date.getMinutes())}:${padZero(date.getSeconds())}`;
};

const padZero = (num) => {
  return num < 10 ? '0' + num : num;
};

const check = () => {
    errorMessage.value = ''; // 清除之前的錯誤消息
    if (!createtime.value || !shown.value || !content.value || !category.value) {
        errorMessage.value = 'createtime, content, shown 或 category 不能為空!';
        toast.add({ severity: 'error', summary: 'Error', detail: errorMessage.value, life: 3000 });
        addMessage('warn');
        return;
    }
    openConfirmation();
    console.log("Get: ", createtime.value, shown.value, content.value, category.value)
}
</script>

<style scoped>
.outer-container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.inner-container {
  width: 400px; /* Adjust the width as needed */
  max-width: 100%; /* Set a max-width for larger screens */
}

.profile-cards {
  border-radius: 20px;
  padding: 0.5rem;
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
