<script setup>
import { useToast } from 'primevue/usetoast';
import { useLayout } from '@/layout/composables/layout';
import { ref, computed, onMounted, watch } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import axios from 'axios'; 



const apiBaseUrl = 'http://192.168.123.235:3000';
const displayConfirmation = ref(false);
const profile = ref(null);
const { layoutConfig } = useLayout();
const toast = useToast();
const store = useStore();
const router = useRouter();
const onUpload = () => {
    toast.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded', life: 3000 });
};
const storedUser = computed(() => store.getters.getUser);
//test
//const storedUser = computed(() => store.getters.getUser);
const storedPassword = computed(() => store.getters.getUserPermission);
//console.log("storedUser", storedUser)
//console.log("storedPassword", storedPassword)
//test
const logoUrl = computed(() => {
    return `/layout/images/holdwelllogo.png`;
});

const openConfirmation = () => {
    displayConfirmation.value = true;
    //logout()
};
const closeConfirmation = () => {
    displayConfirmation.value = false;
};

const logout = () =>{
    closeConfirmation();
    store.dispatch('logout');
    router.push('/auth/login');
}



const search = async (acID) => {  ""
  try {
    const response = await axios.get(`${apiBaseUrl}/profile/${acID}`);
    //console.log("return", response.data);
    return response.data;
  } catch (error) {
    console.error('There was an error searching the database!', error);
    throw error; 
  }
};

const fetchProfileData = async (acID) => {
  //console.log("ac ", acID.name);
  try {
    const data = await search(acID.name);
    if (data && data.length > 0) {
      profile.value = data[0];  
    } else {
      profile.value = null;
    }
    //console.log("Profile Data:", profile.value);
   
  } catch (error) {
    console.error('There was an error searching the database!', error);
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to fetch profile data', life: 3000 });
  }
};

onMounted(() => {
  if (storedUser.value) {
    fetchProfileData(storedUser.value);
   // console.log("資料庫找資料");
  } else {
    console.error('No account ID found');
  }
});
</script>

<template>
    <div class="align-items-center justify-content-center surface-ground flex">
        <div class="grid">
            <div class="col-12 lg:col-12">
                <div class="profile-card">
                    <div class="w-full surface-card py-8 px-5 sm:px-8 profile-content" style="border-radius: 53px">
                        <div class="text-center mb-5">
                            <div class="text-1200 text-4xl font-medium mb-3"><b>個人資料</b></div>
                            <img :src="logoUrl" alt="Image" height="50" class="mb-3" />
                        </div>
                        <div>
                            <div class="profile-details" v-if="profile">
                                <div class="profile-item">
                                    <h4 class="font-medium no-underline text-left cursor-pointer"><b>工號</b></h4>
                                    <h5 class="test">{{ profile.AccountID }}</h5>
                                </div>
                                <div class="profile-item">
                                    <h4 class="font-medium no-underline text-left cursor-pointer"><b>密碼</b></h4>
                                    <h5 class="test">已加密保護</h5>
                                </div>
                                <div class="profile-item">
                                    <h4 class="font-medium no-underline text-left cursor-pointer"><b>Email</b></h4>
                                    <h5 class="test">{{ profile.Email }}</h5>
                                </div>
                                <div class="profile-item">
                                    <h4 class="font-medium no-underline text-left cursor-pointer"><b>權限</b></h4>
                                    <h5 class="test">{{ profile.Permission }}</h5>
                                </div>
                            </div>
                            <div v-else>
                                Loading profile data...
                            </div>
                            <br>
                            <br>
                            <div class="button-container">
                                <div>
                                    <Button label="Logout" @click="openConfirmation" class="mt-3" />
                                    <Dialog header="Confirmation" v-model:visible="displayConfirmation" :style="{ width: '350px' }" :modal="true">
                                        <div class="flex align-items-center justify-content-center">
                                            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                                            <span>確認要登出帳號 ?</span>
                                        </div>
                                        <template #footer>
                                            <Button label="否" icon="pi pi-times" @click="closeConfirmation" class="p-button-text" />
                                            <Button label="是" icon="pi pi-check" @click="logout" class="p-button-text" autofocus />
                                        </template>
                                    </Dialog>
                                </div>
                             
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.button-container {
    display: flex;
    justify-content: center; /* This aligns the buttons to the left */
}
.profile-card {
    border-radius: 56px;
    padding: 0.3rem;
    background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%);
    width: 600px; /* Adjust the width as needed */
    max-width: 900px; /* Set a max-width for larger screens */
    height: 80vh; /* Adjust the height as needed */
    max-height: 700px; /* Set a max-height for larger screens */
}

.profile-content {
    border-radius: 53px;
}

.profile-details {
    display: flex;
    flex-direction: column;
    gap: 10px; /* 调整每行之间的间距 */
}

.profile-item {
    display: flex;
    justify-content: flex-start; /* 将标签靠左对齐 */
    align-items: center; /* 垂直居中对齐 */
}

.profile-item h4 {
    flex: 1;
    text-align: left;
    margin: 0;
}

.profile-item h5 {
    flex: 2;
    text-align: center;
    margin: 0;
}

.pi-eye {
    transform: scale(1.6);
    margin-right: 1rem;
}

.pi-eye-slash {
    transform: scale(1.6);
    margin-right: 1rem;
}
</style>
