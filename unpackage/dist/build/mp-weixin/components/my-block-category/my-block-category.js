(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["components/my-block-category/my-block-category"],{2564:function(t,n,e){"use strict";(function(t){Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0;var o=r(e("d85c"));function r(t){return t&&t.__esModule?t:{default:t}}var u={name:"MyBlock",props:{options:{type:Object/String,default:function(){return{}}}},data:function(){return{gallery:{}}},created:function(){this.init()},methods:{init:function(){var n=this,e=t.getStorageSync("category-index")||{};e.length>0?n.gallery=e:o.default.request("category/list",{parent_id:0,store_id:0,if_show:1},(function(e){0==e.code&&e.data.list.length>0&&(n.gallery=e.data.list,t.setStorage({key:"category-index",data:e.data.list}))}))}}};n.default=u}).call(this,e("543d")["default"])},"553b":function(t,n,e){"use strict";e.d(n,"b",(function(){return r})),e.d(n,"c",(function(){return u})),e.d(n,"a",(function(){return o}));var o={uniIcons:function(){return Promise.all([e.e("common/vendor"),e.e("components/uni-icons/uni-icons")]).then(e.bind(null,"db11"))}},r=function(){var t=this,n=t.$createElement;t._self._c},u=[]},"613e":function(t,n,e){"use strict";e.r(n);var o=e("553b"),r=e("c395");for(var u in r)"default"!==u&&function(t){e.d(n,t,(function(){return r[t]}))}(u);e("72dd");var a,c=e("f0c5"),i=Object(c["a"])(r["default"],o["b"],o["c"],!1,null,null,null,!1,o["a"],a);n["default"]=i.exports},"72dd":function(t,n,e){"use strict";var o=e("9b7b"),r=e.n(o);r.a},"9b7b":function(t,n,e){},c395:function(t,n,e){"use strict";e.r(n);var o=e("2564"),r=e.n(o);for(var u in o)"default"!==u&&function(t){e.d(n,t,(function(){return o[t]}))}(u);n["default"]=r.a}}]);
;(global["webpackJsonp"] = global["webpackJsonp"] || []).push([
    'components/my-block-category/my-block-category-create-component',
    {
        'components/my-block-category/my-block-category-create-component':(function(module, exports, __webpack_require__){
            __webpack_require__('543d')['createComponent'](__webpack_require__("613e"))
        })
    },
    [['components/my-block-category/my-block-category-create-component']]
]);