(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/seller/goods/spec"],{"0a95":function(t,e,n){"use strict";(function(t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var c=u(n("7143")),r=u(n("2061"));function u(t){return t&&t.__esModule?t:{default:t}}var s={data:function(){return{attributes:{category:[{name:"颜色",selected:!0},{name:"尺码",selected:!0}],specs:[{spec_1:"",spec_2:"",price:"",stock:""}]}}},methods:{showPopup:function(t,e){return this.$refs[e].open()},closePopup:function(t,e){return this.$refs[e].close()},confirm:function(t,e){this.attributes.category=e,this.$forceUpdate(),t()},save:function(){r.default.save(this)&&(t.setStorageSync("__attributes__",this.attributes),t.navigateBack())},cancel:function(){t.navigateBack()},change:function(t,e){this.attributes.category[e].selected=t.detail.value},add:function(){this.attributes.specs.push({spec_1:"",spec_2:"",price:"",stock:""})},del:function(t){var e=[];for(var n in this.attributes.specs)n!=t&&e.push(this.attributes.specs[n]);this.attributes.specs=e}},onLoad:function(e){var n=t.getStorageSync("__attributes__");!c.default.isEmpty(n)&&n.category.length>0&&(this.attributes.specs=n.specs,n.category.length<2&&(this.attributes.category[1].selected=!1),this.attributes.category=Object.assign(this.attributes.category,n.category))},onShow:function(){if(!c.default.verifySeller(!1))return t.setStorageSync("redirect",this.$mp.page.route),c.default.redirectUrl("/pages/seller/login/login?redirect=yes")}};e.default=s}).call(this,n("543d")["default"])},"0edd":function(t,e,n){"use strict";n.r(e);var c=n("0a95"),r=n.n(c);for(var u in c)"default"!==u&&function(t){n.d(e,t,(function(){return c[t]}))}(u);e["default"]=r.a},"3c66":function(t,e,n){"use strict";var c=n("b3ce"),r=n.n(c);r.a},"44c4":function(t,e,n){"use strict";(function(t){n("ff86");c(n("66fd"));var e=c(n("9cc0"));function c(t){return t&&t.__esModule?t:{default:t}}wx.__webpack_require_UNI_MP_PLUGIN__=n,t(e.default)}).call(this,n("543d")["createPage"])},"9cc0":function(t,e,n){"use strict";n.r(e);var c=n("e6b4"),r=n("0edd");for(var u in r)"default"!==u&&function(t){n.d(e,t,(function(){return r[t]}))}(u);n("3c66");var s,i=n("f0c5"),o=Object(i["a"])(r["default"],c["b"],c["c"],!1,null,"2815f236",null,!1,c["a"],s);e["default"]=o.exports},b3ce:function(t,e,n){},e6b4:function(t,e,n){"use strict";n.d(e,"b",(function(){return r})),n.d(e,"c",(function(){return u})),n.d(e,"a",(function(){return c}));var c={uniIcons:function(){return Promise.all([n.e("common/vendor"),n.e("components/uni-icons/uni-icons")]).then(n.bind(null,"db11"))},uniPopup:function(){return Promise.all([n.e("common/vendor"),n.e("components/uni-popup/uni-popup")]).then(n.bind(null,"4504"))},myPopupAttrs:function(){return n.e("components/my-popup-attrs/my-popup-attrs").then(n.bind(null,"244b"))}},r=function(){var t=this,e=t.$createElement;t._self._c},u=[]}},[["44c4","common/runtime","common/vendor"]]]);