(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["components/my-block-limitbuy/my-block-limitbuy"],{"784a":function(n,t,e){"use strict";e.r(t);var o=e("c131"),i=e.n(o);for(var u in o)"default"!==u&&function(n){e.d(t,n,(function(){return o[n]}))}(u);t["default"]=i.a},"78f7":function(n,t,e){"use strict";e.r(t);var o=e("d7e5"),i=e("784a");for(var u in i)"default"!==u&&function(n){e.d(t,n,(function(){return i[n]}))}(u);e("889c");var c,r=e("f0c5"),a=Object(r["a"])(i["default"],o["b"],o["c"],!1,null,null,null,!1,o["a"],c);t["default"]=a.exports},"889c":function(n,t,e){"use strict";var o=e("d3e5"),i=e.n(o);i.a},c131:function(n,t,e){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var o=i(e("d85c"));function i(n){return n&&n.__esModule?n:{default:n}}var u={name:"MyBlock",props:{options:{type:Object/String,default:function(){return{}}}},data:function(){return{gallery:{},countdown:{timestamp:0}}},created:function(){this.init()},methods:{init:function(){var n=this,t={page_size:n.options.quantity};"choice"==n.options.source&&(t.items=n.options.items,t.items&&(t.page_size=t.items.split(",").length)),o.default.request("limitbuy/list",t,(function(t){0==t.code&&(n.gallery=t.data.list||[],n.gallery.length>0&&(n.countdown=t.data.list[0].promotion))}))}}};t.default=u},d3e5:function(n,t,e){},d7e5:function(n,t,e){"use strict";e.d(t,"b",(function(){return i})),e.d(t,"c",(function(){return u})),e.d(t,"a",(function(){return o}));var o={myCountdown:function(){return e.e("components/my-countdown/my-countdown").then(e.bind(null,"f742"))},uniIcons:function(){return Promise.all([e.e("common/vendor"),e.e("components/uni-icons/uni-icons")]).then(e.bind(null,"db11"))}},i=function(){var n=this,t=n.$createElement,e=(n._self._c,n.__map(n.gallery,(function(t,e){var o=n.__get_orig(t),i=n._f("currency")(t.promotion.price),u=n._f("currency")(t.price);return{$orig:o,f0:i,f1:u}})));n.$mp.data=Object.assign({},{$root:{l0:e}})},u=[]}}]);
;(global["webpackJsonp"] = global["webpackJsonp"] || []).push([
    'components/my-block-limitbuy/my-block-limitbuy-create-component',
    {
        'components/my-block-limitbuy/my-block-limitbuy-create-component':(function(module, exports, __webpack_require__){
            __webpack_require__('543d')['createComponent'](__webpack_require__("78f7"))
        })
    },
    [['components/my-block-limitbuy/my-block-limitbuy-create-component']]
]);