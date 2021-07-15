import { extend } from 'vee-validate'
import { required, numeric } from 'vee-validate/dist/rules'

extend('required', {
  ...required,
  message: 'กรุณากรอกข้อมูลให้ครบถ้วน'
})

extend('numeric', {
  ...numeric,
  message: 'กรุณากรอกตัวเลขเท่านั้น'
})
