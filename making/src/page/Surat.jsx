import React, { useRef, useEffect, useState } from 'react';
import './style/style.scss';
import $ from 'jquery';
import { FaArrowCircleLeft, FaPrint, FaEdit, FaCopy } from 'react-icons/fa';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import Select from 'react-select';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import swal from 'sweetalert';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// ///////////////////////////////////
import Logo from './config/Logo';
import { Build } from './Build';
import { postWizard } from './model/model';
import {
  getSearchPenduduk,
  getDataPerangkat,
  getKopSurat,
  getPenduduk,
  getDataDesa,
  getNoSurat,
  getJabatan,
  RequestNoSurat,
  senderWa,
} from './model/model';
import { url_printing } from './config/config';
import { CheckKopSurat, CheckNoSurat } from './function/main__func';
import Editor from './components/CkEditor';
import PengaturanPrint from './components/PengaturanPrint';
import LoadingSpinner from './components/LoadingSpinner';

export default function Surat(props) {
  /**
   * !STATE
   *  */
  const [data, setData] = useState(null);
  const [penduduk, setpenduduk] = useState({});
  const [dataPerangkat, setdataPerangkat] = useState([]);
  const [data_desa, setData_desa] = useState({});
  const [configPrint, setConfigPrint] = useState(null);
  const componentRef = useRef();
  const [setterpadding, setSetterpadding] = useState({});
  const [content, setContent] = useState(``);
  const [data_jabatan, setData_jabatan] = useState([]);
  // ^PENDUDUK
  const [masterPenduduk, setMasterPenduduk] = useState([]);
  const [optionDataPenduduk, setOptionDataPenduduk] = useState([]);
  const [pendudukSelector, setPendudukSelection] = useState({});
  // ^END PENDUDUK
  // !||||||||||||||
  // ^KOP
  const [statusKop, setStatusKop] = useState(false);
  const [kopSurat, setKopSurat] = useState([]);
  const [optKopSurat, setOptKopSurat] = useState([]);
  const [kopSelected, setKopSelected] = useState(``);
  const [selectionKop, setSelectionKop] = useState(null);
  const [defaultValueKop, setDefaultValueKop] = useState(null);
  // ^END KOP
  // !||||||||||||||
  // ^NO SURAT
  const [checkStatusNoSurat, setCheckStatusNoSurat] = useState(false);
  const [noSurat, setNosurat] = useState(``);
  const [defaultValueNoSurat, setDefaultValueNoSurat] = useState([]);
  const [noSuratValueSelected, setNoSuratValueSelected] = useState(null);
  // ^END NOSURAT
  // !||||||||||||||
  const [statusEdit, setStatusEdit] = useState(false);
  const [lampiran, setLampiran] = useState([]);
  const [configure, setConfigure] = useState({});
  const [dataSurat, setDataSurat] = useState({});
  const [listNoSurat, setListNoSurat] = useState([]);
  const [hndelSignatures, setHndelSignatures] = useState([]);
  const [loadingNext, setLoadingNext] = useState(false);
  const [sig, setSig] = useState(false);
  const [seder, setSeder] = useState(true);

  // ^SIGNATURE
  const [signatureData, setSignatureData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [idSuratTerbuat, setIdSuratTerbuat] = useState(null);
  /**
   * !END STATE
   */
  //
  /**
   * !REDUX
   */
  const getRedux = useSelector((state) => state);
  const dispatch = useDispatch();
  /**
   * !END
   */

  function isEmpty(args) {
    if (args == 'null') return true;
    if (args == '') return true;
    if (args == ' ') return true;
    if (args == 'undefined') return true;
    if (args == null) return true;
    if (args == undefined) return true;
    if (args == false) return true;
    return false;
  }

  /*
   ~INISIAL ELEMENTS ----------------------------------------------------
   */
  useEffect(() => {
    if (sessionStorage.getItem('_surat') != undefined) {
      const surat =
        JSON?.parse(sessionStorage.getItem('_surat') ?? '{}') ?? '{}';
      setDataSurat(surat);
      setData(surat?.code ?? '');
      setConfigPrint(JSON.parse(surat?.config_print ?? '{}'));
      func__statusKop(surat?.code ?? '');
      func__checkStatusNoSurat(surat?.code ?? '');
      setLampiran(JSON.parse(surat?.attachment ?? '[]'));
      setConfigure(JSON.parse(surat?.config_print ?? '[]'));
      hndelGetPenduduk();
      getDataPerangkatDesa();
      getDesa();
      getNomorSurat(surat);
      getDatajabatan();
      sessionStorage.setItem('PegaturanPrint', surat?.config_print ?? '[]');
      setSetterpadding({
        paddingTop:
          JSON.parse(surat?.config_print ?? '[]')?.paperMargin?.top ?? 0,
        paddingBottom:
          JSON.parse(surat?.config_print ?? '[]')?.paperMargin?.bottom ?? 0,
        paddingLeft:
          JSON.parse(surat?.config_print ?? '[]')?.paperMargin?.left ?? 0,
        paddingRight:
          JSON.parse(surat?.config_print ?? '[]')?.paperMargin?.right ?? 0,
      });
    }
  }, []);
  /*
   ~END INISIAL ELEMENTS ----------------------------------------------------
   */
  // *|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
  /*
   ~AMBIL DATA JABATAN  -----------------------------------------------------
   */
  const getDatajabatan = () => {
    getJabatan((res) => {
      setData_jabatan(res?.data?.response ?? []);
    });
  };
  /*
   ~END AMBIL DATA JABATAN  -----------------------------------------------------
   */
  // *||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||

  /*
   ~PENGATURAN PRINT ----------------------------------------------------
   */
  const hndelChangeState = () => {
    if (sessionStorage.getItem('PegaturanPrint') != undefined) {
      const configPrint = JSON.parse(sessionStorage.getItem('PegaturanPrint'));
      setConfigPrint(configPrint);
      setSetterpadding({
        paddingTop: configPrint?.paperMargin?.top ?? 0,
        paddingBottom: configPrint?.paperMargin?.bottom ?? 0,
        paddingLeft: configPrint?.paperMargin?.left ?? 0,
        paddingRight: configPrint?.paperMargin?.right ?? 0,
      });
    }
  };
  /*
   ~END PENGATURAN PRINT 
   */
  // *|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
  /*
   ~HNDEL BACK 
   */
  const hndelBack = () => {
    window.history.go(-1);
    return false;
  };
  /*
   ~END BACK
   */
  // *|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
  /*
   ~CETAK SURAT & MENYIMPAN DATA (SAVE)
   */
  const hndelCetak = () => {
    if (idSuratTerbuat != null) {
      swal({
        title: 'Opps!',
        text: 'surat sudah di buat, apakah ini surat baru??',
        icon: 'warning',
        button: 'Ya',
      }).then((komit) => {
        if (komit) {
          buatSurat();
        } else {
          return;
        }
      });
    } else {
      buatSurat();
    }
  };
  const buatSurat = () => {
    if (checkStatusNoSurat && isEmpty(noSurat)) {
      swal({
        title: 'Oops!, nomor surat tidak boleh kosong!',
        text: 'pilih nomor surat dulu!',
        icon: 'error',
        button: 'OK',
      });
      return;
    }
    if ($('#frame-letter').find('.inp').length) {
      $('#frame-letter').find('.inp')[0].focus();
      return;
    }

    // ? pesan untuk cetak surat
    let msgs = ``;
    if (sig) {
      msgs = `Surat akan disimpan & menunggu konfirmasi tandatangan pimpinan`;
    } else {
      msgs = 'Setelah anda mencatak surat, surat akan otomatis tersimpan.';
    }
    // ? end pesan
    swal({
      title: 'Yakin!',
      text: msgs,
      icon: 'warning',
      button: 'OK',
      showCancelButton: true,
      cancelButtonText: 'Batal',
    }).then((komit) => {
      // ? true
      if (komit) {
        /**
         * ?loading
         */
        $('.containerLoadingFull')
          .addClass('show-load')
          .removeClass('hide-load');
        /**
         * ?end loading
         */
        /**
         * !kontent
         */
        let mainContent =
          $('#frame-letter div')
            .find(`font[method='dev']`)
            .css('border', 'none').prevObject[0]?.innerHTML ?? ``;
        /**
         * !end kontent
         */

        //  ?hidden check box
        mainContent =
          $(mainContent).find("input[type='checkbox']").hide().prevObject[0]
            ?.innerHTML ?? ``;
        // ?end hidden

        // ^Add conten state
        setContent(mainContent);
        // ^end Add conten state

        // ?fungsi pada input manual
        const NameManualInput = JSON.parse(dataSurat?.manual_name ?? '[]');
        var SetValValue = [];
        NameManualInput.map((_, i) => {
          SetValValue.push({
            name: _,
            value: $(mainContent)
              .find('[name=' + _ + ']')
              .text(),
          });
        });
        // ?end fungsi

        // !REKAP SEMUA DATA
        if (dataSurat.id_wizard_template) {
          const form_data = new FormData();
          form_data.append('id_wizard', dataSurat?.id_wizard_template ?? 0);

          // ^ MENGAMBIL HTML SURAT ===========================================
          form_data.append(
            'content',
            $('#frame-letter div')
              .find(`font[method='dev']`)
              .css('border', 'none').prevObject[0]?.innerHTML ?? ``
          );
          // ^ END MENGAMBIL HTML SURAT ======================================
          form_data.append('code', data);
          form_data.append('nik', penduduk.nik);
          form_data.append('penduduk', JSON.stringify(penduduk));
          form_data.append('no_surat', noSurat ?? '');
          form_data.append('perangkat', JSON.stringify(dataPerangkat));
          form_data.append('config', JSON.stringify(configPrint));
          form_data.append('form_entry', JSON.stringify(SetValValue));
          form_data.append('signature', JSON.stringify(hndelSignatures));
          //  ^LAMPIRAN ===================================================
          if (lampiran.length > 0) {
            lampiran.map((_o, i) => {
              var input = document.getElementById(`${_o.name}`);
              form_data.append(`${_o.name}`, input.files[0]);
            });
            form_data.append('data_lampiran', JSON.stringify(lampiran));
          }
          // ^END LAMPIRAN ===============================================
          Simpan(form_data);
        }
      } else {
        $('.containerLoadingFull')
          .addClass('hide-load')
          .removeClass('show-load');
      }
    });
  };
  const Simpan = (form_data) => {
    setIsLoading(true);
    postWizard(
      form_data,
      (res) => {
        setIsLoading(false);
        if (res?.id_surat) {
          setIdSuratTerbuat(res?.id_surat);
        }
        if (res?.status == true) {
          //  !FUNGSI SENDING WHASTAPP =================================================================
          if (res?.token_signature.length > 0) {
            notifSignature(res);
          }
          // !END FUNGSI SENDING WAHSTAPP ================================================================
          else {
            // & TUNGGU PROSES
            const TimePrint = setInterval(() => {
              $('.containerLoadingFull')
                .addClass('hide-load')
                .removeClass('show-load');
              // handlePrint();
              window.open(url_printing + res?.data?.id_surat);
              clearInterval(TimePrint);
            }, 1000);
            // & END TUNGGU PROSES
          }
        }
      },
      (err) => {
        // ! ERROR PROSES
        setIsLoading(false);
        swal({
          title: 'Oops!',
          text: 'Kesalahan saat membuat surat, Silahkan ulangi. jika masin gagal coba reload.',
          icon: 'error',
          button: 'Reload',
        }).then((loads) => {
          if (loads) {
            window.location.reload();
          }
        });
        // !END ERROR PROSES
      }
    );
  };
  const notifSignature = (result) => {
    const resultset = result;
    setSignatureData(result);
    result?.token_signature?.map((x) => {
      if (typeof notifSuratTandaTangan === 'function') {
        notifSuratTandaTangan(result);
      } else {
        senderWa(
          `sebuah surat dengan nama ${x?.surat?.wizard?.name} dari ${x?.surat?.penduduk?.nama_lengkap} meminta validasi tanda tangan anda, lihat surat. https://v3.gigades.id/Surat?acc=${x?.uid}`,
          x?.perangkat?.no_telp,
          (results) => {
            if (results?.status == 200) {
              setIsLoading(false);
              toast.success(
                `permohonan tandatangan terkirim, untuk memastikan anda dapat menghubungi ${x?.perangkat?.no_telp}`,
                // `permohonan tandatangan terkirim, jika pimpinan tidak mendapatkan pesan, silahkan kirim link berikut,  https://v3.gigades.id/Surat?acc=${x?.uid}`,
                {
                  position: toast.POSITION.BOTTOM_LEFT,
                  autoClose: 10000,
                }
              );
              // & TUNGGU PROSES
              const TimePrint = setInterval(() => {
                $('.containerLoadingFull')
                  .addClass('hide-load')
                  .removeClass('show-load');
                // handlePrint();
                window.open(url_printing + resultset?.data?.id_surat);
                clearInterval(TimePrint);
              }, 1000);
              // & END TUNGGU PROSES
            } else {
              tryAgainSendSignature(resultset);
            }
          },
          (err) => {
            if (err) {
              tryAgainSendSignature(resultset);
            }
          }
        );
      }
    });
  };
  const tryAgainSendSignature = (result) => {
    setIsLoading(true);
    const resultset = result;
    result?.token_signature?.map((x) => {
      if (typeof notifSuratTandaTangan === 'function') {
        notifSuratTandaTangan(result, (success) => {
          if (success == true) {
            setIsLoading(false);
            const TimePrint = setInterval(() => {
              $('.containerLoadingFull')
                .addClass('hide-load')
                .removeClass('show-load');
              // handlePrint();
              window.open(url_printing + resultset?.data?.id_surat);
              clearInterval(TimePrint);
            }, 1000);
          }
        });
      } else {
        senderWa(
          `sebuah surat dengan nama ${x?.surat?.wizard?.name} dari ${x?.surat?.penduduk?.nama_lengkap} meminta validasi tanda tangan anda, lihat surat. https://v3.gigades.id/Surat?acc=${x?.uid}`,
          x?.perangkat?.no_telp,
          (results) => {
            if (results?.status == 200) {
              setIsLoading(false);
              toast.success(
                `permohonan tandatangan terkirim, untuk memastikan anda dapat menghubungi ${x?.perangkat?.no_telp}`,
                // `permohonan tandatangan terkirim, jika pimpinan tidak mendapatkan pesan, silahkan kirim link berikut,  https://v3.gigades.id/Surat?acc=${x?.uid}`,
                {
                  position: toast.POSITION.BOTTOM_LEFT,
                  autoClose: 10000,
                }
              );
              // & TUNGGU PROSES
              const TimePrint = setInterval(() => {
                $('.containerLoadingFull')
                  .addClass('hide-load')
                  .removeClass('show-load');
                // handlePrint();
                window.open(url_printing + resultset?.data?.id_surat);
                clearInterval(TimePrint);
              }, 1000);
              // & END TUNGGU PROSES
            } else {
              tryAgainSendSignature(resultset);
            }
          },
          (err) => {
            if (err) {
              tryAgainSendSignature(resultset);
            }
          }
        );
      }
    });
  };
  const msgErrorSeder = (resultset) => {
    setIsLoading(false);
    swal({
      title: 'Oops!',
      text: 'Kesalahan saat mengirim pesan kepada  pimpinan, ulangi!',
      icon: 'error',
      button: 'try again',
    }).then((komit) => {
      if (komit) {
        tryAgainSendSignature(resultset);
      } else {
      }
    });
  };
  /*
   ~END CETAK SURAT & MENYIMPAN DATA (SAVE)
   */
  // *|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
  /*
   ~ AMBIL DATA PENDUDUK
   */
  const hndelGetPenduduk = (ev) => {
    getPenduduk((result) => {
      if (result?.status ?? 400 == 200) {
        setMasterPenduduk(result.data);
        const opt = [];
        result.data.map((_, i) => {
          opt.push({ value: _.nik, label: _.nama_lengkap });
        });
        setOptionDataPenduduk(opt);
      }
    });
  };
  /*
   ~END AMBIL DATA PENDUDUK
   */
  // *|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
  /*
   ~ CEK STATUS KOP SURAT
   */

  const func__statusKop = (code) => {
    CheckKopSurat(`<div>${code}</div>`, (res, kop) => {
      setStatusKop(res);
      if (res) {
        getKopSurat((result) => {
          if (result.length > 0) {
            setKopSurat(result);

            const opt = [];
            result?.map((_, i) => {
              opt.push({
                data: _?.code ?? '',
                value: _.id_kop_surat,
                label: _.judul_kop,
              });
            });
            if (!isEmpty(opt[1])) {
              setDefaultValueKop(opt[0]);
              setKopSelected(opt[0].data);
            }
            setOptKopSurat(opt);
          }
        });
      }
    });
  };
  /*
   ~ CHANGE KOP SURAT
   */
  const hndelChangeKop = (thisKop) => {
    setSelectionKop(thisKop);
    setKopSelected(thisKop.data);
  };
  /*
   ~END CHANGE KOP SURAT
   */
  /*
   ~END CEK STATUS KOP SURAT
   */
  // *|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
  /*
   ~ SELECT PENDUDUK
   */
  const hndelPendudukChange = (thisOpt) => {
    getSearchPenduduk(thisOpt.value, (result) => {
      if (result?.status ?? 400 == 200) {
        setpenduduk(result.data[0]);
      }
    });
  };
  /*
   ~END SELECT PENDUDUK
   */
  // *|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
  /*
   ~ AMBIL DATA PERANGKAT DESA
   */
  const getDataPerangkatDesa = () => {
    getDataPerangkat((result) => {
      setdataPerangkat(result?.response ?? []);
    });
  };
  /*
   ~END  DATA PERANGKAT DESA
   */
  // *|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
  /*
   ~ AMBIL DATA DESA
   */
  const getDesa = () => {
    getDataDesa((result) => {
      setData_desa(result ?? {});
    });
  };
  /*
   ~END AMBIL DATA DESA
   */
  // *|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
  /*
  ^ PENOMORAN SURAT
  */
  /*
   ~ CEK NOMOR SURAT
   */
  const hndelNoSurat = (thisNo) => {
    setNosurat(thisNo.target.value);
  };
  // *|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||

  const http_request_nomor_surat = (body) => {
    RequestNoSurat(body, (result) => {
      setNosurat(result);
    });
  };
  /*
   ~AMBIL DATA NOMOR SURAT ------------------------------------------------------
   */
  const getNomorSurat = (surat = null) => {
    getNoSurat((result) => {
      const dd = [];
      result?.response?.map((x, i) => {
        dd.push({ value: x?.id, label: x?.title });
      });
      setListNoSurat(dd);
      if (!isEmpty(dd[1])) {
        setDefaultValueNoSurat(dd[1]);
        const form_data = new FormData();
        form_data.append('idNoSurat', dd[1].value);
        form_data.append('id_wizard_template', surat?.id_wizard_template);
        http_request_nomor_surat(form_data);
      }
    });
  };
  /*
   ~END AMBIL DATA NOMOR SURAT  -----------------------------------------------------
   */
  // *|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
  const funcSelectedNoSurat = (e) => {
    setNoSuratValueSelected(e);
    const form_data = new FormData();
    form_data.append('idNoSurat', e.value);
    form_data.append('id_wizard_template', dataSurat?.id_wizard_template);
    http_request_nomor_surat(form_data);
  };
  /*
   ~ CEK NOMOR SURAT PADA TEMPLATE
   */
  const func__checkStatusNoSurat = (code) => {
    CheckNoSurat(`<div>${code}</div>`, (res) => {
      setCheckStatusNoSurat(res);
    });
  };
  /*
   ~END
   */
  // *|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
  /*
   ~ FUNGSI TANDA TANGAN
   */
  const signature_function = (args) => {
    if (args.length > 0) {
      let status = args.filter((obj) => obj.status == true);
      if (status.length > 0) {
        setSig(true);
      } else {
        setSig(false);
      }
    }
    setHndelSignatures(args);
  };
  useEffect(() => {
    if (sig == true) {
      toast.success(
        `jika tanda tangan di aktifkan, anda harus menunggu persetujuan dari pimpinan terkait.`,
        {
          position: toast.POSITION.BOTTOM_LEFT,
          autoClose: 50000,
        }
      );
    }
  }, [sig]);
  /*
   ~END  FUNGSI TANDA TANGAN
   */
  // *==============================================================================================
  // !==============================================================================================
  // *==============================================================================================
  // & RETURN
  return (
    <div id='printing-root'>
      <ToastContainer />
      {isLoading && <LoadingSpinner />}
      {statusEdit ? (
        <Editor
          code={data}
          callback={(code) => {
            setData(code);
          }}
          back={() => {
            setStatusEdit(false);
          }}
        />
      ) : (
        <>
          <div id='main-content'>
            <div className='top-bar'>
              <div className='top-menu-printing'>
                <div>
                  <button className='btn-back-printing' onClick={hndelBack}>
                    <FaArrowCircleLeft size={16} />
                  </button>
                  <strong style={{ marginLeft: '10px' }}>
                    <label htmlFor=''>{data_desa?.nama_desa ?? ''}</label>
                  </strong>
                </div>
                <div style={{ display: 'flex' }}>
                  <button
                    className='btn-printing bg-success'
                    style={{ background: '#27bd10', color: '#fff' }}
                    onClick={() => {
                      setStatusEdit(!statusEdit);
                    }}>
                    <FaEdit size={16} /> edit
                  </button>

                  {!props.printObj && (
                    <button
                      className='btn-printing bg-secondary'
                      style={{
                        marginLeft: '10px',
                        display: 'flex',
                        justifyContent: 'space-evenly',
                        background: '#333',
                        color: '#fff',
                      }}
                      onClick={hndelCetak}>
                      <FaPrint size={16} />
                      <span style={{ marginLeft: '3px' }}>
                        {sig ? ' Kirim Permohonan' : ' print'}
                      </span>
                    </button>
                  )}
                  <div
                    style={{
                      width: '380px',
                    }}></div>
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
              signature_function={signature_function}
            />
          </div>
          <div id='aside'>
            <div className='header-logo'>
              <Logo />
            </div>
            <div className='content-aside'>
              <Tabs>
                <TabList>
                  <Tab>DATA</Tab>
                  <Tab>LAMPIRAN</Tab>
                  {/* <Tab>PENGATURAN</Tab> */}
                </TabList>

                <TabPanel>
                  <div className='content-aside-card'>
                    <div className='form-group'>
                      <label htmlFor=''>CARI NAMA PEMOPHON</label>
                      <Select
                        options={optionDataPenduduk}
                        onChange={hndelPendudukChange}
                      />
                    </div>
                    {statusKop && (
                      <div className='form-group'>
                        <label htmlFor=''>PILIH KOP SURAT</label>
                        <Select
                          value={
                            selectionKop == null
                              ? defaultValueKop
                              : selectionKop
                          }
                          options={optKopSurat}
                          onChange={hndelChangeKop}
                        />
                      </div>
                    )}
                    {checkStatusNoSurat && (
                      <>
                        <div className='form-group'>
                          <label htmlFor=''>PILIH FORMAT NOMOR SURAT</label>
                          <Select
                            value={
                              noSuratValueSelected == null
                                ? defaultValueNoSurat
                                : noSuratValueSelected
                            }
                            options={listNoSurat}
                            onChange={funcSelectedNoSurat}
                          />
                        </div>
                        <div className='form-group'>
                          <label htmlFor=''>NOMOR SURAT</label>
                          <small
                            style={{
                              color: 'green',
                              borderLeft: '2px sold green',
                            }}>
                            edit no surat jika tidak sesuai
                          </small>
                          <input
                            type='text'
                            value={noSurat}
                            onChange={hndelNoSurat}
                            className='input-text'
                          />
                        </div>
                      </>
                    )}
                  </div>
                </TabPanel>
                <TabPanel>
                  <div
                    className='widget-cards widget-lampiran w-100'
                    style={{ marginTop: '15px' }}>
                    {lampiran.map((item, index) => (
                      <div
                        className='form-group mb-1'
                        style={{
                          width: '100%',
                        }}>
                        <label
                          htmlFor=''
                          className='labels text-ubuntu-regular text-light'
                          style={{ fontSize: '2vh' }}>
                          {item.value}
                        </label>
                        <div className='text-left msg-inp'></div>
                        <input
                          type='file'
                          className='input-text shadow-sm text-ubuntu'
                          required={item.required}
                          data-type='attachment'
                          name={item.name}
                          id={item.name}
                          placeholder='lebel atribut'
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
    </div>
  );
}
