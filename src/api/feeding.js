import request from '@/utils/request'
import { localURL } from '@/api/baseURL'

const feeding = {
  queryAllFeedingSetList: '/feedingset/',
  setFood: '/feedingdata/'
}

export function queryAllFeedingSetList (parameter) {
  return request({
    url: localURL + feeding.queryAllFeedingSetList,
    method: 'get',
    params: parameter
  })
}

export function setFeeding (parameter) {
  return request({
    url: localURL + feeding.setFood,
    method: 'post',
    data: parameter
  })
}
