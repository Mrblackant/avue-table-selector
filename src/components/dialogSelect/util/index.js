import { merge as _merge } from "lodash";

export const utilProp = () => {
  let basicDiaOpt = {
    dialogConfig: {
      // 弹窗事件配置
      title: "用户",
    },
    tableConfig: {
      // 弹窗-table配置
      selectMode: "sigle", // 单选(sigle)or多选(multiple)，默认单选
      tableRowKey: "id", // table的唯一值
    },
    formTableColumnConfig: {
      formConfig: {
        // 参考avue官网form表单的配置参数https://www.avuejs.com/form/form.html
      },
      column: [
        // table列的配置(table用element的配置，form渲染使用的avue)
      ],
    },
  };
  return basicDiaOpt;
};

export const utilHandleInitProp = (propData) => {
  let oriProp = propData && Object.keys(propData).length ? propData : {};
  let result = {};
  result = _merge(utilProp(), oriProp);
  return result;
};

export const utilHasProto = (data, key) => {
  if (!data || !key) return false;
  return key in data;
};

/**
 * 判断是否为空
 */
export function validatenull(val) {
  if (typeof val == "boolean") {
    return false;
  }
  if (typeof val == "number") {
    return false;
  }
  if (val instanceof Array) {
    if (val.length == 0) return true;
  } else if (val instanceof Object) {
    if (JSON.stringify(val) === "{}") return true;
  } else {
    if (
      val == "null" ||
      val == null ||
      val == "undefined" ||
      val == undefined ||
      val == ""
    )
      return true;
    return false;
  }
  return false;
}
