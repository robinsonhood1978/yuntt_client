(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["components/str-autocomplete/str-autocomplete"],{"0c16":function(t,e,i){"use strict";var n;i.d(e,"b",(function(){return r})),i.d(e,"c",(function(){return s})),i.d(e,"a",(function(){return n}));var r=function(){var t=this,e=t.$createElement;t._self._c},s=[]},"7bbf":function(t,e,i){},ce45:function(t,e,i){"use strict";i.r(e);var n=i("0c16"),r=i("f147");for(var s in r)"default"!==s&&function(t){i.d(e,t,(function(){return r[t]}))}(s);i("e0c4");var o,u=i("f0c5"),a=Object(u["a"])(r["default"],n["b"],n["c"],!1,null,null,null,!1,n["a"],o);e["default"]=a.exports},d2bc:function(t,e,i){"use strict";(function(t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var i={props:{stringList:{type:Array},importvalue:{type:String},lowerAndUp:{type:String,default:"true"},highlightColor:{type:String,default:"lightcoral"}},data:function(){return{showList:[],value:"",needShow:!1}},watch:{importvalue:function(t,e){this.value=t},stringList:{handler:function(t,e){this.filterList(this.value)},deep:!0}},model:{prop:"value",event:"change"},computed:{isShow:function(){return this.needShow&&this.showList.length>0}},created:function(){this.stringList.sort(),this.showList=this.stringList,this.value=this.importvalue},methods:{onInput:function(t){t.target.value.length>5&&this.filterList(t.target.value),this.$set(this,"value",t.target.value),this.$emit("change",t.target.value),t.target.value.length>0?this.needShow=!0:this.needShow=!1},hideList:function(){var t=this;setTimeout((function(){t.needShow=!1}),300)},filterList:function(e){for(var i=[],n=0;n<this.stringList.length;n++){var r=this.stringList[n],s=this.filterString(e,r);s&&s.number===e.length&&i.push(s)}if(0===i.length&&0!==e.length)return t.showToast({title:"没有匹配的字符串",mask:!1,icon:"none",duration:1500}),!1;this.showList=i},filterString:function(t,e){for(var i=e.split(""),n=[],r=t.split(""),s="<span style=color:"+this.highlightColor+">",o="</span>",u=0,a=0;a<i.length;a++){var l=i[a],h=r[u];if("no"!==this.lowerAndUp&&(l=l.toLowerCase(),h&&(h=h.toLowerCase())),l===h){var c=u;n.push(s);for(var f=0;f<r.length-c;f++){var g=i[a+f]||"",d=r[f+c];if("no"!==this.lowerAndUp&&(g=g.toLowerCase(),d&&(d=d.toLowerCase())),g===d)n.push(i[a+f]),u++;else if(g!==d){n.push(o),n.push(i[a+f]),a+=f;break}f+c===r.length-1&&(a+=f,n.push(o))}}else n.push(i[a])}if(u>0)return{orginalString:e,number:u,showString:n.join("")}},selectThisItem:function(t){this.$set(this,"value",t.orginalString),this.needShow=!1,this.$emit("change",t.orginalString),this.$emit("select",t.orginalString)}}};e.default=i}).call(this,i("543d")["default"])},e0c4:function(t,e,i){"use strict";var n=i("7bbf"),r=i.n(n);r.a},f147:function(t,e,i){"use strict";i.r(e);var n=i("d2bc"),r=i.n(n);for(var s in n)"default"!==s&&function(t){i.d(e,t,(function(){return n[t]}))}(s);e["default"]=r.a}}]);
;(global["webpackJsonp"] = global["webpackJsonp"] || []).push([
    'components/str-autocomplete/str-autocomplete-create-component',
    {
        'components/str-autocomplete/str-autocomplete-create-component':(function(module, exports, __webpack_require__){
            __webpack_require__('543d')['createComponent'](__webpack_require__("ce45"))
        })
    },
    [['components/str-autocomplete/str-autocomplete-create-component']]
]);