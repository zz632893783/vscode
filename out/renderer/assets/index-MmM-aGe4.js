import { c as createElementBlock, a as createVNode, w as withCtx, r as resolveComponent, o as openBlock, b as createTextVNode } from "./index-B_mzykmW.js";
const _hoisted_1 = { class: "home" };
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const clickFn = () => alert("点击了按钮");
    return (_ctx, _cache) => {
      const _component_el_button = resolveComponent("el-button");
      return openBlock(), createElementBlock("div", _hoisted_1, [
        createVNode(_component_el_button, {
          type: "primary",
          onClick: clickFn
        }, {
          default: withCtx(() => [
            createTextVNode("home")
          ]),
          _: 1
        })
      ]);
    };
  }
};
export {
  _sfc_main as default
};
