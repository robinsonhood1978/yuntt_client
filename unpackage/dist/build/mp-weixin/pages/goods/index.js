(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/goods/index"],{"25e1":function(e,n,t){"use strict";(function(e){Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0;var o=u(t("7143")),r=u(t("4cd6"));function u(e){return e&&e.__esModule?e:{default:e}}var i={data:function(){return{id:0,swiper:{},videoplay:!1,goods:{integral:{}},store:{},cart:{selected:0,price:0,quantity:1,stock:0},teambuy:{teamid:""},mealbuy:{},batchbuy:{mode:"cart",list:[]},specs:{list:{},spec_1:{},spec_2:{},selected:{},disabled:{},destroy:{}},recommend:[],historys:[],promotion:!1,fullprefer:!1,coupons:[],delivery:{name:"",freight:0,addresses:[],shipping:{}},attributes:[],share:{body:{}},isAppBrowser:!1,transparent:{}}},methods:{slide:function(e){this.swiper.current=e.detail.current},labelClick:function(n,t){"store"==n?e.redirectTo({url:"/pages/store/index?id="+this.store.store_id}):"contact"==n?e.showModal({title:"客服电话",content:this.store.tel?this.store.tel:"18999999999",showCancel:!1}):"collect"==n?r.default.collect(this,"remove"==t):"cart"==n&&e.switchTab({url:"/pages/cart/index"})},buttonClick:function(e,n){var t=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"specs";if(n)return this.batchbuy.mode=e,this.$refs[t].open();r.default.addCart(this,"cart"!=e)},changeSpec:function(e,n,t){r.default.changeSpec(this,e,n,t)},shipping:function(e,n){e(),r.default.logistics(this,n)},changeQty:function(e,n){r.default.changeQty(this,e.detail.value,n)},showPopup:function(e,n){return"share"==n&&(this.share.body=r.default.shareBody(this)),this.$refs[n].open()},closePopup:function(e,n){return this.$refs[n].close()},compareText:function(e){return"low"==e?"低":"equal"==e?"平":"高"},dynamicValue:function(e){return Number(e).toFixed(1)},favorite:function(){r.default.favorite(this)},pageback:function(){e.navigateBack()},vplay:function(e){this.videoplay=!!e}},onLoad:function(n){this.id=n.id,n.invite&&e.setStorageSync("distributeInviteGoodsCode",n.invite),r.default.swiper(this),r.default.detail(this),r.default.specs(this),r.default.attributes(this),r.default.delivery(this),r.default.recommend(this),r.default.historys(this.id)},onShow:function(){this.isAppBrowser=!!(o.default.isWechat()||o.default.isAlipay()||o.default.isQqbrowser())},onPageScroll:function(e){},onShareAppMessage:function(e){return r.default.shareBody(this)},onShareTimeline:function(e){return r.default.shareBody(this)}};n.default=i}).call(this,t("543d")["default"])},"4aefb":function(e,n,t){"use strict";var o=t("6f7b"),r=t.n(o);r.a},"5ce0":function(e,n,t){"use strict";t.r(n);var o=t("25e1"),r=t.n(o);for(var u in o)"default"!==u&&function(e){t.d(n,e,(function(){return o[e]}))}(u);n["default"]=r.a},"6f7b":function(e,n,t){},d093:function(e,n,t){"use strict";t.d(n,"b",(function(){return r})),t.d(n,"c",(function(){return u})),t.d(n,"a",(function(){return o}));var o={mySwiperDot:function(){return t.e("components/my-swiper-dot/my-swiper-dot").then(t.bind(null,"3c81"))},uniIcons:function(){return Promise.all([t.e("common/vendor"),t.e("components/uni-icons/uni-icons")]).then(t.bind(null,"db11"))},myCountdown:function(){return t.e("components/my-countdown/my-countdown").then(t.bind(null,"f742"))},uniPopup:function(){return Promise.all([t.e("common/vendor"),t.e("components/uni-popup/uni-popup")]).then(t.bind(null,"4504"))},myPopupBatchbuy:function(){return t.e("components/my-popup-batchbuy/my-popup-batchbuy").then(t.bind(null,"53b5"))},myPopupCoupons:function(){return t.e("components/my-popup-coupons/my-popup-coupons").then(t.bind(null,"7254"))},myPopupIntegral:function(){return t.e("components/my-popup-integral/my-popup-integral").then(t.bind(null,"4fec"))},myPopupFullprefer:function(){return t.e("components/my-popup-fullprefer/my-popup-fullprefer").then(t.bind(null,"9a84"))},myPopupShare:function(){return Promise.all([t.e("common/vendor"),t.e("components/my-popup-share/my-popup-share")]).then(t.bind(null,"2ecf"))},myPopupAddress:function(){return t.e("components/my-popup-address/my-popup-address").then(t.bind(null,"bf77"))},myPopupAttributes:function(){return t.e("components/my-popup-attributes/my-popup-attributes").then(t.bind(null,"1767"))},mpHtml:function(){return Promise.all([t.e("common/vendor"),t.e("components/mp-html/mp-html")]).then(t.bind(null,"6425"))}},r=function(){var e=this,n=e.$createElement,t=(e._self._c,e.batchbuy.list.length>0?e.__map(e.batchbuy.list,(function(n,t){var o=e.__get_orig(n),r=e._f("currency")(n.price);return{$orig:o,f0:r}})):null),o=e.batchbuy.list.length>0||!e.promotion?null:e._f("currency")(e.promotion.price),r=e.batchbuy.list.length>0||!e.promotion?null:e._f("currency")(e.promotion.rfprice),u=e.batchbuy.list.length>0||e.promotion?null:e._f("currency")(e.goods.price),i=e.batchbuy.list.length>0||e.promotion||!(e.goods.mkprice>0)?null:e._f("currency")(e.goods.mkprice),c=e.batchbuy.list.length>0||e.promotion||e.goods.mkprice>0?null:e._f("currency")(e.goods.price),l=e.coupons.length>0?e.__map(e.coupons,(function(n,t){var o=e.__get_orig(n),r=t<2?e._f("currency")(n.min_amount,"",0):null,u=t<2?e._f("currency")(n.coupon_value,"",0):null;return{$orig:o,f6:r,f7:u}})):null,s=e.goods.spec_name_1||e.goods.spec_name_2?Object.values(e.specs.spec_1):null,a=e.goods.spec_name_1||e.goods.spec_name_2?Object.keys(e.specs.spec_1):null,p=e.delivery.freight>0?e._f("currency")(e.delivery.freight):null,d=e.store.dynamiceval?e.dynamicValue(e.store.dynamiceval.goods.value):null,f=e.store.dynamiceval?e.compareText(e.store.dynamiceval.goods.compare.name):null,m=e.store.dynamiceval?e.dynamicValue(e.store.dynamiceval.service.value):null,h=e.store.dynamiceval?e.compareText(e.store.dynamiceval.service.compare.name):null,y=e.store.dynamiceval?e.dynamicValue(e.store.dynamiceval.shipped.value):null,b=e.store.dynamiceval?e.compareText(e.store.dynamiceval.shipped.compare.name):null,_=e.specs.list&&e.promotion?e._f("currency")(e.cart.rfprice):null,g=e.specs.list&&e.promotion?e._f("currency")(e.cart.price):null,v=e.specs.list&&!e.promotion?e._f("currency")(e.cart.price):null,w=e.__map(e.recommend,(function(n,t){var o=e.__get_orig(n),r=e._f("currency")(n.price);return{$orig:o,f12:r}}));e.$mp.data=Object.assign({},{$root:{l0:t,f1:o,f2:r,f3:u,f4:i,f5:c,l1:l,l2:s,g0:a,f8:p,m0:d,m1:f,m2:m,m3:h,m4:y,m5:b,f9:_,f10:g,f11:v,l3:w}})},u=[]},d448:function(e,n,t){"use strict";t.r(n);var o=t("d093"),r=t("5ce0");for(var u in r)"default"!==u&&function(e){t.d(n,e,(function(){return r[e]}))}(u);t("4aefb");var i,c=t("f0c5"),l=Object(c["a"])(r["default"],o["b"],o["c"],!1,null,"54a252db",null,!1,o["a"],i);n["default"]=l.exports},eece:function(e,n,t){"use strict";(function(e){t("ff86");o(t("66fd"));var n=o(t("d448"));function o(e){return e&&e.__esModule?e:{default:e}}wx.__webpack_require_UNI_MP_PLUGIN__=t,e(n.default)}).call(this,t("543d")["createPage"])}},[["eece","common/runtime","common/vendor"]]]);