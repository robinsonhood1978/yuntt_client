(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/address/build"],{"0c75":function(t,e,n){"use strict";(function(t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var s=d(n("7143")),a=d(n("f8ae")),o=d(n("d85c"));function d(t){return t&&t.__esModule?t:{default:t}}var i=function(){n.e("components/str-autocomplete/str-autocomplete").then(function(){return resolve(n("ce45"))}.bind(null,n)).catch(n.oe)},c={components:{strAutocomplete:i},data:function(){return{addr_type:0,addr_id:0,address:{},regions:[],multiIndex:[0,0,0],selected:"请选择",title:"",stringList:[]}},watch:{address:function(t){this.title=this.address.address}},methods:{selectOne:function(t){this.title=t,this.address.address=t,console.log(t)},textChange:function(e){this.stringList=[],e.length>5&&(o.default.request("article/autocomplete",{value:e},(function(e){0==e.code&&t.setStorageSync("auto_complete",e.data)})),t.getStorageSync("auto_complete")&&(this.stringList=JSON.parse(t.getStorageSync("auto_complete"))||[]))},changeTitle:function(t){this.title=t,this.address.address=t},columnchange:function(t){this.multiIndex[t.detail.column]=t.detail.value,0==t.detail.column?this.multiIndex=[t.detail.value,0,0]:1==t.detail.column&&(this.multiIndex[2]=0),a.default.regions(this,0)},change:function(t){this.address.defaddr=!!t.detail.value},save:function(t){a.default.save(this)},clearInput:function(t,e){console.log("address:",this.address),"address"==e?(console.log("yes"),this.title="",this.address.address="",this.stringList=[]):(console.log("no"),this.address[e]="")}},onLoad:function(e){t.removeStorageSync("auto_complete");var n=t.getStorageSync("address_type")||!1;n||o.default.request("article/currency",{},(function(e){0==e.code&&(console.log("address_type:",e.data.address_type),t.setStorageSync("address_type",e.data.address_type),n=e.data.address_type)})),n&&(this.addr_type=n),e.id>0&&(console.log("options.id:",e.id),this.addr_id=e.id,t.setNavigationBarTitle({title:"编辑收货地址"}),this.title=this.address.address),s.default.reomveStorage("redirect","yes"!=e.redirect),a.default.regions(this,this.addr_id)},onShow:function(){s.default.verifyLogin(!0,!1,!0)}};e.default=c}).call(this,n("543d")["default"])},"2dfc":function(t,e,n){"use strict";n.r(e);var s=n("0c75"),a=n.n(s);for(var o in s)"default"!==o&&function(t){n.d(e,t,(function(){return s[t]}))}(o);e["default"]=a.a},"36c5":function(t,e,n){"use strict";n.d(e,"b",(function(){return a})),n.d(e,"c",(function(){return o})),n.d(e,"a",(function(){return s}));var s={uniIcons:function(){return Promise.all([n.e("common/vendor"),n.e("components/uni-icons/uni-icons")]).then(n.bind(null,"db11"))},strAutocomplete:function(){return n.e("components/str-autocomplete/str-autocomplete").then(n.bind(null,"ce45"))}},a=function(){var t=this,e=t.$createElement;t._self._c},o=[]},"77da":function(t,e,n){"use strict";var s=n("9a54"),a=n.n(s);a.a},"9a54":function(t,e,n){},aacc:function(t,e,n){"use strict";n.r(e);var s=n("36c5"),a=n("2dfc");for(var o in a)"default"!==o&&function(t){n.d(e,t,(function(){return a[t]}))}(o);n("77da");var d,i=n("f0c5"),c=Object(i["a"])(a["default"],s["b"],s["c"],!1,null,"04e01496",null,!1,s["a"],d);e["default"]=c.exports},bd88:function(t,e,n){"use strict";(function(t){n("ff86");s(n("66fd"));var e=s(n("aacc"));function s(t){return t&&t.__esModule?t:{default:t}}wx.__webpack_require_UNI_MP_PLUGIN__=n,t(e.default)}).call(this,n("543d")["createPage"])}},[["bd88","common/runtime","common/vendor"]]]);