import React, { useEffect, useState, useRef } from 'react'
import {
  useCKEditor,
  CKEditorEventAction,
  registerEditorEventHandler,
} from 'ckeditor4-react'
import $ from 'jquery'
import { useSelector, useDispatch } from 'react-redux'
import 'react-responsive-modal/styles.css'
import { Modal } from 'react-responsive-modal'
import swal from 'sweetalert'
import 'react-toastify/dist/ReactToastify.css'

// internal export  ======================================================
import { makeid, cm2px } from './function/___func'

import { getTypeManualName } from './function/lib'
// import { useEditor, CONFIG } from './lib/editorConfig';
import { exports_data } from './lib/export'
// components
import ContenSave from './lib/SaveModalContentBuild'
import Bar from './components/BuildComponents'
// style ==================================================================
import './scss/app.scss'
import './scss/style.scss'
// ========================================================================

export default function Editor({ someProp }) {
  // ---- redux --------------------------------
  const redux = useSelector((state) => state)
  //--------------------------------------------
  const [loading, setLoading] = useState(true)
  const [heightEditor, setHeightEditor] = useState(0)
  const [element, setElement] = React.useState()
  const [open, setOpen] = useState(false)

  const [sesion] = useState(makeid(10))
  const [attribute, setAttribute] = useState([])

  const { editor } = useCKEditor({
    element,
    dispatchEvent: (action) => {
      switch (action.type) {
        case CKEditorEventAction.focus:
          console.log(`Will be called with initial value of ${someProp}.`)
          break
        case CKEditorEventAction.change:
          localStorage.setItem('_contens', action.payload.editor.getData())
          sessionStorage.setItem('content_update', true)
          break
        default:
          break
      }
    },
    subscribeTo: ['focus', 'change'],
    contenteditable: true,
    config: {
      extraPlugins: 'fixed',
      extraPlugins: 'sharedspace',
      removePlugins: 'maximize,resize',
      resize_enabled: false,
      tabSpaces: 4,
      allowedContent: true,
      line_height: '1em;1.1em;1.2em;1.3em;1.4em;1.5em',
      sharedSpaces: {
        top: 'top',
        bottom: 'editors',
      },
      removeButtons: 'PasteFromWord',
    },
  })
  // ------------------init state-----------------------------------
  const [InitConfig, setInitConfig] = useState({})
  const [DataUpdate, setDataUpdate] = useState({})
  // ------------------storage--------------------------------------
  const storageInit = localStorage.getItem('init')
  const storageDataEdit = sessionStorage.getItem('dataEdit')
  const phase = sessionStorage.getItem('phase')
  // ---------------------------------------------------------------

  useEffect(() => {
    if (loading == false) {
      setHeightEditor(parseFloat($('#container-editor').height()) - 150)
    } else {
      $('.containerLoadingFull').addClass('show-load').removeClass('hide-load')
    }
  }, [loading])

  useEffect(() => {
    if (editor) {
      editor.config.height = heightEditor + 'px'
      editor.config.width = redux?.__INIT_CONFIG__?.Editor?.width ?? 0
      const cleanup = registerEditorEventHandler({
        editor,
        evtName: 'focus',
        handler: () => {
          console.log(
            `Will be called with current value of ${someProp} before regular event handlers.`,
          )
        },
        priority: 0,
      })
      return cleanup
    }
  }, [editor, someProp])

  useEffect(() => {
    try {
      setInitConfig(JSON.parse(storageInit))
      setDataUpdate(JSON.parse(storageDataEdit))
      setLoading(false)
    } catch (error) {
      throw new Error('Error occured: ', e)
    }
  }, [])

  useEffect(() => {
    $('.sidebar-container').css(
      'height',
      `calc(100% - ${$('.top-bar-clases').height()}px)`,
    )
  })
  const domEditor = (attr) => {
    editor.insertHtml(attr)
  }

  // =========================
  const onCloseModal = () => setOpen(false)

  const hndelExports = (ev) => {
    ev.preventDefault()
    onCloseModal()

    $('.containerLoadingFull').addClass('show-load').removeClass('hide-load')
    if (attribute.length > 0) {
      exports_data({
        sesion: sesion,
        attribute: attribute,
        manualNames: getTypeManualName(editor.getData()),
      })
    }
  }
  const newProject = () => {
    // alert
    swal({
      title: 'Surat Baru?',
      text: 'Jika Ya, maka editor akan dibersihkan!',
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        editor.setData('')
        localStorage.clear()
        sessionStorage.removeItem('dataUpdate')
        sessionStorage.setItem('phase', 'created')
        window.location.reload()
      }
    })
  }
  return (
    !loading && (
      <div id="main-container-editor">
        <div className="top-bar-clases">
          {heightEditor != 0 && <div id="top"></div>}
          <div
            className="mt-3"
            style={{
              marginRight: '15px',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div
              style={{
                display: 'flex',
                paddingTop: '15px',
                justifyContent: 'flex-end',
              }}
            >
              <div>
                <button
                  className="btn-ui btn-secondary"
                  style={{
                    marginLeft: '10px',
                    background: '#ccc',
                  }}
                  onClick={() => {
                    newProject()
                  }}
                >
                  Surat Baru
                </button>
              </div>
              {/* export */}
              <div>
                <button
                  className="btn-ui btn-main-export"
                  style={{
                    marginLeft: '10px',
                  }}
                  onClick={() => setOpen(true)}
                >
                  Simpan
                </button>
              </div>
            </div>
            {sessionStorage.getItem('phase') == 'edit' && (
              <div
                className="alert-theme-costum"
                style={{
                  color: 'green',
                  marginTop: '10px',
                }}
              >
                anda sedang dalam mode edit <strong>{name ?? ''}</strong>
              </div>
            )}
          </div>
        </div>

        <div
          id="container-editor"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
            height: '100%',
          }}
        >
          <div className="editor-frame">
            {heightEditor != 0 && (
              <textarea
                ref={setElement}
                id="editors"
                style={{
                  width: '100%',
                  height: heightEditor + 'px',
                  padding: 1000,
                }}
                className="editor-canvas"
              >
                {localStorage.getItem('_contens')}
              </textarea>
            )}
          </div>
          <div className="sidebar-container">
            <Bar domEditor={domEditor} />
          </div>
        </div>
        <Modal open={open} onClose={onCloseModal} center>
          <form onSubmit={hndelExports}>
            <ContenSave
              initData={InitConfig?.AppendInputExport?.attribute ?? {}}
              CardConfig={InitConfig?.AppendInputExport?.card ?? {}}
              style={InitConfig?.AppendInputExport?.card?.style}
              result={(res) => {
                setAttribute(res)
              }}
            />
          </form>
        </Modal>

        <div className="containerLoadingFull hide-load">
          <div className="loaderWidget"></div>
          <h2 className="mt-3 loadText">Loading</h2>
        </div>
      </div>
    )
  )
}
