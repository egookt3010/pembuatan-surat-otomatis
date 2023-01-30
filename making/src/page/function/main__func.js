import $ from 'jquery';
import moment from 'moment';
moment.locale('id');

const configure = require('../../System/config/config.json');

function isEmpty(obj) {
  for (var prop in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, prop)) {
      return false;
    }
  }

  return JSON.stringify(obj) === JSON.stringify({});
}

function findVal(object, key) {
  var value;
  Object.keys(object).some(function (k) {
    if (k === key) {
      value = object[k];
      return true;
    }
    if (object[k] && typeof object[k] === 'object') {
      value = findVal(object[k], key);
      return value !== undefined;
    }
  });
  return value;
}

export const buildAutoDataPenduduk = (code, data) => {
  var source = code;

  const autoGet = $(code).find(`font[type='auto'][name='penduduk']`);
  if (autoGet.length > 0) {
    for (let i = 0; i < autoGet.length; i++) {
      if (
        data != undefined &&
        data != null &&
        $($(autoGet[i])).attr('fildquery') != undefined &&
        $($(autoGet[i])).attr('fildquery') != '' &&
        $($(autoGet[i])).attr('fildquery') != null
      ) {
        // findVal(penduduk, $($(autoGet[i])).attr("fildquery"))
        source = $(source)
          .find(
            `font[type='auto'][name='penduduk'][fildquery='${$(
              $(autoGet[i])
            ).attr('fildquery')}']`
          )
          .text(findVal(data, $($(autoGet[i])).attr('fildquery')) ?? '....')
          .css({
            'background-color': 'transparent',
            color: 'black',
          }).prevObject[0];
      }
    }
    return source != undefined && source != null ?
      source?.outerHTML ?? source :
      '';
  } else {
    return source;
  }
};

export const buildAutoDataOrangtua = (code, data) => {
  var source = code;

  const autoGet = $(code).find(`font[type='auto'][name='orangtua']`);
  if (autoGet.length > 0) {
    for (let i = 0; i < autoGet.length; i++) {
      if (
        $($(autoGet[i])).attr('fildquery') != undefined &&
        $($(autoGet[i])).attr('fildquery') != '' &&
        $($(autoGet[i])).attr('fildquery') != null
      ) {
        // findVal(penduduk, $($(autoGet[i])).attr("fildquery"))
        source = $(source)
          .find(
            `font[type='auto'][name='orangtua'][fildquery='${$(
              $(autoGet[i])
            ).attr('fildquery')}']`
          )
          .text(
            findVal(data ?? {}, $($(autoGet[i])).attr('fildquery')) ?? '......'
          )
          .css({
            'background-color': 'transparent',
            color: 'black',
          }).prevObject[0];
      }
    }
    return source != undefined && source != null ?
      source?.outerHTML ?? source :
      '';
  } else {
    return source;
  }
};

export const buildAutoDataDesa = (code, data) => {
  var source = code;

  const autoGet = $(code).find(`font[type='auto'][name='desa']`);
  if (autoGet.length > 0) {
    for (let i = 0; i < autoGet.length; i++) {
      if (
        data != undefined &&
        data != null &&
        $($(autoGet[i])).attr('fildquery') != undefined &&
        $($(autoGet[i])).attr('fildquery') != '' &&
        $($(autoGet[i])).attr('fildquery') != null
      ) {
        // findVal(penduduk, $($(autoGet[i])).attr("fildquery"))
        source = $(source)
          .find(
            `font[type='auto'][name='desa'][fildquery='${$($(autoGet[i])).attr(
              'fildquery'
            )}']`
          )
          .text(findVal(data, $($(autoGet[i])).attr('fildquery')) ?? '....')
          .css({
            'background-color': 'transparent',
            color: 'black',
          }).prevObject[0];
      }
    }
    return source != undefined && source != null ?
      source?.outerHTML ?? source :
      '';
  } else {
    return source;
  }
};

export const buildInput = (code, responseName) => {
  var source = code;
  const mGet = $(source).find(`font[type='manual']`);
  if (mGet.length > 0) {
    const ObjName = [];
    for (let i = 0; i < mGet.length; i++) {
      ObjName.push($($(mGet[i])).attr('name'));

      var InputComponent = `<input
                            type="${$(mGet[i]).attr('input')}"
                            class='form-input-style-papper inp h-20px shadow-sm ${$(
                              mGet[i]
                            ).attr('name')}'
                            mode="input"
                            id='${$(mGet[i]).attr('idForm')}'
                            name='${$(mGet[i]).attr('name')}'
                            placeholder='...........'
                            style="width:100px;"
                            />`;
      var InputComponentArea = `<textarea type="${$(mGet[i]).attr(
        'input'
      )}" class='form-input-style inp shadow-sm ${$(mGet[i]).attr('name')}'
      mode="input"
      id='${$(mGet[i]).attr('idForm')}'
      name='${$(mGet[i]).attr('name')}'
      placeholder='...........'
      ></textarea>`;

      source = $(source)
        .find(`font[type='manual'][name='${$(mGet[i]).attr('name')}']`)
        .replaceWith(
          $(mGet[i]).attr('input') == 'text-area' ?
          InputComponentArea :
          InputComponent
        ).prevObject[0];
    }
    responseName(ObjName);
    return source != undefined && source != null ? source.outerHTML : '';
  } else {
    return source;
  }
};

export const trasformationInputToOutput = (name, value, {
  id,
  type
}) => {
  if (name != 'signature-swiching') {
    const mGet = $(`[name='${name}']`).replaceWith(
      `<font type=${type} name='${name}' id="${id}" method="dev" mode="output" style="border-bottom:1px solid #ccc">${value}</font>`
    );
    return mGet;
  }
};

export const trasformationOutputChangeToInput = (name, value, {
  id,
  type
}) => {
  var InputComponent = `<input
  type="${type}"
  class='form-input-style-papper h-20px shadow-sm ${name}'
  mode="input"
  id='${id}'
  name='${name}'
  placeholder='...........'
  value='${value}'
  style="width:100px;"
  />`;
  var InputComponentArea = `<textarea type="${type}"
  class='form-input-style-papper h-20px shadow-sm ${name}'
  mode="input"
  id='${id}'
  name='${name}'
  placeholder='...........'
  style="white-space: pre-wrap;
  >${value}</textarea>`;
  if (name != 'signature-swiching') {
    const mGet = $(`font[name='${name}'][mode='output']`).replaceWith(
      type == 'text-area' ? InputComponentArea : InputComponent
    );
    return mGet;
  }
};


export const buildSignature = (code, data, response) => {
  let source = code;
  const autoGet = $(code).find(`font[type='auto'][name='signature']`);
  const sig = [];
  if (autoGet.length > 0) {
    for (let i = 0; i < autoGet.length; i++) {
      if (
        data != undefined &&
        data != null &&
        $($(autoGet[i])).attr('fildquery') != undefined &&
        $($(autoGet[i])).attr('fildquery') != '' &&
        $($(autoGet[i])).attr('fildquery') != null
      ) {
        var resultset = data.find(
          (o) => o.jabatan.nama_jabatan == $($(autoGet[i])).attr('fildquery')
        );

        if (resultset != undefined && resultset != null) {
          sig.push({
            id_perangkat: resultset.id_perangkat_desa,
            signature: resultset.signature,
            token: 'auto',
          });
          source =
            $(source)
            .find(
              `font[type='auto'][name='signature'][fildquery='${$(
                  $(autoGet[i])
                ).attr('fildquery')}']`
            )
            .text(resultset.penduduk.nama_lengkap ?? "")
            .css({
              'background-color': 'transparent',
              color: 'black',
            }).append(
              `<font>
              <input style="position: fixed; margin-top:20px" name='signature-swiching' checked="true" data-id="${$(
                $(autoGet[i])
              ).attr('fildquery')}" id='${
                resultset.id_perangkat_desa
              }' class='switch' type='checkbox' />
              </font>`
            )
            .prevObject[0]?.outerHTML ?? source;

          source =
            $(source)
            .find(
              `img[type='img-auto'][name='img-signature'][fildquery='${$(
                  $(autoGet[i])
                ).attr('fildquery')}']`
            )
            .attr(
              'src',
              `${configure.Api.server_url}user/signature/${resultset.signature}`
            ).prevObject[0]?.outerHTML ?? source;
        }
      }
    }
  }
  response(sig);
  return source;
};
export const buildAutoDataPerangkat = (code, data) => {
  let source = code;
  const autoGet = $(code).find(`font[type='auto'][name='perangkat']`);
  if (autoGet.length > 0) {
    for (let i = 0; i < autoGet.length; i++) {
      if (
        data != undefined &&
        data != null &&
        $($(autoGet[i])).attr('fildquery') != undefined &&
        $($(autoGet[i])).attr('fildquery') != '' &&
        $($(autoGet[i])).attr('fildquery') != null
      ) {
        var resultset = data.find(
          (o) => o.jabatan?.nama_jabatan == $($(autoGet[i])).attr('jabatan')
        );

        if (resultset != undefined && resultset != null) {
          source =
            $(source)
            .find(
              `font[type='auto'][name='perangkat'][fildquery='${$(
                  $(autoGet[i])
                ).attr('fildquery')}']`
            )
            .text(findVal(resultset, $($(autoGet[i])).attr('fildquery')))
            .css({
              'background-color': 'transparent',
              color: 'black',
            }).prevObject[0]?.outerHTML ?? source;
        }
      }
    }
  }
  return source;
};

export const buildKopSurat = (code, kop, result) => {
  let source = code;
  const autoGet = $(code).find(`div[data-query="kop_surat"]`);
  if (autoGet.length > 0) {
    source =
      $(code).find(`div[data-query="kop_surat"]`).html(kop).prevObject[0]
      ?.outerHTML ?? source;
  }
  result(source);
  return source;
};

export const buildNoSurat = (code, noSurat, result) => {
  let source = code;
  const autoGet = $(code).find(`font[data-query="no_surat"]`);
  if (autoGet.length > 0) {
    source =
      $(code).find(`font[data-query="no_surat"]`).text(noSurat)
      .prevObject[0]?.outerHTML ?? source;
  }
  result(source);
  return source;
};

export const buildAutoComponent = (code, response) => {
  let source = code;
  const autoGet = $(code).find(`font[type='auto'][name='component_autometic']`);
  if (autoGet.length > 0) {
    for (let i = 0; i < autoGet.length; i++) {
      if (
        $($(autoGet[i])).attr('fildquery') != undefined &&
        $($(autoGet[i])).attr('fildquery') != '' &&
        $($(autoGet[i])).attr('fildquery') != null
      ) {
        var value = ``;
        switch ($($(autoGet[i])).attr('fildquery')) {
          case 'create-now-date':
            value = moment().format('DD MMMM YYYY');
            break;
          case 'create-now-date-time':
            value = moment().format('Do MMMM YYYY, h:mm:ss');
            break;
          case 'create-now-date-day':
            value = moment().format('dddd, DD MMMM YYYY');
            break;
          case 'create-now-date-hour-day':
            value = moment().format('dddd,Do MMMM YYYY, h:mm:ss');
            break;
          case 'create-hour':
            value = moment().format('h:mm:ss a');
            break;

          default:
            value = ``;
            break;
        }

        source =
          $(source)
          .find(
            `font[type='auto'][name='component_autometic'][fildquery='${$(
                $(autoGet[i])
              ).attr('fildquery')}']`
          )
          ?.text(value)
          ?.css({
            'background-color': 'transparent',
            color: 'black',
          }).prevObject[0]?.outerHTML ?? source;
      }
    }
  }
  response('ok');
  return source;
};

export const CheckKopSurat = (code, response) => {
  const autoGet = $(code).find(`div[data-query="kop_surat"]`);
  if (autoGet.length > 0) {
    response(true);
  } else {
    response(false);
  }
};

export const CheckNoSurat = (code, response) => {
  const autoGet = $(code).find(`font[data-query="no_surat"]`);
  if (autoGet.length > 0) {
    response(true);
  } else {
    response(false);
  }
};