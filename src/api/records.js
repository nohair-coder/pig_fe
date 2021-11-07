import request from '@/utils/request'
import { localURL } from '@/api/baseURL'

const records = {
  All: '/station',
  Service: '/station',
  queryIntakeData: '/feedingdata'
}

export function getAllList () {
  return request({
    url: localURL + records.All,
    method: 'get'
  })
}

export function getServiceList (parameter) {
  return request({
    url: localURL + records.Service,
    method: 'get',
    params: parameter
  })
}

export function queryIntakeData (parameter) {
  return request({
    url: localURL + records.queryIntakeData,
    method: 'get',
    params: parameter
  })
}
