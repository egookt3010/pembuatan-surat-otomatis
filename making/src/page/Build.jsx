import axios from 'axios';
import React, { useEffect, useState } from 'react';
import $ from 'jquery';
import moment from 'moment';
// import "moment/dist/locale/id";
import {
  buildAutoDataPenduduk,
  buildInput,
  trasformationInputToOutput,
  trasformationOutputChangeToInput,
  buildAutoDataPerangkat,
  buildSignature,
  buildAutoComponent,
  buildKopSurat,
  buildAutoDataOrangtua,
  buildNoSurat,
  buildAutoDataDesa,
} from './function/main__func';
// redux
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';

const configure = require('../System/config/config.json');

export default function Build(props) {
  moment.locale('id');
  const [data, setData] = useState(null);
  const [penduduk, setpenduduk] = useState(null);
  const [loading, setLoading] = useState(true);
  const [Codes, setCodes] = useState(null);
  const [inputName, setInputName] = useState([]);
  // ------
  const [valChange, setValChange] = useState(null);
  // redux
  const getRedux = useSelector((state) => state);
  const dispatch = useDispatch();

  const [signiture, setSigniture] = useState(null);
  // --------
  //   effect to get data
  useEffect(() => {
    if (props.code != undefined && props.code != null && props.code != '') {
      var codeBuilding = buildAutoDataPenduduk(
        `<div>${props?.code ?? '<></>'}</div>`,
        props.penduduk
      );
      codeBuilding = buildAutoDataOrangtua(
        codeBuilding,
        props.penduduk.orangtua
      );
      codeBuilding = buildAutoDataDesa(codeBuilding, props.dataDesa);
      console.log(props.dataDesa);
      codeBuilding = buildAutoDataPerangkat(codeBuilding, props.perangkat);

      codeBuilding = buildInput(codeBuilding, (resuts) => {
        setInputName(resuts);
      });

      codeBuilding = buildSignature(codeBuilding, props.perangkat, (resuts) => {
        localStorage.setItem('signiture', JSON.stringify(resuts));
      });

      codeBuilding = buildAutoComponent(codeBuilding, (res) => {
        // setSigniture(res);
      });

      if (props.kop != '' && props.kop != null && props.kop != undefined) {
        codeBuilding = buildKopSurat(codeBuilding, props.kop, (result) => {
          // console.log("||/", result);
        });
      }

      if (props.nosurat != '' && props.nosurat != null) {
        codeBuilding = buildNoSurat(codeBuilding, props.nosurat, (result) => {
          // console.log("||/", result);
        });
      }

      setCodes(codeBuilding);
      dispatch({
        type: 'SET_CODE',
        payload: {
          code: `${codeBuilding}`,
        },
      });
      setLoading(false);
    }
  }, [
    props.code,
    props.dataPenduduk,
    props.dataPerangkat,
    props.globalData,
    props.penduduk,
    props.kop,
    props.nosurat,
    props.dataDesa,
  ]);

  useEffect(() => {
    if (props.penduduk != undefined && props.penduduk != null) {
      setpenduduk(props.penduduk);
    }
  }, [props.penduduk]);
  //   ====================

  // trasformasi manual ------------------------------
  useEffect(() => {
    if ($) {
      $('.page').on('change', function (e) {
        trasformationInputToOutput(
          $(e.target).attr('name'),
          $(e.target).val(),
          {
            id: $(e.target).attr('id'),
            type: $(e.target).attr('type'),
          }
        );
      });
      $('.page').on('click', function (e) {
        console.log($(e.target).attr('type'));
        if (
          $(e.target).attr('type') == 'text-area' ||
          $(e.target).attr('type') == 'text'
        ) {
          trasformationOutputChangeToInput(
            $(e.target).attr('name'),
            $(e.target).text(),
            {
              id: $(e.target).attr('id'),
              type: $(e.target).attr('type'),
            }
          );
        }
      });
      $(document).on('click', "[name='signature-swiching']", function (e) {
        if (!e.target.checked) {
          $(
            `img[type='img-auto'][name='img-signature'][fildquery='${$(
              e.target
            ).attr('data-id')}']`
          ).css('opacity', '0');
        } else {
          $(
            `img[type='img-auto'][name='img-signature'][fildquery='${$(
              e.target
            ).attr('data-id')}']`
          ).css('opacity', '1');
        }
      });
    }
  }, [$]);
  useEffect(() => {
    dispatch({
      type: 'SET_INPUT_NAME',
      payload: inputName,
    });
  }, [inputName]);
  // --------------------------------------------------

  return (
    <div id='frame-letter'>
      {Codes != null && (
        <>
          <div
            id='content'
            dangerouslySetInnerHTML={{ __html: `${Codes}` }}></div>
        </>
      )}
    </div>
  );
}
// 1409055210780002
