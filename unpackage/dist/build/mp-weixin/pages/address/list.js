(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/address/list"],{"3aee":function(e,n,t){"use strict";t.r(n);var o=t("f2ff"),a=t.n(o);for(var u in o)"default"!==u&&function(e){t.d(n,e,(function(){return o[e]}))}(u);n["default"]=a.a},"5c20":function(e,n,t){"use strict";(function(e){t("ff86");o(t("66fd"));var n=o(t("8c01"));function o(e){return e&&e.__esModule?e:{default:e}}wx.__webpack_require_UNI_MP_PLUGIN__=t,e(n.default)}).call(this,t("543d")["createPage"])},"8c01":function(e,n,t){"use strict";t.r(n);var o=t("f27a"),a=t("3aee");for(var u in a)"default"!==u&&function(e){t.d(n,e,(function(){return a[e]}))}(u);var r,d=t("f0c5"),i=Object(d["a"])(a["default"],o["b"],o["c"],!1,null,"12c1d141",null,!1,o["a"],r);n["default"]=i.exports},f27a:function(e,n,t){"use strict";t.d(n,"b",(function(){return a})),t.d(n,"c",(function(){return u})),t.d(n,"a",(function(){return o}));var o={uniIcons:function(){return Promise.all([t.e("common/vendor"),t.e("components/uni-icons/uni-icons")]).then(t.bind(null,"db11"))},uniLoadMore:function(){return t.e("components/uni-load-more/uni-load-more").then(t.bind(null,"db13"))}},a=function(){var e=this,n=e.$createElement;e._self._c},u=[]},f2ff:function(e,n,t){"use strict";(function(e){Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0;var o=u(t("7143")),a=u(t("8ee2"));function u(e){return e&&e.__esModule?e:{default:e}}var r={data:function(){return{addresses:{page:1,list:[]},loadMore:{show:!1},address_type:0}},methods:{clickLoadMore:function(e){a.default.address(this,this.addresses.page+1)},add:function(){e.navigateTo({url:"/pages/address/build"})},operate:function(e,n){a.default.operate(this,n)}},created:function(){a.default.showLoadMore(this)},onLoad:function(n){this.address_type=e.getStorageSync("address_type")||0,a.default.address(this,1)},onShow:function(){o.default.verifyLogin(!0,!1)},onReachBottom:function(){a.default.address(this,this.addresses.page+1)}};n.default=r}).call(this,t("543d")["default"])}},[["5c20","common/runtime","common/vendor"]]]);