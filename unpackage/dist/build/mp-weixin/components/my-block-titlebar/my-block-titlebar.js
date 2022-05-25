(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["components/my-block-titlebar/my-block-titlebar"],{"4e30":function(t,n,e){"use strict";e.r(n);var r=e("c60f"),u=e.n(r);for(var i in r)"default"!==i&&function(t){e.d(n,t,(function(){return r[t]}))}(i);n["default"]=u.a},7580:function(t,n,e){"use strict";e.r(n);var r=e("908a"),u=e("4e30");for(var i in u)"default"!==i&&function(t){e.d(n,t,(function(){return u[t]}))}(i);e("c2ee");var a,o=e("f0c5"),c=Object(o["a"])(u["default"],r["b"],r["c"],!1,null,null,null,!1,r["a"],a);n["default"]=c.exports},"908a":function(t,n,e){"use strict";var r;e.d(n,"b",(function(){return u})),e.d(n,"c",(function(){return i})),e.d(n,"a",(function(){return r}));var u=function(){var t=this,n=t.$createElement;t._self._c},i=[]},be97:function(t,n,e){},c2ee:function(t,n,e){"use strict";var r=e("be97"),u=e.n(r);u.a},c60f:function(t,n,e){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0;var r=u(e("7143"));function u(t){return t&&t.__esModule?t:{default:t}}var i={name:"MyBlock",props:{options:{type:Object/String,default:function(){return{}}}},data:function(){return{gallery:[]}},created:function(){this.init()},methods:{init:function(){for(var t in this.options.ad_image_url)this.options.ad_image_url[t]&&this.gallery.push({url:this.options.ad_image_url[t],link:r.default.formatUrl(this.options.ad_link_url[t])})}}};n.default=i}}]);
;(global["webpackJsonp"] = global["webpackJsonp"] || []).push([
    'components/my-block-titlebar/my-block-titlebar-create-component',
    {
        'components/my-block-titlebar/my-block-titlebar-create-component':(function(module, exports, __webpack_require__){
            __webpack_require__('543d')['createComponent'](__webpack_require__("7580"))
        })
    },
    [['components/my-block-titlebar/my-block-titlebar-create-component']]
]);
