(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["components/my-block-imagead/my-block-imagead"],{"3b7c":function(t,n,a){"use strict";a.r(n);var e=a("a3e5"),u=a("beaf");for(var r in u)"default"!==r&&function(t){a.d(n,t,(function(){return u[t]}))}(r);a("c7ea");var i,o=a("f0c5"),c=Object(o["a"])(u["default"],e["b"],e["c"],!1,null,null,null,!1,e["a"],i);n["default"]=c.exports},"5ad5":function(t,n,a){},a3e5:function(t,n,a){"use strict";var e;a.d(n,"b",(function(){return u})),a.d(n,"c",(function(){return r})),a.d(n,"a",(function(){return e}));var u=function(){var t=this,n=t.$createElement;t._self._c},r=[]},b2a4:function(t,n,a){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0;var e=u(a("7143"));function u(t){return t&&t.__esModule?t:{default:t}}var r={name:"MyBlock",props:{options:{type:Object/String,default:function(){return{}}}},data:function(){return{gallery:[]}},created:function(){this.init()},methods:{init:function(){for(var t in this.options.ad_image_url)this.options.ad_image_url[t]&&this.gallery.push({url:this.options.ad_image_url[t],link:e.default.formatUrl(this.options.ad_link_url[t])})}}};n.default=r},beaf:function(t,n,a){"use strict";a.r(n);var e=a("b2a4"),u=a.n(e);for(var r in e)"default"!==r&&function(t){a.d(n,t,(function(){return e[t]}))}(r);n["default"]=u.a},c7ea:function(t,n,a){"use strict";var e=a("5ad5"),u=a.n(e);u.a}}]);
;(global["webpackJsonp"] = global["webpackJsonp"] || []).push([
    'components/my-block-imagead/my-block-imagead-create-component',
    {
        'components/my-block-imagead/my-block-imagead-create-component':(function(module, exports, __webpack_require__){
            __webpack_require__('543d')['createComponent'](__webpack_require__("3b7c"))
        })
    },
    [['components/my-block-imagead/my-block-imagead-create-component']]
]);
