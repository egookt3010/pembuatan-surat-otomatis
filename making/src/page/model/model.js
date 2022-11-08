import {
  url_api,
  url_assets,
  url_base,
  url_api_server,
} from '../config/config';
import axios from 'axios';
import moment from 'moment';
import { penduduk, perangkat } from '../config/dummy';

const getpapper = async (cari, respose) => {
  const getSurat = await axios
    .get(`${url_api_server}wizard/getPapper/${cari}`)
    .catch((err) => {
      console.log(err);
    });
  respose(getSurat);
};
const getSearchPenduduk = (searching, respose) => {
  api_get(`${url_api_server}wizard/getPenduduk/${searching}`, respose);
};

const getPenduduk = (respose) => {
  api_get(`${url_api_server}wizard/getPenduduk`, respose);
};

const getPendudukByDesa = async (respose) => {
  respose(penduduk);
};
const getDataPerangkat = async (response) => {
  const _gets = await axios
    .get(`${url_api_server}perangkat/getPerangkatDesa`, {
      headers: {
        Authorization: 'Bearer ' + sessionStorage.getItem('_token'),
      },
    })
    .catch((err) => {
      response(err.respose);
    });
  if (_gets) {
    response(_gets?.data);
  }
};

const getKopSurat = (respose) => {
  api_get(`${url_api_server}kop/getKopByAuth`, respose);
};

const postWizard = (data, respose) => {
  api_post(`${url_api_server}surat/create`, data, respose);
};

async function api_post(url, data, response) {
  try {
    const res = await axios.post(url, data, {
      headers: {
        Authorization: 'Bearer ' + sessionStorage.getItem('_token'),
      },
    });
    response(res.data);
    // console.log(sessionStorage.getItem("_token"));
  } catch (error) {
    console.log(error);
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
      response(err.respose);
    });
  console.log('1', __gets);
  if (gets) {
    console.log('2', __gets);
    response(__gets?.data);
  }
};

async function api_get(url, response) {
  const ___gets = await axios
    .get(url, {
      headers: {
        Authorization: 'Bearer ' + sessionStorage.getItem('_token'),
      },
    })
    .catch((err) => {
      response(err.respose);
    });
  if (___gets.status != undefined) {
    response(___gets);
  }
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
};
