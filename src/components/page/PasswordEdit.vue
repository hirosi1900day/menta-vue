<script setup>
import axios from 'axios'
import { ref } from 'vue'
import Cookies from 'js-cookie'
import { useField, useForm } from 'vee-validate';
import * as yup from 'yup';

import Header from '../layout/Header.vue'
import ErrorMessage from '../atom/ErrorMessage.vue'

const errorMessage = ref('');

const checkValidate = async () => {
  const result = await validate()
  if (result.valid) {
    passwordEdit()
  }
}

const passwordEdit = async () => {
    try {
        const formData = new FormData();
        formData.append('current_password', currentPassword.value);
        formData.append('password', password.value);
        formData.append('password_confirmation', passwordConfirm.value);

        const res = await axios.put(import.meta.env.VITE_APP_API_BASE + `/api/v1/auth/password`, formData, {

            headers: {
                'access-token' : Cookies.get('accessToken'),
                'client':Cookies.get('client'),
                'uid': Cookies.get('uid')
            }
        })
        console.log({ res })
    } catch (error) {
        errorMessage.value = ''
        let errorMessages = 'パスワード変更に失敗しました\n';
        if (error.response.status === 422) {
            if (Array.isArray(error.response.data.errors)) {
                errorMessages += error.response.data.errors.join('\n');
            }
        }
        errorMessage.value = errorMessages
    }
}

const schema = yup.object({
  password: yup
    .string()
    .required("この項目は必須です")
    .min(6, "6文字以上で入力してください")
    .max(128, "128文字以下で入力してください"),
  passwordConfirm: yup
    .string()
    .required("この項目は必須です")
    .min(6, "6文字以上で入力してください")
    .max(128, "128文字以下で入力してください"),
  currentPassword: yup
    .string()
    .required("この項目は必須です")
    .min(6, "6文字以上で入力してください")
    .max(128, "128文字以下で入力してください")
});

const { validate } = useForm({
  validationSchema: schema,
  initialValues: {
    password: '',
    passwordConfirm: '',
    currentPassword: ''
  }
})

const { value: password, errorMessage: passwordError } = useField('password');
const { value: passwordConfirm, errorMessage: passwordConfirmError } = useField('passwordConfirm');
const { value: currentPassword, errorMessage: currentPasswordError } = useField('currentPassword');
</script>

<template>
    <Header />
    <ErrorMessage :errorMessage="errorMessage"/>
    <h1 class="signUpTitle">パスワード変更</h1>
    <div class="singUpInput">
        <form class="form" @submit.prevent="checkValidate">
            <div class="item">
                <label class="itemLabel" for="password">現在のパスワード</label>
                <input id="currentPassword" type="password" v-model="currentPassword">
            </div>
            <div class="item">
                <label class="itemLabel" for="password">パスワード</label>
                <input id="password" type="password" v-model="password">
            </div>
            <div class="item">
                <label class="itemLabel" for="passwordConfirm">パスワード(確認)</label>
                <input id="passwordConfirm" type="password" v-model="passwordConfirm">
            </div>
            <div class="signUpTitle">
                <button class="registerButton">更新</button>
            </div>
        </form>
    </div>
</template>

<style>
.form{
   width: 100%;
   margin:0 auto;
   padding: 50px;
   box-sizing: border-box;
}

.signUpTitle {
    padding-top: 40px;
    text-align: center;
}
 
.item{
    padding-top: 40px;
    width: 50%;
    margin: 0 auto;
}

.itemLabel{
    display: block;
    text-align: left;
}

 
.error-message-text{
    color: red;
    font-size: 15px;
}

.form input[type="password"] {
     padding: 10px;
     width: 100%;
 }
 
.form textarea{
   padding: 10px;
   height: 100px;
   font-size: 14px;
   width: 50%;
 }
 
.registerButton{
    background: #ffa500;
    color: white;
    font-size:16px;
    font-weight:bold;
    padding: 10px 50px;
}
</style>
