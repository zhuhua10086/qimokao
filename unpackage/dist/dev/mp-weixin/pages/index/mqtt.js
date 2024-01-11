"use strict";
const common_vendor = require("../../common/vendor.js");
const hua = () => "../../components/category/zhuhua.js";
const _sfc_main = {
  components: {
    hua
    // 注册你的组件
  }
};
if (!Array) {
  const _component_hua = common_vendor.resolveComponent("hua");
  _component_hua();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {};
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "C:/Users/24673/Desktop/新建文件夹 (8)/H5考试材料/uniapp-vue3-wx/pages/index/mqtt.vue"]]);
wx.createPage(MiniProgramPage);
