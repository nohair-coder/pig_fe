import request from '@/utils/request'
import { localURL } from '@/api/baseURL'

const stationApi = {
  All: '/station/',
  AddStation: '/station/',
  getBuildUnitStationList: '/handlestation/',
  changeStatus: '/handlestation/'
}

export function queryAllStationList (parameter) {
  return request({
    url: localURL + stationApi.All,
    method: 'get',
    params: parameter
  })
}

export function getBuildUnitStationList () {
  return request({
    url: localURL + stationApi.getBuildUnitStationList,
    method: 'get'
  })
}

export function addOneStation (parameter) {
  return request({
    url: localURL + stationApi.AddStation,
    method: 'post',
    data: parameter
  })
}

export function changeStatus (parameter) {
  return request({
    url: localURL + stationApi.changeStatus,
    method: 'post',
    data: parameter
  })
}
