import React from "react";

export const attribute_template = (props) => {
  switch (props?.dataConfig?.name) {
    case "signature":
      return TandatanganTemplate(props);
      break;
    default:
      return Attribute_umum(props);
      break;
  }
};

const Attribute_umum = ({
    dataConfig,
    addAttr,
    value
  }) =>
  `<font
    ><font
      name="${dataConfig.name}"
      type="${dataConfig.type}"
      ${addAttr}
      table="${dataConfig.parameter.table}"
      formLabel="${value.selected.label}"
      style="background:${dataConfig.parameter.color}; color:#fff;border-radius:5px; padding-left:2px;padding-right:2px;"
      >${value.selected.label}
    </font>
    <font> </font> &nbsp;</font
  >`;

const TandatanganTemplate = ({
    dataConfig,
    addAttr,
    value
  }) =>
  /*html*/
  `<font
      ><font>
      <img
          name="img-${dataConfig.name}"
          ${addAttr}
          type="img-${dataConfig.type}"
          formLabel="img-signature"
          src="https://hastaprakarsa.co.id/wp-content/uploads/2020/02/tanda-tangan-mujiono.png"
          style="width:100px; height:70px; display:inline-block;" />
        <br />
        <font name="${dataConfig.name}" type="${
      dataConfig.type
    }" ${addAttr} table="${dataConfig.parameter.table}" formLabel="${
      value.selected.label
    }" style='background:${
      dataConfig.parameter.color
    }; color:#fff;border-radius:5px; padding-left:2px;padding-right:2px;'>${
      value.selected.label
    }</font>
      <font>&emsp;</font></font></font> `;


// old signature
//   `<font
//   ><font><img
//       name="img-${dataConfig.name}"
//       ${addAttr}
//       type="img-${dataConfig.type}"
//       formLabel="img-signature"
//       src="https://hastaprakarsa.co.id/wp-content/uploads/2020/02/tanda-tangan-mujiono.png"
//       style="width:100px; height:70px; display:inline-block;" />
//     <br />
//     <font name="${dataConfig.name}" type="${
//   dataConfig.type
// }" ${addAttr} table="${dataConfig.parameter.table}" formLabel="${
//   value.selected.label
// }" style='background:${
//   dataConfig.parameter.color
// }; color:#fff;border-radius:5px; padding-left:2px;padding-right:2px;'>${
//   value.selected.label
// }</font></font>&emsp;</font> `