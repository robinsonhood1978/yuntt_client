(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["components/my-popup-specs/my-popup-specs"],{"227a":function(e,s,t){"use strict";(function(e){Object.defineProperty(s,"__esModule",{value:!0}),s.default=void 0;var c=n(t("d85c")),i=n(t("7143"));function n(e){return e&&e.__esModule?e:{default:e}}var o={name:"uniPopupDialog",props:{title:{type:String,default:"选择规格"},successText:{type:String,default:"已加入购物车"},item:{type:Object,default:function(){return{}}},mode:{type:String,default:"cart"},showQuantity:{type:Boolean,default:!0}},data:function(){return{goods:{},quantity:1,selected:{},specs:{list:{},spec_name_1:"",spec_name_2:"",spec_1:{},spec_2:{},selected:{},disabled:{},destroy:{}},fields:{field:{name:"spec_name_1",value:"spec_1"},thefield:{name:"spec_name_2",value:"spec_2"}}}},inject:["popup"],created:function(){this.popup.mkclick=!0,this.goods=this.item,this.getSpecs(this)},watch:{item:function(e){this.item=e,this.specs={list:{},spec_name_1:"",spec_name_2:"",spec_1:{},spec_2:{},selected:{},disabled:{},destroy:{}},this.fields={field:{name:"spec_name_1",value:"spec_1"},thefield:{name:"spec_name_2",value:"spec_2"}},this.getSpecs(this)}},methods:{confirm:function(){var s=this;return this.selected.spec_id?this.selected.stock<this.quantity?(e.showToast({title:"库存不足",icon:"none"}),!1):(this.selected.quantity=this.quantity,void this.$emit("confirm",(function(){e.showToast({title:s.successText}),s.popup.close()}),this.selected)):(e.showToast({title:"请选择规格",icon:"none"}),!1)},close:function(){var e=this;this.beforeClose?this.$emit("close",(function(){e.popup.close()})):this.popup.close()},changeQty:function(s,t){var c=0,n=Number(this.quantity)||1;"plus"==t?c=n+1:"minus"==t?n>1&&(c=n-1):(c=Number(s.detail.value),c<1&&(c=1)),!i.default.isEmpty(this.selected.spec_id)&&this.selected.stock<c&&(e.showToast({title:"库存不足",icon:"none"}),c=this.selected.stock>0?this.selected.stock:1),c>0&&(this.quantity=c)},getSpecs:function(e){c.default.request("goods/specs",{goods_id:e.item.goods_id},(function(s){if(0==s.code)for(var t in e.specs[e.fields.field.value]=e.uniqueSpecs(s.data.list,e.fields.field.value),e.specs.list={},s.data.list.forEach((function(s,t){0==t&&(e.specs[e.fields.field.name]=s[e.fields.field.name],e.specs[e.fields.thefield.name]=s[e.fields.thefield.name],Object.assign(e.goods,s)),e.specs.list[s.spec_id]=s})),e.specs.list){var c=e.specs.list[t];if(c.stock>0){e.changeSpec(c,e.fields.field.value,e.fields.thefield.value);break}}}))},changeSpec:function(e,s,t){var c=this;if(c.specs.disabled[e[s]])return!1;if(c.specs.selected[s]=e[s],c.secondColumn(c,s,t),c.specs.disabled={},c.specs.destroy={},e[t]){var i={};for(var n in c.specs.list){var o=c.specs.list[n];o[s]==e[s]&&(i[o[t]]=o)}for(var a in c.specs[t]){var l=c.specs[t][a];(!i[l[t]]||i[l[t]].stock<1)&&(c.specs.disabled[l[t]]=!0,c.specs.destroy[l[t]]=!i[l[t]],l[t]==c.specs.selected[t]&&delete c.specs.selected[t])}for(var d in c.selected={},c.specs.list){var u=c.specs.list[d];if(c.specs.selected[s]==u[s]&&c.specs.selected[t]==u[t]){c.selected=u;break}}}else{for(var p in c.specs[s]){var r=c.specs[s][p];0==r.stock&&(c.specs.disabled[r[s]]=!0)}this.selected=e}Object.assign(c.goods,c.selected)},uniqueSpecs:function(e,s){var t={};for(var c in e){var n=e[c];i.default.isEmpty(t[n[s]])&&(t[n[s]]=n)}return t},secondColumn:function(e,s,t){var c=[];for(var i in e.specs.list){var n=e.specs.list[i];n[s]==e.specs.selected[s]&&(c[n[t]]=n)}Object.assign(e.specs[t],c)}}};s.default=o}).call(this,t("543d")["default"])},"2f78":function(e,s,t){"use strict";t.r(s);var c=t("4c24"),i=t("8c3c");for(var n in i)"default"!==n&&function(e){t.d(s,e,(function(){return i[e]}))}(n);t("7c81");var o,a=t("f0c5"),l=Object(a["a"])(i["default"],c["b"],c["c"],!1,null,"b487612c",null,!1,c["a"],o);s["default"]=l.exports},"4c24":function(e,s,t){"use strict";t.d(s,"b",(function(){return i})),t.d(s,"c",(function(){return n})),t.d(s,"a",(function(){return c}));var c={uniIcons:function(){return Promise.all([t.e("common/vendor"),t.e("components/uni-icons/uni-icons")]).then(t.bind(null,"db11"))}},i=function(){var e=this,s=e.$createElement,t=(e._self._c,e._f("currency")(e.goods.price)),c=e.goods.promotion?e._f("currency")(e.goods.promotion.price):null;e.$mp.data=Object.assign({},{$root:{f0:t,f1:c}})},n=[]},"7c81":function(e,s,t){"use strict";var c=t("a08e"),i=t.n(c);i.a},"8c3c":function(e,s,t){"use strict";t.r(s);var c=t("227a"),i=t.n(c);for(var n in c)"default"!==n&&function(e){t.d(s,e,(function(){return c[e]}))}(n);s["default"]=i.a},a08e:function(e,s,t){}}]);
;(global["webpackJsonp"] = global["webpackJsonp"] || []).push([
    'components/my-popup-specs/my-popup-specs-create-component',
    {
        'components/my-popup-specs/my-popup-specs-create-component':(function(module, exports, __webpack_require__){
            __webpack_require__('543d')['createComponent'](__webpack_require__("2f78"))
        })
    },
    [['components/my-popup-specs/my-popup-specs-create-component']]
]);