import React, { useRef, useEffect, useState } from 'react';
// redux
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';

export default function PengaturanPrint(props) {
  const getRedux = useSelector((state) => state);
  const dispatch = useDispatch();
  // useEffect(() => {
  //   if (props.defautConfig != undefined) {
  //     const ObjPrint = props.defautConfig ?? "{}";

  //     $("[name='top']").val(
  //       getRedux?.papperSetting?.paperMargin.top ?? ObjPrint.paperMargin.top
  //     );
  //     $("[name='bottom']").val(
  //       getRedux?.papperSetting?.paperMargin.top ?? ObjPrint.paperMargin.bottom
  //     );
  //     $("[name='left']").val(
  //       getRedux?.papperSetting?.paperMargin.top ?? ObjPrint.paperMargin.left
  //     );
  //     $("[name='right']").val(
  //       getRedux?.papperSetting?.paperMargin.top ?? ObjPrint.paperMargin.right
  //     );
  //     $("[name='orientation']").val(
  //       getRedux?.papperSetting?.paperOrientation ?? ObjPrint.paperOrientation
  //     );
  //     $("[name='papper']").val(
  //       getRedux?.papperSetting?.paperSize ?? ObjPrint.paperSize
  //     );
  //   }
  // }, [props.defautConfig.config_print]);

  useEffect(() => {
    if (
      sessionStorage.getItem('PegaturanPrint') != undefined &&
      sessionStorage.getItem('PegaturanPrint') != '[]'
    ) {
      const conf = JSON.parse(sessionStorage.getItem('PegaturanPrint')) ?? '[]';
      const margin = conf?.paperMargin ?? {};
      console.log(margin);
      const orientasi = conf?.paperOrientation ?? '';
      const papperSize = conf?.paperSize ?? '';
      $("[name='top']").val(margin?.top ?? '0cm');
      $("[name='bottom']").val(margin?.bottom ?? '0cm');
      $("[name='left']").val(margin?.left ?? '0cm');
      $("[name='right']").val(margin?.right ?? '0cm');
      $("[name='orientation']").val(orientasi);
      $("[name='papper']").val(papperSize);
    }
  }, []);

  const hndelChange = (ev) => {
    const ObjPrint = {
      paperMargin: {
        top: $("[name='top']").val(),
        bottom: $("[name='bottom']").val(),
        left: $("[name='left']").val(),
        right: $("[name='right']").val(),
      },
      paperOrientation: $("[name='orientation']").val(),
      paperSize: $("[name='papper']").val(),
    };
    sessionStorage.setItem('PegaturanPrint', JSON.stringify(ObjPrint) ?? '[]');
    props.updateState();
  };

  return (
    <>
      <div className='container-papper-print-set'>
        <div>
          <div
            className='form-group mb-1 pl-1 pr-1'
            style={{
              width: '100%',
            }}>
            <label htmlFor='' className='labels text-ubuntu-regular text-light'>
              Top
            </label>
            <div className='text-left msg-inp'>
              {/* <i>label kan menjadi label pada text input</i> */}
            </div>
            <input
              type='text'
              className='input-text shadow-sm text-ubuntu'
              name='top'
              onChange={(e) => {
                hndelChange(e);
              }}
              placeholder='lebel atribut'
            />
          </div>
          <div
            className='form-group mb-1 pl-1 pr-1'
            style={{
              width: '100%',
            }}>
            <label htmlFor='' className='labels text-ubuntu-regular text-light'>
              Right
            </label>
            <div className='text-left msg-inp'>
              {/* <i>label kan menjadi label pada text input</i> */}
            </div>
            <input
              type='text'
              className='input-text h-30px shadow-sm text-ubuntu'
              name='right'
              onKeyUp={(e) => {
                hndelChange(e);
              }}
              placeholder='lebel atribut'
            />
          </div>
        </div>
        <div>
          <div
            className='form-group mb-1 pl-1 pr-1'
            style={{
              width: '100%',
            }}>
            <label htmlFor='' className='labels text-ubuntu-regular text-light'>
              Bottom
            </label>
            <div className='text-left msg-inp'>
              {/* <i>label kan menjadi label pada text input</i> */}
            </div>
            <input
              type='text'
              className='input-text h-30px shadow-sm text-ubuntu'
              name='bottom'
              onChange={(e) => {
                hndelChange(e);
              }}
              placeholder='lebel atribut'
            />
          </div>
          <div
            className='form-group mb-1 pl-1 pr-1'
            style={{
              width: '100%',
            }}>
            <label htmlFor='' className='labels text-ubuntu-regular text-light'>
              Left
            </label>
            <div className='text-left msg-inp'>
              {/* <i>label kan menjadi label pada text input</i> */}
            </div>
            <input
              type='text'
              className='input-text h-30px shadow-sm text-ubuntu'
              name='left'
              onChange={(e) => {
                hndelChange(e);
              }}
              placeholder='lebel atribut'
            />
          </div>
        </div>
        <div
          className='form-group mb-1'
          style={{
            width: '100%',
          }}>
          <label htmlFor='' className='labels text-ubuntu-regular text-light'>
            Orientation
          </label>
          <div className='text-left msg-inp'></div>
          <select
            name='orientation'
            onChange={(e) => {
              hndelChange(e);
            }}
            className='input-text h-30px shadow-sm text-ubuntu'>
            <option value='portrait'>portrait</option>
            <option value='landscape'>landscape</option>
          </select>
        </div>
        <div
          className='form-group mb-1'
          style={{
            width: '100%',
          }}>
          <label htmlFor='' className='labels text-ubuntu-regular text-light'>
            Papper
          </label>
          <div className='text-left msg-inp'></div>
          <select
            name='papper'
            onChange={(e) => {
              hndelChange(e);
            }}
            className='input-text h-30px shadow-sm text-ubuntu'>
            <option value='A3'>A3</option>
            <option value='A4'>A4</option>
            <option value='A5'>A5</option>
            <option value='A6'>A6</option>
            <option value='A7'>A7</option>
          </select>
        </div>
      </div>
    </>
  );
}
