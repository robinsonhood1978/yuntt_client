(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/distribute/index/index"],{"203e":function(t,e,n){"use strict";n.r(e);var r=n("fe24"),u=n("afd3");for(var o in u)"default"!==o&&function(t){n.d(e,t,(function(){return u[t]}))}(o);n("47fd"),n("ddfd");var f,a=n("f0c5"),i=Object(a["a"])(u["default"],r["b"],r["c"],!1,null,"2467aea6",null,!1,r["a"],f);e["default"]=i.exports},"2de4":function(t,e,n){},"47fd":function(t,e,n){"use strict";var r=n("d385"),u=n.n(r);u.a},6455:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var r=o(n("7143")),u=o(n("d8da"));function o(t){return t&&t.__esModule?t:{default:t}}var f={data:function(){return{goodses:0,orders:0,teams:0,profits:{amount:0,total:0,yesterday:0,lastWeek:0,currMonth:0}}},methods:{},onLoad:function(t){u.default.teams(this),u.default.goodses(this),u.default.orders(this),u.default.profits(this)},onShow:function(){r.default.verifyLogin(!0,this.$mp.page.route)}};e.default=f},a52e:function(t,e,n){"use strict";(function(t){n("ff86");r(n("66fd"));var e=r(n("203e"));function r(t){return t&&t.__esModule?t:{default:t}}wx.__webpack_require_UNI_MP_PLUGIN__=n,t(e.default)}).call(this,n("543d")["createPage"])},afd3:function(t,e,n){"use strict";n.r(e);var r=n("6455"),u=n.n(r);for(var o in r)"default"!==o&&function(t){n.d(e,t,(function(){return r[t]}))}(o);e["default"]=u.a},d385:function(t,e,n){},ddfd:function(t,e,n){"use strict";var r=n("2de4"),u=n.n(r);u.a},fe24:function(t,e,n){"use strict";n.d(e,"b",(function(){return u})),n.d(e,"c",(function(){return o})),n.d(e,"a",(function(){return r}));var r={uniIcons:function(){return Promise.all([n.e("common/vendor"),n.e("components/uni-icons/uni-icons")]).then(n.bind(null,"db11"))}},u=function(){var t=this,e=t.$createElement,n=(t._self._c,t._f("currency")(t.profits.amount)),r=t._f("currency")(t.profits.yesterday),u=t._f("currency")(t.profits.lastWeek),o=t._f("currency")(t.profits.currMonth);t.$mp.data=Object.assign({},{$root:{f0:n,f1:r,f2:u,f3:o}})},o=[]}},[["a52e","common/runtime","common/vendor"]]]);