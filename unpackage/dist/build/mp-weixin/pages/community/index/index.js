(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/community/index/index"],{"163d":function(n,e,o){},8773:function(n,e,o){"use strict";(function(n){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var t=u(o("7143")),i=u(o("e756")),c=u(o("4157"));function u(n){return n&&n.__esModule?n:{default:n}}var l={data:function(){return{util:t.default,floors:[],swiper:{current:0,mode:"default",list:[]},guideshop:{},gcategory:[],gallery:{cid:0,list:[],page:1},limitbuys:[],cart:{list:{},quantity:{},total:0,paymoney:0},popup:{},loadMore:{show:!1},share:{body:{}}}},methods:{slide:function(n){this.swiper.current=n.detail.current},search:function(e){e>0&&n.navigateTo({url:"/pages/community/category/list?id="+e})},submit:function(n,e){e&&(this.cart=e,n()),i.default.submit(this)},showPopup:function(e,o,t){if("specs"==o)this.popup=t;else if("cart"==o){if(this.cart.total<=0)return!1}else if("share"==o){if(!this.guideshop.id)return n.showToast({title:"请先设置提货点",icon:"none"}),!1;this.share.body=c.default.shareBody(this)}return this.$refs[o].open()},closePopup:function(n,e){return this.$refs[e].close()},close:function(n){n()},confirm:function(n,e){i.default.addCart(this,e),n()},changeQty:function(n,e){n.default_spec&&(n.spec_id=n.default_spec),i.default.changeQty(this,n,e)},clickLoadMore:function(){c.default.gallery(this,this.gallery.page+1)}},created:function(){c.default.gcategory(this),c.default.swiper(this),c.default.floors(this),c.default.showLoadMore(this)},onLoad:function(e){e.shopid&&n.setStorageSync("guideshopid",e.shopid),e.cate_id&&(this.gallery.cid=Number(e.cate_id)),this.gallery.list=[],c.default.gallery(this,1),c.default.limitbuys(this)},onReachBottom:function(){c.default.gallery(this,this.gallery.page+1)},onShow:function(){t.default.reomveStorage("redirect",!0),c.default.guideshop(this,!1),i.default.buildQty(this)},onShareAppMessage:function(n){return c.default.shareBody(this)},onShareTimeline:function(n){return c.default.shareBody(this)}};e.default=l}).call(this,o("543d")["default"])},c29e:function(n,e,o){"use strict";o.d(e,"b",(function(){return i})),o.d(e,"c",(function(){return c})),o.d(e,"a",(function(){return t}));var t={uniIcons:function(){return Promise.all([o.e("common/vendor"),o.e("components/uni-icons/uni-icons")]).then(o.bind(null,"db11"))},myBlockSearchbox:function(){return Promise.all([o.e("common/vendor"),o.e("components/my-block-searchbox/my-block-searchbox")]).then(o.bind(null,"769c"))},myBlockCategory:function(){return o.e("components/my-block-category/my-block-category").then(o.bind(null,"613e"))},myBlockSwiper:function(){return o.e("components/my-block-swiper/my-block-swiper").then(o.bind(null,"d96a"))},myBlockMainnav:function(){return o.e("components/my-block-mainnav/my-block-mainnav").then(o.bind(null,"0e56"))},myBlockTitlebar:function(){return o.e("components/my-block-titlebar/my-block-titlebar").then(o.bind(null,"7580"))},myBlockImagead:function(){return o.e("components/my-block-imagead/my-block-imagead").then(o.bind(null,"3b7c"))},myBlockGoodslist:function(){return o.e("components/my-block-goodslist/my-block-goodslist").then(o.bind(null,"f36a"))},myBlockCoupon:function(){return o.e("components/my-block-coupon/my-block-coupon").then(o.bind(null,"1c0b"))},myBlockLimitbuy:function(){return o.e("components/my-block-limitbuy/my-block-limitbuy").then(o.bind(null,"78f7"))},myBlockTeambuy:function(){return o.e("components/my-block-teambuy/my-block-teambuy").then(o.bind(null,"7d01"))},myBlockNotice:function(){return o.e("components/my-block-notice/my-block-notice").then(o.bind(null,"a8e1"))},myBlockTextbox:function(){return o.e("components/my-block-textbox/my-block-textbox").then(o.bind(null,"37ad"))},myBlockBlank:function(){return o.e("components/my-block-blank/my-block-blank").then(o.bind(null,"7f16"))},myBlockHorzline:function(){return o.e("components/my-block-horzline/my-block-horzline").then(o.bind(null,"735c"))},myCountdown:function(){return o.e("components/my-countdown/my-countdown").then(o.bind(null,"f742"))},uniLoadMore:function(){return o.e("components/uni-load-more/uni-load-more").then(o.bind(null,"db13"))},uniPopup:function(){return Promise.all([o.e("common/vendor"),o.e("components/uni-popup/uni-popup")]).then(o.bind(null,"4504"))},myPopupSpecs:function(){return o.e("components/my-popup-specs/my-popup-specs").then(o.bind(null,"2f78"))},myPopupShopcart:function(){return o.e("components/my-popup-shopcart/my-popup-shopcart").then(o.bind(null,"783c"))},myPopupShare:function(){return Promise.all([o.e("common/vendor"),o.e("components/my-popup-share/my-popup-share")]).then(o.bind(null,"2ecf"))}},i=function(){var n=this,e=n.$createElement,o=(n._self._c,n.limitbuys.length>0?n.__map(n.limitbuys,(function(e,o){var t=n.__get_orig(e),i=n._f("currency")(e.promotion.price);return{$orig:t,f0:i}})):null),t=n.gallery.list.length>0?n.__map(n.gallery.list,(function(e,o){var t=n.__get_orig(e),i=e.promotion?n._f("currency")(e.price):null,c=!e.promotion&&e.mkprice>0?n._f("currency")(e.mkprice):null,u=e.promotion?n._f("currency")(e.promotion.price):null,l=e.promotion?null:n._f("currency")(e.price);return{$orig:t,f1:i,f2:c,f3:u,f4:l}})):null,i=n._f("currency")(n.cart.paymoney);n.$mp.data=Object.assign({},{$root:{l0:o,l1:t,f5:i}})},c=[]},c7c2:function(n,e,o){"use strict";o.r(e);var t=o("8773"),i=o.n(t);for(var c in t)"default"!==c&&function(n){o.d(e,n,(function(){return t[n]}))}(c);e["default"]=i.a},d746:function(n,e,o){"use strict";(function(n){o("ff86");t(o("66fd"));var e=t(o("f747"));function t(n){return n&&n.__esModule?n:{default:n}}wx.__webpack_require_UNI_MP_PLUGIN__=o,n(e.default)}).call(this,o("543d")["createPage"])},f747:function(n,e,o){"use strict";o.r(e);var t=o("c29e"),i=o("c7c2");for(var c in i)"default"!==c&&function(n){o.d(e,n,(function(){return i[n]}))}(c);o("fc27");var u,l=o("f0c5"),r=Object(l["a"])(i["default"],t["b"],t["c"],!1,null,"04e9f113",null,!1,t["a"],u);e["default"]=r.exports},fc27:function(n,e,o){"use strict";var t=o("163d"),i=o.n(t);i.a}},[["d746","common/runtime","common/vendor"]]]);