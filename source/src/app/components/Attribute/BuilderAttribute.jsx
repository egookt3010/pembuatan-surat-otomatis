import React, { useState, useEffect } from 'react'
import axios from 'axios'
import AutoValue from './components/AutoValue'
import ManualValue from './components/ManualValue'

export default function BuilderAttribute(props) {
  const { InitAttribute, onSetpageItem, domEditor, close } = props
  const [AutomaticAttributeType, setAutomaticAttributeType] = useState([])
  const [ManualAttributeType, setManualAttributeType] = useState([])
  const [
    AppendStaticHtmlattributeType,
    setAppendStaticHtmlattributeType,
  ] = useState([])

  const AuttoLayout = (name) => {
    onSetpageItem(
      <AutoValue
        {...props}
        InitAttribute={AutomaticAttributeType}
        config={AutomaticAttributeType.find((x) => x.name === name)}
      />,
    )
  }
  const ManualLayout = () => {
    onSetpageItem(
      <ManualValue {...props} InitAttribute={ManualAttributeType} />,
    )
  }

  const StaticHtmlLayout = (attribute) => {
    const StaticHtml = async () => {
      const get = await axios
        .get(attribute.urlHtml, {
          headers: {
            Accept: 'application/text',
          },
        })
        .catch(() => {
          console.log('error')
        })
      if (get?.data) {
        domEditor(get?.data)
      }
    }
    StaticHtml()
  }

  useEffect(() => {
    setAutomaticAttributeType(InitAttribute?.AutomaticAttributeType ?? [])
    setAppendStaticHtmlattributeType(
      InitAttribute?.AppendStaticHtmlattributeType ?? [],
    )
    setManualAttributeType(InitAttribute.ManualAttributeType ?? [])
    console.log(InitAttribute.ManualAttributeType)
  }, [])

  return (
    <ul className="ul-dropdown">
      {AutomaticAttributeType.map((attr, index) => (
        <li
          className="li-dropdown title-option-menu"
          key={index}
          onClick={() => {
            AuttoLayout(attr.name, AutoValue)
          }}
        >
          <a className="button-dropdown">{attr.title}</a>
        </li>
      ))}
      <li
        className="li-dropdown title-option-menu"
        onClick={() => {
          ManualLayout()
        }}
      >
        <a className="button-dropdown">Inputan</a>
      </li>
      {AppendStaticHtmlattributeType.length > 0 &&
        AppendStaticHtmlattributeType?.map((attr, inx) => (
          <li
            key={inx}
            className="li-dropdown title-option-menu"
            onClick={() => {
              StaticHtmlLayout(attr)
            }}
          >
            <a className="button-dropdown">{attr?.label}</a>
          </li>
        ))}
    </ul>
  )
}
