import {
  url_api,
  url_assets,
  url_base,
  url_api_server,
  url_server_api,
} from '../config/config'
import axios from 'axios'
import moment from 'moment'
import { penduduk, perangkat } from '../config/dummy'

const getpapper = async (cari, respose) => {
  const getSurat = await axios
    .get(`${url_api_server}wizard/getPapper/${cari}`)
    .catch((err) => {
      console.log(err)
    })
  respose(getSurat)
}
const getSearchPenduduk = (searching, respose) => {
  api_get(`${url_api_server}wizard/getPenduduk/${searching}`, respose)
}

const getPenduduk = (respose) => {
  api_get(`${url_api_server}wizard/getPenduduk`, respose)
}

const getJabatan = (respose) => {
  api_get(`${url_api_server}surat/jabatan`, respose)
}

const getPendudukByDesa = async (respose) => {
  respose(penduduk)
}
const getDataPerangkat = async (response) => {
  const _gets = await axios
    .get(`${url_api_server}perangkat/getPerangkatDesa`, {
      headers: {
        Authorization: 'Bearer ' + sessionStorage.getItem('_token'),
      },
    })
    .catch((err) => {
      response(err.respose)
    })
  if (_gets) {
    response(_gets?.data)
  }
}

const getKopSurat = async (response) => {
  const _gets = await axios
    .get(`${url_api_server}kop/getKopByAuth`, {
      headers: {
        Authorization: 'Bearer ' + sessionStorage.getItem('_token'),
      },
    })
    .catch((err) => {
      response(err.respose)
    })
  if (_gets) {
    response(_gets?.data)
  }
}

const postWizard = (data, respose) => {
  api_post(`${url_api_server}surat/create`, data, respose)
}

const updatePostWizard = (id, data, respose) => {
  api_post(`${url_api_server}surat/update/${id}`, data, respose)
}

async function api_post(url, data, response, error) {
  try {
    const res = await axios
      .post(url, data, {
        headers: {
          Authorization: 'Bearer ' + sessionStorage.getItem('_token'),
        },
      })
      .catch((err) => {
        error(err)
      })
    response(res.data)
    // console.log(sessionStorage.getItem("_token"));
  } catch (errors) {
    error(errors)
  }
}

const getDataDesa = async (response) => {
  const __gets = await axios
    .get(`${url_api_server}wizard/getDataDesa`, {
      headers: {
        Authorization: 'Bearer ' + sessionStorage.getItem('_token'),
      },
    })
    .catch((err) => {
      response(err.respose)
    })
  if (__gets) {
    response(__gets?.data)
  }
}

const getNoSurat = async (response) => {
  const __gets = await axios
    .get(`${url_api_server}format-no-surat`, {
      headers: {
        Authorization: 'Bearer ' + sessionStorage.getItem('_token'),
      },
    })
    .catch((err) => {
      response(err.respose)
    })
  if (__gets) {
    response(__gets?.data)
  }
}

const RequestNoSurat = async (req, res) => {
  const __gets = await axios
    .post(`${url_api_server}format-no-surat/created-no-surat`, req, {
      headers: {
        Authorization: 'Bearer ' + sessionStorage.getItem('_token'),
      },
    })
    .catch((err) => {
      res(err.respose)
    })
  if (__gets) {
    res(__gets?.data)
  }
}

async function api_get(url, response) {
  const ___gets = await axios
    .get(url, {
      headers: {
        Authorization: 'Bearer ' + sessionStorage.getItem('_token'),
      },
    })
    .catch((err) => {
      response(err.respose)
    })
  if (___gets.status != undefined) {
    response(___gets)
  }
}
async function sendWa(number, msg, result) {
  const sender = await axios.post(
    `https://api.ultramsg.com/instance31582/messages/chat`,
    {
      token: 't7o41z1q04asfcnk',
      to: number,
      body: msg,
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  )
  result(sender)
}

export {
  getPenduduk,
  getPendudukByDesa,
  getpapper,
  getSearchPenduduk,
  getDataPerangkat,
  getKopSurat,
  postWizard,
  getDataDesa,
  getNoSurat,
  getJabatan,
  RequestNoSurat,
  updatePostWizard,
  sendWa,
}
