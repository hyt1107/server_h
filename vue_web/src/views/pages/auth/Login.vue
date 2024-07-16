<script setup>
import { useLayout } from '@/layout/composables/layout';
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { useToast } from 'primevue/usetoast';


const apiBaseUrl = 'http://192.168.123.235:3000';
const { layoutConfig } = useLayout();
const account = ref('');
const password = ref('');
const checked = ref(false);
const store = useStore();
const router = useRouter();
const errorMessage = ref('');
const toast = useToast();
const display = ref(false);

const check = async () => {
  if (!password.value || !account.value) {
    errorMessage.value = 'AccountID 或 Password 不能為空!';
    toast.add({ severity: 'error', summary: 'Error', detail: errorMessage.value, life: 3000 });
    open();
    return;
  }
  if(account.value == "999" && password.value =="root"){ //used by test
    const user = {name: account.value};
    await store.dispatch('login', user);
    router.push('/');
  }
  try {
    const response = await axios.post(`${apiBaseUrl}/profile`, { 
      AccountID: account.value, 
      Password: password.value 
    });
    const perm = response.data.perm;
    console.log("perm",perm)
    //有token版
    //const token = response.data.token;
    //const user = { name: account.value, token };
    const user = {
      name: account.value ,
      permission: perm
    };

    await store.dispatch('login', user);
    router.push('/');
  } catch (error) {
    console.error('登入失敗!', error);
    errorMessage.value = '帳號或密碼錯誤   請重試 ! ';
    toast.add({ severity: 'error', summary: 'Error', detail: errorMessage.value, life: 3000 });
    open();
  }
};

const open = () => {
  display.value = true;
};

const close = () => {
  display.value = false;
};

const longlog = computed(() => {
  return `/layout/images/holdwelllong.png`;
});

const logoUrl = computed(() => {
  return `/layout/images/holdwelllogo.png`;
});
</script>

<template>
<div>
  <br>
    <div class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
      <div class="flex flex-column align-items-center justify-content-center">
        <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
          <div class="w-full surface-card py-8 px-5 sm:px-8" style="border-radius: 53px">
            <div class="text-center mb-5">
              <img :src="logoUrl" alt="Image" height="50" class="mb-3" />
              <div class="text-900 text-3xl font-medium mb-3">Welcome to Holdwell!</div>
              <span class="text-600 font-medium">Sign in to continue</span>
            </div>

            <div>
              <label for="email1" class="block text-900 text-xl font-medium mb-2">Account</label>
              <InputText id="email1" type="text" placeholder="AccountID" class="w-full md:w-30rem mb-5" style="padding: 1rem" v-model="account" />

              <label for="password1" class="block text-900 font-medium text-xl mb-2">Password</label>
              <InputText id="password1" type="password" placeholder="Password" class="w-full md:w-30rem mb-5" style="padding: 1rem" v-model="password" />
              

              <div class="flex align-items-center justify-content-between mb-5 gap-5">
                <div class="flex align-items-center">
                  <Checkbox v-model="checked" id="rememberme1" binary class="mr-2"></Checkbox>
                  <label for="rememberme1">Remember me</label>
                </div>
                <!-- <div class="flex align-items-center">
                  <a class="font-medium no-underline ml-2 text-right cursor-pointer" style="color: var(--primary-color)">Forgot password?</a>
                </div> -->
              </div>
              <Button label="Sign In" class="w-full p-3 text-xl" @click="check"></Button>
              <div v-if="errorMessage" class="error-message"><small id="username-help" class="p-error">{{errorMessage}}</small></div>
              <Dialog header="Error" v-model="display" :breakpoints="{ '960px': '75vw' }" :style="{ width: '30vw' }" :modal="true">
                <p class="line-height-3 m-0">{{ errorMessage }}</p>
                <template #footer>
                  <Button label="Ok" @click="close" icon="pi pi-check" class="p-button-outlined" />
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
}
</style>
