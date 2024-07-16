<script setup>
import { ref ,computed } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useStore } from 'vuex';
const calendarValue = ref(null);
const apiBaseUrl = 'http://192.168.123.235:3000';
const toast = useToast();
const message = ref([]);
const username = ref(null);
const email = ref(null);
const feedback = ref(null);
const count = ref(0);
const store = useStore();
const storedUser = computed(() => {
    console.log(store.getters.getUser); 
    return store.getters.getUser
});
const datereg = computed(() => {
    if (!calendarValue.value) return null;
    const date = new Date(calendarValue.value);
    const now = new Date();

    // Set hours, minutes, and seconds from the current time
    date.setHours(now.getHours());
    date.setMinutes(now.getMinutes());
    date.setSeconds(now.getSeconds());
    date.setHours(date.getHours() - date.getTimezoneOffset() / 60);
    console.log("date",date)
    return date.toISOString().slice(0, 19).replace('T', ' ');
});

//const date = new Date('Tue Jun 04 2024 00:00:00 GMT+0800');
//const isoString = date.toISOString().slice(0, 19).replace('T', ' ');

const addMessage = (type) => {
    if (type === 'success') {
        message.value = [{ severity: 'success', detail: 'Success', content: '表單發送成功', id: count.value++ }];
    } else if (type === 'warn') {
        message.value = [{ severity: 'warn', detail: 'Warn', content: '請勿空白', id: count.value++ }];
    } else if (type === 'error') {
        message.value = [{ severity: 'error', detail: 'Error', content: '表單傳送失敗', id: count.value++ }];
    }
};

const showSuccess = () => {
    toast.add({ severity: 'success', summary: 'Success', detail: '表單發送成功', life: 3000 });
};


const showWarn = () => {
    toast.add({ severity: 'warn', summary: 'Warn', detail: 'Empty is not allow', life: 3000 });
};

const showError = () => {
    toast.add({ severity: 'error', summary: 'Error', detail: '表單傳送失敗 伺服器發生錯誤', life: 3000 });
};


const submitForm = () => {
    if(!email.value || !feedback.value || !calendarValue.value){
        console.warn('Warn: Email Date and Feedback are required');
        addMessage('warn');
        showWarn();
        return; 
    }

    const formData = {
        Num: `${storedUser.value.name}-${Date.now()}`,
        AccountID: storedUser.value.name,
        Email: email.value,
        //Date: calendarValue.value,
        Date: datereg.value,
        Content: feedback.value
    };
    //console.log(" dfdf",isoString)
    console.log(" CAL ",calendarValue)
    console.log('Form Data:', formData); 
    
    // Save JSON file locally
    // const jsonBlob = new Blob([JSON.stringify(formData)], { type: 'application/json' });
    // const jsonUrl = URL.createObjectURL(jsonBlob);
    // const downloadLink = document.createElement('a');
    // downloadLink.href = jsonUrl;
    // downloadLink.download = 'formData.json';
    // downloadLink.click();
   
    // Submit form data to the backend
    fetch( `${apiBaseUrl}/form/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Success:', data);
        addMessage('success');
        showSuccess();
        email.value = null;
        feedback.value = null;
        calendarValue.value = null;
    })
    .catch(error => {
        console.error('Error:', error);
        addMessage('error');
        showError();
    });
    
    
};
</script>

<template>
    <div class="align-items-center justify-content-center surface-ground flex">
        <div class="grid">
            

            <div class="col-12 lg:col-12">
                <div class="card ">
                    <h3>Survey on Satisfaction with our System</h3>
                    <br>
                    <br>
                    <div class="field grid">
                        <label for="useraccount" class="col-fixed w-9rem">AccountID</label>
                        <div class="col">
                            <h5>{{storedUser.name}}</h5>
                        </div>
                    </div>

                    <div class="field grid">
                        <label for="email" class="col-fixed w-9rem">Email</label>
                        <div class="col">
                            <InputText id="email" v-model="email" :required="true" class="mr-2" placeholder="Your Email"></InputText>
                            <!-- <InlineMessage v-if="!email">Email is required</InlineMessage> -->
                        </div>
                    </div>

                    <div class="field grid">
                        <label for="calendar" class="col-fixed w-9rem">Date</label>
                        <div class="col">
                            <Calendar :showIcon="true" :showButtonBar="true" v-model="calendarValue"></Calendar>
                        </div>
                    </div>

                    <div class="field grid">
                        <label for="content" class="col-fixed w-9rem">Feedback</label>
                        <div class="col">
                            <Textarea  id="feedback" class="mr-2" v-model="feedback" placeholder="Your Feedback" :autoResize="true" rows="3" cols="50" />
                             <!-- <Textarea id="feedback" v-model="feedback" :required="true" class="mr-2 custom-input"></Textarea> -->
                             <!-- <InlineMessage v-if="!feedback">Feedback is required</InlineMessage> -->
                        </div>
                    </div>
                    <div class="button-container">
                        <Button label="Submit" @click="submitForm" class="mt-3" />
                    </div>
                    <transition-group name="p-message" tag="div">
                        <Message v-for="msg of message" :severity="msg.severity" :key="msg.content">{{ msg.content }}</Message>
                    </transition-group>
                </div>
                
            </div>

            <!-- <div class="col-12 lg:col-4">
                <div class="card">
                    <h5>Help Text</h5>
                    <div class="field p-fluid">
                        <label for="username2">Username</label>
                        <InputText id="username2" type="username" class="p-error" aria-describedby="username-help" />
                        <small id="username-help" class="p-error">Enter your username to reset your password.</small>
                    </div>
                </div>
            </div> -->
        </div>
    </div>
</template>

<style scoped>
.custom-input {
    width: 100%; /* 調整寬度，可以根據需要設置具體數值，例如300px */
    height: 240px; /* 調整高度，可以根據需要設置具體數值 */
    padding: 10px; /* 調整內邊距，根據需要設置 */
}
.button-container {
    display: flex;
    justify-content: flex-end; /* This aligns the buttons to the left */
}
</style>