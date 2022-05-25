(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["components/my-popup-batchbuy/my-popup-batchbuy"],{"2ed4":function(e,t,s){"use strict";(function(e){Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var i=c(s("d85c")),n=c(s("7143"));function c(e){return e&&e.__esModule?e:{default:e}}var a={name:"uniPopupDialog",props:{title:{type:String,default:"批发进货"},item:{type:Object,default:function(){return{}}},mode:{type:String,default:"cart"}},data:function(){return{goods:{},quantity:{list:{},total:0,money:0},batchbuy:{},selected:{},specs:{list:{},spec_name_1:"",spec_name_2:"",spec_1:{},spec_2:{},selected:{},disabled:{},destroy:{}},fields:{field:{name:"spec_name_1",value:"spec_1"},thefield:{name:"spec_name_2",value:"spec_2"}}}},inject:["popup"],created:function(){this.popup.mkclick=!0,this.goods=this.item,this.getSpecs(this)},watch:{item:function(e){this.item=e,this.specs={list:{},spec_name_1:"",spec_name_2:"",spec_1:{},spec_2:{},selected:{},disabled:{},destroy:{}},this.batchbuy={},this.fields={field:{name:"spec_name_1",value:"spec_1"},thefield:{name:"spec_name_2",value:"spec_2"}},this.getSpecs(this)}},methods:{confirm:function(){if(this.quantity.total<=0)return e.showToast({title:"请选择数量",icon:"none"}),!1;this.addCart(this),this.popup.close()},close:function(){var e=this;this.beforeClose?this.$emit("close",(function(){e.popup.close()})):this.popup.close()},changeQty:function(t,s,i){this.selected=s,Object.assign(this.goods,this.selected);var n=0,c=Number(this.quantity.list[s.spec_id])||0;"plus"==i?n=c+1:"minus"==i?c>0&&(n=c-1):(n=Number(t.detail.value),n<0&&(n=0)),this.selected.stock<n&&(e.showToast({title:"库存不足",icon:"none"}),n=Number(this.selected.stock)||0),n>=0&&(this.quantity.list[s.spec_id]=n),this.buildMoney(this)},getSpecs:function(e){i.default.request("goods/specs",{goods_id:e.item.goods_id},(function(t){if(0==t.code)for(var s in e.changeFields(e,t.data.list),e.specs[e.fields.field.value]=e.uniqueSpecs(t.data.list,e.fields.field.value),e.specs.list={},t.data.list.forEach((function(t,s){0==s&&(e.specs[e.fields.field.name]=t[e.fields.field.name],e.specs[e.fields.thefield.name]=t[e.fields.thefield.name],Object.assign(e.goods,t)),e.specs.list[t.spec_id]=t,e.$set(e.quantity.list,t.spec_id,0)})),e.specs.list){var i=e.specs.list[s];if(i.stock>0){e.changeSpec(i,e.fields.field.value,e.fields.thefield.value);break}}}))},changeSpec:function(e,t,s){var i=this;if(i.specs.disabled[e[t]])return!1;if(i.specs.selected[t]=e[t],i.secondColumn(i,t,s),i.specs.disabled={},i.specs.destroy={},e[s]){var n={};for(var c in i.specs.list){var a=i.specs.list[c];a[t]==e[t]&&(n[a[s]]=a)}for(var o in i.specs[s]){var l=i.specs[s][o];(!n[l[s]]||n[l[s]].stock<1)&&(i.specs.disabled[l[s]]=!0,i.specs.destroy[l[s]]=!n[l[s]],l[s]==i.specs.selected[s]&&delete i.specs.selected[s])}for(var d in i.specs.list){var u=i.specs.list[d];if(i.specs.selected[t]==u[t]&&i.specs.selected[s]==u[s]){i.selected=u;break}}}else{for(var r in i.specs[t]){var p=i.specs[t][r];0==p.stock&&(i.specs.disabled[p[t]]=!0)}this.selected=e}Object.assign(i.goods,i.selected)},uniqueSpecs:function(e,t){var s={};for(var i in e){var c=e[i];n.default.isEmpty(s[c[t]])&&(s[c[t]]=c)}return s},secondColumn:function(e,t,s){var i=[];for(var n in e.specs.list){var c=e.specs.list[n];c[t]==e.specs.selected[t]&&(i[c[s]]=c)}Object.assign(e.specs[s],i)},changeFields:function(e,t){var s=t.length>0?t[0].spec_qty:0;if(s<2){var i=e.fields.field;e.fields=Object.assign({field:e.fields.thefield,thefield:i})}},buildMoney:function(e){e.getQuantity(e),i.default.request("wholesale/price",{goods_id:e.goods.goods_id,quantity:e.quantity.total},(function(t){for(var s in e.batchbuy=t.data,e.quantity.money=0,e.quantity.list){var i=e.quantity.list[s];if(i>0){var n=e.specs.list[s];0==t.code&&t.data&&t.data.price>=0?n.price=t.data.price:n.promotion&&(n.price=n.promotion.price),e.quantity.money+=parseFloat(n.price*i)}}}))},getQuantity:function(e){var t=0;for(var s in e.quantity.list)e.quantity.list[s]>0&&(t+=e.quantity.list[s]);e.quantity.total=t},addCart:function(t){i.default.request("cart/many",{specs:t.quantity.list,selected:"cart"==t.mode?0:1},(function(s){0==s.code?"cart"==t.mode?e.showToast({title:"已加入购物车"}):e.navigateTo({url:"/pages/order/normal"}):4004==s.code?e.navigateTo({url:"/pages/login/login?redirect=yes",animationType:"slide-in-bottom",animationDuration:300}):e.showToast({title:s.message,icon:"none"})}))}}};t.default=a}).call(this,s("543d")["default"])},4836:function(e,t,s){"use strict";var i=s("4f1b"),n=s.n(i);n.a},"4f1b":function(e,t,s){},"53b5":function(e,t,s){"use strict";s.r(t);var i=s("93c6"),n=s("af44");for(var c in n)"default"!==c&&function(e){s.d(t,e,(function(){return n[e]}))}(c);s("4836");var a,o=s("f0c5"),l=Object(o["a"])(n["default"],i["b"],i["c"],!1,null,"4b2d4bde",null,!1,i["a"],a);t["default"]=l.exports},"93c6":function(e,t,s){"use strict";s.d(t,"b",(function(){return n})),s.d(t,"c",(function(){return c})),s.d(t,"a",(function(){return i}));var i={uniIcons:function(){return Promise.all([s.e("common/vendor"),s.e("components/uni-icons/uni-icons")]).then(s.bind(null,"db11"))}},n=function(){var e=this,t=e.$createElement,s=(e._self._c,e.goods.promotion?e._f("currency")(e.goods.promotion.price):null),i=e.goods.promotion?null:e._f("currency")(e.goods.price),n=e.batchbuy.price>=0?e._f("currency")(e.batchbuy.price):null,c=e._f("currency")(e.quantity.money);e.$mp.data=Object.assign({},{$root:{f0:s,f1:i,f2:n,f3:c}})},c=[]},af44:function(e,t,s){"use strict";s.r(t);var i=s("2ed4"),n=s.n(i);for(var c in i)"default"!==c&&function(e){s.d(t,e,(function(){return i[e]}))}(c);t["default"]=n.a}}]);
;(global["webpackJsonp"] = global["webpackJsonp"] || []).push([
    'components/my-popup-batchbuy/my-popup-batchbuy-create-component',
    {
        'components/my-popup-batchbuy/my-popup-batchbuy-create-component':(function(module, exports, __webpack_require__){
            __webpack_require__('543d')['createComponent'](__webpack_require__("53b5"))
        })
    },
    [['components/my-popup-batchbuy/my-popup-batchbuy-create-component']]
]);
