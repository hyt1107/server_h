<script setup>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import AppMenuItem from './AppMenuItem.vue';
import ConfirmPopup from 'primevue/confirmpopup'; // Import ConfirmPopup

const store = useStore();
const router = useRouter();

const userPermission = computed(() => store.getters.getUserPermission);
const canUpload = computed(() => {
  return userPermission.value === 'Root' || userPermission.value === 'A';
});
const canEditAccount = computed(() => {
  return userPermission.value === 'Root';
});
const model = ref([
  {
    label: 'Home',
    items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/' }]
  },
  {
    label: 'Data',
    items: [
      { label: 'Monitor', icon: 'pi pi-fw pi-bolt', to: '/uikit/monitor' },   
    ].filter(item => item !== null) // 过滤掉 null 项
  },
   {
    label: 'AI',
    items: [
      { label: 'Chart', icon: 'pi pi-fw pi-chart-bar', to: '/uikit/charts' },
      { label: 'RandomForest', icon: 'pi pi-fw pi-sitemap', to: '/uikit/rf' },
      { label: 'SVM', icon: 'pi pi-fw  pi-chart-line', to: '/uikit/file' }
    ].filter(item => item !== null) // 过滤掉 null 项
  },
  canEditAccount.value ? {
    label: 'Auth',
    items: [
      {
        label: 'Person',
        icon: 'pi pi-fw pi-user',
        items:[
            { label: 'Edit', icon: 'pi pi-fw pi-user-edit', to: '/auth/accounts' },
            { label: 'Report', icon: 'pi pi-fw pi-file', to: '/auth/report' }
        ]
      },
      {   label: 'Announcement', 
            icon: 'pi pi-fw pi-megaphone', 
            to: '/auth/announcement' 
        },
      {   label: 'Form', 
            icon: 'pi pi-fw pi-envelope', 
            to: '/uikit/form' 
        },
        { label: 'Message', icon: 'pi pi-fw pi-comment', to: '/uikit/message' },
      {
        label: 'Logout',
        icon: 'pi pi-fw pi-sign-out',
        command: () => {
          store.dispatch('logout');
          router.push('/auth/login');
        }
      }
    ]
  } : null,
  !canEditAccount.value ? {
    label: 'Auth',
    items: [
        {
            label: 'Person',
            icon: 'pi pi-fw pi-user',
            to: '/pages/person'
        },
        {   label: 'Form', 
            icon: 'pi pi-fw pi-envelope', 
            to: '/uikit/form' 
        },
        { label: 'Message', icon: 'pi pi-fw pi-comment', to: '/uikit/message' },
        {
            label: 'Logout',
            icon: 'pi pi-fw pi-sign-out',
            command: () => {
                store.dispatch('logout');
                router.push('/auth/login');
            }
        }
        ]
  } : null,
].filter(item => item !== null));
</script>

<template>
  <ul class="layout-menu">
    <template v-for="(item, i) in model" :key="item.label">
      <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
      <li v-if="item.separator" class="menu-separator"></li>
    </template>
    <ConfirmPopup /> <!-- Ensure ConfirmPopup is included -->
  </ul>
</template>

<style lang="scss" scoped></style>
