const dataChecker = function (data, json) {
  let type = typeof (data)
  switch (type) {
    case 'string':
      return data
    case 'object':
      if (json) {
        return JSON.stringify(data)
      } else {
        let counter = 0
        let targetString = ''
        for (let prop in data) {
          if (data.hasOwnProperty(prop)) {
            let propFilter = prop.replace(/&/g, '')
            let dataFilter = data[prop].toString().replace(/&/g, '')
            if (counter === 0) {
              targetString = targetString + propFilter + '=' + dataFilter
            } else {
              targetString = targetString + '&' + propFilter + '=' + dataFilter
            }
            counter++
          }
        }
        return targetString
      }
    default:
      return data
  }
}

const get = function get (url, data, json, successHandle, errorHandle, blob) {
  let xmlhttp = new XMLHttpRequest()
  if (xmlhttp != null) {
    xmlhttp.onreadystatechange = function () {
      if (xmlhttp.readyState === 4) { // 4 = "loaded"
        if (xmlhttp.status === 200) { // 200 = "OK"
          if (blob) {
            successHandle(xmlhttp.response)
          } else {
            successHandle(xmlhttp.responseText)
          }
        } else {
          if (blob) {
            errorHandle(xmlhttp.response)
          } else {
            errorHandle(xmlhttp.statusText)
          }
        }
      }
    }
    let targetData = dataChecker(data, json)
    if (json) {
      targetData = 'json=' + targetData
    }
    xmlhttp.open('GET', url + (targetData !== '' ? '?' : '') + targetData, true)
    if (blob) {
      xmlhttp.responseType = 'blob'
    }
    xmlhttp.send(null)
  }
}

const post = function post (url, data, json, successHandle, errorHandle, blob) {
  let xmlhttp = new XMLHttpRequest()
  if (xmlhttp != null) {
    xmlhttp.onreadystatechange = function () {
      if (xmlhttp.readyState === 4) { // 4 = "loaded"
        if (xmlhttp.status === 200) { // 200 = "OK"
          if (blob) {
            successHandle(xmlhttp.response)
          } else {
            successHandle(xmlhttp.responseText)
          }
        } else {
          if (blob) {
            errorHandle(xmlhttp.response)
          } else {
            errorHandle(xmlhttp.statusText)
          }
        }
      }
    }
    let targetData = dataChecker(data, json)
    xmlhttp.open('POST', url, true)
    if (json) {
      xmlhttp.setRequestHeader('Content-Type', 'application/json')
    } else {
      xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
    }
    if (blob) {
      xmlhttp.responseType = 'blob'
    }
    xmlhttp.send(targetData)
  }
}

const postFormData = function postFormData (url, formData, successHandle, errorHandle, progressHandle) {
  let xmlhttp = new XMLHttpRequest()
  if (xmlhttp != null) {
    xmlhttp.onreadystatechange = function () {
      if (xmlhttp.readyState === 4) { // 4 = "loaded"
        if (xmlhttp.status === 200) { // 200 = "OK"
          successHandle(xmlhttp.responseText)
        } else {
          errorHandle(xmlhttp.statusText)
        }
      }
    }
    xmlhttp.addEventListener('progress', progressHandle);
    xmlhttp.open('POST', url, true)
    xmlhttp.send(formData)
  }
}

export default {
  get: get,
  post: post,
  postFormData: postFormData
}
