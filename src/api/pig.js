import request from '@/utils/request'
import { localURL } from '@/api/baseURL'

const pigApi = {
  All: '/pigbase/',
  queryAllList: '/pigbase/',
  additionPig: '/pigbase/',
  changeEarId: '/pigbase/',
  changeStationId: '/pigbase/',
  leaveStation: '/pigbase/'
}

export function getAllList () {
  return request({
    url: localURL + pigApi.All,
    method: 'get'
  })
}

export function queryAllList (parameter) {
  return request({
    url: localURL + pigApi.queryAllList,
    method: 'get',
    params: parameter
  })
}

export function additionOnePig (parameter) {
  return request({
    url: localURL + pigApi.additionPig,
    method: 'post',
    data: parameter
  })
}

export function changeEarId (parameter) {
  return request({
    url: localURL + pigApi.changeEarId,
    method: 'patch',
    data: parameter
  })
}

export function changeStationId (parameter) {
  return request({
    url: localURL + pigApi.changeStationId,
    method: 'put',
    data: parameter
  })
}

export function leaveStation (parameter) {
  return request({
    url: localURL + pigApi.leaveStation,
    method: 'delete',
    data: parameter
  })
}
