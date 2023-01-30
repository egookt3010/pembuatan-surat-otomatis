import React, { useRef, useEffect, useState } from 'react'
import './style/style.scss'
import { useReactToPrint } from 'react-to-print'
import { ComponentToPrint } from './ComponentToPrint'
import $ from 'jquery'

import { getPapperRequest } from '../System/Model/model_api'
import styled from 'styled-components'
import {
  FaSpinner,
  FaArrowCircleLeft,
  FaPrint,
  FaCog,
  FaEdit,
} from 'react-icons/fa'

import { Build } from './Build'
import Modal from 'react-responsive-modal'
import axios from 'axios'
import { postWizard } from './model/model'
// redux
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'

// test
import { pendudukDummy, Perangkat } from '../System/data/dummy'

import domtoimage from 'dom-to-image'
import swal from 'sweetalert'

// ///////////////////////////////////
import Logo from './config/Logo'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import 'react-tabs/style/react-tabs.css'
import Select from 'react-select'
import {
  getPendudukByDesa,
  getpapper,
  getSearchPenduduk,
  getDataPerangkat,
  getKopSurat,
  getPenduduk,
  getDataDesa,
  getNoSurat,
  getJabatan,
  RequestNoSurat,
} from './model/model'
import { url_printing } from './config/config'
import { CheckKopSurat, CheckNoSurat } from './function/main__func'
import Editor from './components/CkEditor'
import PengaturanPrint from './components/PengaturanPrint'

export default function Surat(props) {
  const [data, setData] = useState(null)
  const [penduduk, setpenduduk] = useState({})
  const [dataPerangkat, setdataPerangkat] = useState([])
  const [data_desa, setData_desa] = useState({})
  const [configPrint, setConfigPrint] = useState(null)
  const componentRef = useRef()
  const [setterpadding, setSetterpadding] = useState({})
  const [open, setOpen] = useState(false)
  const [openConfigs, setOpenConfigs] = useState(false)
  const [content, setContent] = useState(``)
  const [data_jabatan, setData_jabatan] = useState([])

  // new update
  const [masterPenduduk, setMasterPenduduk] = useState([])
  const [optionDataPenduduk, setOptionDataPenduduk] = useState([])
  const [pendudukSelector, setPendudukSelection] = useState({})

  const [statusKop, setStatusKop] = useState(false)
  const [kopSurat, setKopSurat] = useState([])
  const [optKopSurat, setOptKopSurat] = useState([])
  const [kopSelected, setKopSelected] = useState(``)
  const [checkStatusNoSurat, setCheckStatusNoSurat] = useState(false)
  const [noSurat, setNosurat] = useState(``)
  const [statusEdit, setStatusEdit] = useState(false)
  const [lampiran, setLampiran] = useState([])
  const [configure, setConfigure] = useState({})
  const [dataSurat, setDataSurat] = useState({})

  const [dataLampiran, setDataLampiran] = useState([])
  const [fileLampiran, setFileLampiran] = useState([])
  const [listNoSurat, setListNoSurat] = useState([])

  // ////////////////////////////////////////////////////////////
  // useEffect(() => {
  //   if (props.open) {
  //     setOpen(props.open);
  //   }
  // }, [props.open]);
  const [loadingNext, setLoadingNext] = useState(false)

  const getRedux = useSelector((state) => state)
  const dispatch = useDispatch()

  const onOpenModal = () => setOpen(true)
  const onCloseModal = () => setOpen(false)

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  })
  // useEffect(() => {
  //   if (
  //     props.globalData != undefined &&
  //     Object?.keys(props?.globalData ?? {}).length > 0
  //   ) {
  //     setData(props.code);
  //     setConfigPrint(getRedux.papperSetting);
  //     setpenduduk(props?.dataPenduduk ?? {});
  //     setdataPerangkat(props?.dataPerangkat ?? []);
  //   }
  // }, [props.globalData, props.dataPenduduk]);

  const hndelReplacePenduduk = (penduduk) => {
    setpenduduk(penduduk ?? {})
  }

  useEffect(() => {
    if (sessionStorage.getItem('_surat') != undefined) {
      const surat =
        JSON?.parse(sessionStorage.getItem('_surat') ?? '{}') ?? '{}'

      setDataSurat(surat)
      setData(surat?.code ?? '')
      setConfigPrint(JSON.parse(surat?.config_print ?? '{}'))
      func__statusKop(surat?.code ?? '')
      func__checkStatusNoSurat(surat?.code ?? '')
      setLampiran(JSON.parse(surat?.attachment ?? '[]'))
      setConfigure(JSON.parse(surat?.config_print ?? '[]'))
      hndelGetPenduduk()
      getDataPerangkatDesa()
      getDesa()
      getNomorSurat()
      getDatajabatan()
      sessionStorage.setItem('PegaturanPrint', surat?.config_print ?? '[]')
      setSetterpadding({
        paddingTop:
          JSON.parse(surat?.config_print ?? '[]')?.paperMargin?.top ?? 0,
        paddingBottom:
          JSON.parse(surat?.config_print ?? '[]')?.paperMargin?.bottom ?? 0,
        paddingLeft:
          JSON.parse(surat?.config_print ?? '[]')?.paperMargin?.left ?? 0,
        paddingRight:
          JSON.parse(surat?.config_print ?? '[]')?.paperMargin?.right ?? 0,
      })
    }
  }, [])

  const getDatajabatan = () => {
    getJabatan((res) => {
      setData_jabatan(res?.data?.response ?? [])
    })
  }

  const getNomorSurat = () => {
    getNoSurat((result) => {
      console.log(result?.response)
      const dd = []
      result?.response?.map((x, i) => {
        dd.push({ value: x?.id, label: x?.title })
      })
      setListNoSurat(dd)
    })
  }

  const hndelChangeState = () => {
    if (sessionStorage.getItem('PegaturanPrint') != undefined) {
      const configPrint = JSON.parse(sessionStorage.getItem('PegaturanPrint'))
      setConfigPrint(configPrint)
      setSetterpadding({
        paddingTop: configPrint?.paperMargin?.top ?? 0,
        paddingBottom: configPrint?.paperMargin?.bottom ?? 0,
        paddingLeft: configPrint?.paperMargin?.left ?? 0,
        paddingRight: configPrint?.paperMargin?.right ?? 0,
      })
    }
  }

  // const hndelGetPenduduk = () => {
  //   onCloseModal();
  // };
  const hndelBack = () => {
    window.history.go(-1)
    return false
  }

  const hndelCetak = () => {
    // console.log(getRedux);
    if ($('#frame-letter').find('.inp').length) {
      $('#frame-letter').find('.inp')[0].focus()
    } else {
      // alert warning
      swal({
        title: 'Yakin!',
        text: 'Setelah anda mencatak surat, surat akan otomatis tersimpan.',
        icon: 'warning',
        button: 'OK',
      }).then((komit) => {
        if (komit) {
          $('.containerLoadingFull')
            .addClass('show-load')
            .removeClass('hide-load')

          // ====================================================================
          let mainContent =
            $('#frame-letter div')
              .find(`font[method='dev']`)
              .css('border', 'none').prevObject[0]?.innerHTML ?? ``

          mainContent =
            $(mainContent).find("input[type='checkbox']").hide().prevObject[0]
              ?.innerHTML ?? ``

          setContent(mainContent)
          // ====================================================================
          const NameManualInput = JSON.parse(dataSurat?.manual_name ?? '[]')
          var SetValValue = []
          NameManualInput.map((_, i) => {
            SetValValue.push({
              name: _,
              value: $(mainContent)
                .find('[name=' + _ + ']')
                .text(),
            })
          })

          if (dataSurat.id_wizard_template) {
            const form_data = new FormData()
            form_data.append('id_wizard', dataSurat?.id_wizard_template ?? 0)
            form_data.append(
              'content',
              $('#frame-letter div')
                .find(`font[method='dev']`)
                .css('border', 'none').prevObject[0]?.innerHTML ?? ``,
            )
            form_data.append('code', data)
            form_data.append('nik', penduduk.nik)
            form_data.append('penduduk', JSON.stringify(penduduk))
            form_data.append('no_surat', noSurat ?? '')
            form_data.append('perangkat', JSON.stringify(dataPerangkat))
            form_data.append('config', JSON.stringify(configPrint))
            form_data.append('input', JSON.stringify(SetValValue))
            if (lampiran.length > 0) {
              lampiran.map((_o, i) => {
                var input = document.getElementById(`${_o.name}`)
                form_data.append(`${_o.name}`, input.files[0])
              })
              form_data.append('data_lampiran', JSON.stringify(lampiran))
            }
            postWizard(form_data, (res) => {
              // console.log(res);
              const TimePrint = setInterval(() => {
                $('.containerLoadingFull')
                  .addClass('hide-load')
                  .removeClass('show-load')
                // handlePrint();
                window.open(url_printing + res?.data?.id_surat)
                clearInterval(TimePrint)
              }, 1000)
            })
          }
        } else {
          $('.containerLoadingFull')
            .addClass('hide-load')
            .removeClass('show-load')
        }
      })
    }
  }

  const hndelGetPenduduk = (ev) => {
    getPenduduk((result) => {
      if (result?.status ?? 400 == 200) {
        setMasterPenduduk(result.data)
        const opt = []
        result.data.map((_, i) => {
          opt.push({ value: _.nik, label: _.nama_lengkap })
        })

        setOptionDataPenduduk(opt)
      }
    })
  }
  const func__statusKop = (code) => {
    CheckKopSurat(`<div>${code}</div>`, (res, kop) => {
      setStatusKop(res)
      if (res) {
        getKopSurat((result) => {
          if (result.length > 0) {
            setKopSurat(result)

            const opt = []
            result?.map((_, i) => {
              opt.push({
                data: _?.code ?? '',
                value: _.id_kop_surat,
                label: _.judul_kop,
              })
            })
            setOptKopSurat(opt)
          }
        })
      }
    })
  }

  const hndelPendudukChange = (thisOpt) => {
    getSearchPenduduk(thisOpt.value, (result) => {
      if (result?.status ?? 400 == 200) {
        setpenduduk(result.data[0])
      }
    })
  }
  const getDataPerangkatDesa = () => {
    getDataPerangkat((result) => {
      setdataPerangkat(result?.response ?? [])
    })
  }

  const hndelChangeKop = (thisKop) => {
    setKopSelected(thisKop.data)
  }

  const func__checkStatusNoSurat = (code) => {
    CheckNoSurat(`<div>${code}</div>`, (res) => {
      setCheckStatusNoSurat(res)
    })
  }
  // const hndelNoSurat = (thisNo) => {
  //   setNosurat(thisNo.target.value);
  // };
  const getDesa = () => {
    getDataDesa((result) => {
      setData_desa(result ?? {})
    })
  }

  const funcSelectedNoSurat = (e) => {
    const form_data = new FormData()
    form_data.append('idNoSurat', e.value)
    form_data.append('id_wizard_template', dataSurat?.id_wizard_template)
    RequestNoSurat(form_data, (result) => {
      setNosurat(result)
    })
  }

  return (
    <div id="printing-root">
      {statusEdit ? (
        <Editor
          code={data}
          callback={(code) => {
            setData(code)
          }}
          back={() => {
            setStatusEdit(false)
          }}
        />
      ) : (
        <>
          <div id="main-content">
            <div className="top-bar">
              <div className="top-menu-printing">
                <button className="btn-back-printing" onClick={hndelBack}>
                  <FaArrowCircleLeft size={16} />
                </button>
                <div style={{ display: 'flex' }}>
                  <button
                    className="btn-printing bg-success"
                    onClick={() => {
                      setStatusEdit(!statusEdit)
                    }}
                  >
                    <FaEdit size={16} /> EDIT
                  </button>

                  {!props.printObj && (
                    <button
                      className="btn-printing bg-secondary"
                      style={{ marginLeft: '10px' }}
                      onClick={hndelCetak}
                    >
                      <FaPrint size={16} /> PRINT
                    </button>
                  )}
                  <div
                    style={{
                      width: '380px',
                    }}
                  ></div>
                </div>
              </div>
            </div>
            <Build
              layout={configPrint}
              padding={setterpadding}
              ref={componentRef}
              code={data ?? null}
              penduduk={penduduk}
              perangkat={dataPerangkat}
              kop={kopSelected ?? ''}
              nosurat={noSurat ?? ''}
              dataDesa={data_desa ?? {}}
              jabatan={data_jabatan ?? []}
            />
            {/* <div
              className='page'
              style={setterpadding}
              data-size={configPrint != null && configPrint.paperSize}
              data-layout={configPrint != null && configPrint.paperOrientation}>
              <Build
                layout={configPrint}
                padding={setterpadding}
                ref={componentRef}
                code={data ?? null}
                penduduk={penduduk}
                perangkat={dataPerangkat}
                kop={kopSelected ?? ''}
                nosurat={noSurat ?? ''}
                dataDesa={data_desa ?? {}}
              />
            </div> */}
          </div>
          <div id="aside">
            <div className="header-logo">
              <Logo />
            </div>
            <div className="content-aside">
              <Tabs>
                <TabList>
                  <Tab>DATA</Tab>
                  <Tab>LAMPIRAN</Tab>
                  <Tab>PENGATURAN</Tab>
                </TabList>

                <TabPanel>
                  <div className="content-aside-card">
                    <div className="form-group">
                      <label htmlFor="">Nama Request Surat</label>
                      <Select
                        options={optionDataPenduduk}
                        onChange={hndelPendudukChange}
                      />
                    </div>
                    {statusKop && (
                      <div className="form-group">
                        <label htmlFor="">Kop Surat</label>
                        <Select
                          options={optKopSurat}
                          onChange={hndelChangeKop}
                        />
                      </div>
                    )}
                    {checkStatusNoSurat && (
                      <>
                        <div className="form-group">
                          <label htmlFor="">Format No Surat</label>
                          <Select
                            options={listNoSurat}
                            onChange={funcSelectedNoSurat}
                          />
                        </div>
                        {/* <div className='form-group'>
                          <label htmlFor=''>Nomor Surat</label>
                          <input
                            type='text'
                            className='input-text'
                            onKeyUp={hndelNoSurat}
                          />
                        </div> */}
                      </>
                    )}
                  </div>
                </TabPanel>
                <TabPanel>
                  <div
                    className="widget-cards widget-lampiran w-100"
                    style={{ marginTop: '15px' }}
                  >
                    {lampiran.map((item, index) => (
                      <div
                        className="form-group mb-1"
                        style={{
                          width: '100%',
                        }}
                      >
                        <label
                          htmlFor=""
                          className="labels text-ubuntu-regular text-light"
                          style={{ fontSize: '2vh' }}
                        >
                          {item.value}
                        </label>
                        <div className="text-left msg-inp"></div>
                        <input
                          type="file"
                          className="input-text shadow-sm text-ubuntu"
                          required={item.required}
                          data-type="attachment"
                          name={item.name}
                          id={item.name}
                          // onChange={(e) => {
                          //   const f = e.target.files[0];
                          //   setFileLampiran([...fileLampiran, f]);
                          //   setDataLampiran([
                          //     ...dataLampiran,
                          //     {
                          //       ...item,
                          //       file: f.name,
                          //     },
                          //   ]);
                          // }}
                          placeholder="lebel atribut"
                        />
                      </div>
                    ))}
                  </div>
                  {/* <PengaturanPrint defautConfig={configPrint} /> */}
                </TabPanel>
                <TabPanel>
                  <PengaturanPrint
                    data={configure}
                    updateState={hndelChangeState}
                  />
                  {/* <PengaturanPrint defautConfig={configPrint} /> */}
                </TabPanel>
              </Tabs>
            </div>
          </div>
        </>
      )}
      {/* <div style={{ display: 'none' }}>
        <ComponentToPrint
          ref={componentRef}
          content={content}
          paperSize={configPrint?.paperSize ?? {}}
          orientasi={configPrint?.paperOrientation ?? {}}
          margin={{
            top: configPrint?.paperMargin?.top ?? 0,
            bottom: configPrint?.paperMargin?.bottom ?? 0,
            left: configPrint?.paperMargin?.left ?? 0,
            right: configPrint?.paperMargin?.right ?? 0,
          }}
        />
      </div> */}
    </div>
  )
}
