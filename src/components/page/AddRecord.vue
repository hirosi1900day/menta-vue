<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import Cookies from 'js-cookie';

import DatePicker from '../atom/DatePicker.vue'
import DropFile from '../atom/DropFile.vue'
import Header from '../layout/Header.vue'
import ErrorMessage from '../atom/ErrorMessage.vue'

const memo = ref("");
const recordDate = ref("");
const weight = ref(null);
const fatPercentage = ref(null);
const files = ref([]);
const isAddAsHidden = ref(false);
const errorMessage = ref('');

function dateChange(event) {
    recordDate.value = event
}

function onFileChange(event) {
    files.value = [...event];
}

const registerRecord = async () => {
  try {
        const formData = new FormData();
        formData.append('record[memo]', memo.value);
        formData.append('record[date]', recordDate.value);
        formData.append('record[weight]', weight.value);
        formData.append('record[fat_percentage]', fatPercentage.value);

        if (isAddAsHidden.value === false) {
            formData.append('record[open_status]', 1);
        }

        for (const file of files.value) {
            formData.append('images', file);
        }

        const res = await axios.post( 'http://localhost:3000/api/v1/records', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'access-token' : Cookies.get('accessToken'),
                'client':Cookies.get('client'),
                'uid': Cookies.get('uid')
            }
        })
        console.log({ res })
    } catch (error) {
        errorMessage.value = ''
        let errorMessages = '記録の追加に失敗しました\n';
        if (error.response.status === 422) {
            if (Array.isArray(error.response.data.errors)) {
                errorMessages += error.response.data.errors.join('\n');
            }
        }
        errorMessage.value = errorMessages
    }
}
</script>

<template>
    <Header />
    <ErrorMessage :errorMessage="errorMessage"/>
    <div class="time-list">
        <div class="item">
            <p class="inputTitle">記録日</p>
            <DatePicker isStart=false :date= recordDate @update:date="dateChange"/>
        </div>
    </div>
    <div class="profile-edit-content">
        <label for="goal-weight">体重:</label>
        <input type="text" id="goal-weight" v-model="weight">
        <label for="goal-weight" class="unit-label">kg</label>
    </div>
    <div class="profile-edit-content">
        <label for="goal-fat-percentage">体脂肪率:</label>
        <input type="text" v-model="fatPercentage">
        <label for="goal-fat-percentage" class="unit-label">%</label>
    </div>
    <div class="editor">
        <textarea name="memo" rows="10" v-model="memo"></textarea>
    </div>
    <div class="search-check">
      <input type="checkbox" id="statusSelect" v-model="isAddAsHidden">
      <label for="statusSelectName">非公開記録にする場合にはチェック</label>
    </div>
    <div class="relationImages">
        <p class="inputTitle">関連画像</p>
        <DropFile @change="onFileChange"/>
    </div>
    <div class="relationImages">
        <button class="registerButton" @click="registerRecord">登録する</button>
    </div>
</template>

<style>
.editor{
   padding: 30px;
 }

 input[type=text] {
  width: 100%;
  padding: 12px 12px;
  margin: 8px 0;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.time-list {
  display: flex;
  justify-content: space-between;
  padding-left: 30px;
  padding-right: 30px;
}
.time-list .item {
  width: 50%;
  margin: 0;
  padding: 10px;
  box-sizing: border-box;
}
.time-list .item .inputTitle {
  margin: 5px 0 0;
  padding: 0;
  font-size: 16px;
}
.relationImages {
    padding: 20px;
}
.registerButton{
    background: #ffa500;
    color: white;
    font-size:16px;
    font-weight:bold;
}
</style>