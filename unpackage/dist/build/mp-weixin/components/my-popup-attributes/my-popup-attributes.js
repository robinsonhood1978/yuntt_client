(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["components/my-popup-attributes/my-popup-attributes"],{"157f":function(t,e,n){"use strict";var u;n.d(e,"b",(function(){return i})),n.d(e,"c",(function(){return o})),n.d(e,"a",(function(){return u}));var i=function(){var t=this,e=t.$createElement;t._self._c},o=[]},1767:function(t,e,n){"use strict";n.r(e);var u=n("157f"),i=n("e3c6");for(var o in i)"default"!==o&&function(t){n.d(e,t,(function(){return i[t]}))}(o);var r,c=n("f0c5"),a=Object(c["a"])(i["default"],u["b"],u["c"],!1,null,"4a642954",null,!1,u["a"],r);e["default"]=a.exports},e3c6:function(t,e,n){"use strict";n.r(e);var u=n("f158"),i=n.n(u);for(var o in u)"default"!==o&&function(t){n.d(e,t,(function(){return u[t]}))}(o);e["default"]=i.a},f158:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var u={name:"uniPopupDialog",props:{title:{type:String,default:"产品参数"},item:{type:Array,default:function(){return[]}}},data:function(){return{attributes:[]}},inject:["popup"],created:function(){this.popup.mkclick=!0,this.attributes=this.item},methods:{confirm:function(){var t=this;this.$emit("confirm",(function(){t.popup.close()}))},close:function(){var t=this;this.beforeClose?this.$emit("close",(function(){t.popup.close()})):this.popup.close()}}};e.default=u}}]);
;(global["webpackJsonp"] = global["webpackJsonp"] || []).push([
    'components/my-popup-attributes/my-popup-attributes-create-component',
    {
        'components/my-popup-attributes/my-popup-attributes-create-component':(function(module, exports, __webpack_require__){
            __webpack_require__('543d')['createComponent'](__webpack_require__("1767"))
        })
    },
    [['components/my-popup-attributes/my-popup-attributes-create-component']]
]);
