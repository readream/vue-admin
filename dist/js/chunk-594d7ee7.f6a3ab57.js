(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-594d7ee7"],{"04ec":function(t,e,o){"use strict";var i=o("a54e"),a=o.n(i);a.a},a54e:function(t,e,o){},a6b2:function(t,e,o){"use strict";o.r(e);var i=function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("div",{staticClass:"goodList"},[o("el-row",[o("el-col",{attrs:{span:24}},[o("el-breadcrumb",{attrs:{separator:"/"}},[o("el-breadcrumb-item",{attrs:{to:{path:"/index"}}},[t._v("首页")]),o("el-breadcrumb-item",{attrs:{to:{path:"/index/goods"}}},[t._v("商品管理")]),o("el-breadcrumb-item",[t._v("商品列表")])],1)],1)],1),o("el-row",[o("el-col",{attrs:{span:24}},[o("el-input",{staticClass:"query-input",attrs:{placeholder:"请输入内容"},nativeOn:{keyup:function(e){return!e.type.indexOf("key")&&t._k(e.keyCode,"enter",13,e.key,"Enter")?null:t.queryGoods(e)}},model:{value:t.query,callback:function(e){t.query=e},expression:"query"}},[o("el-button",{attrs:{slot:"append",icon:"el-icon-search"},on:{click:t.queryGoods},slot:"append"})],1)],1)],1),[o("el-table",{directives:[{name:"loading",rawName:"v-loading",value:t.loading,expression:"loading"}],staticClass:"data-table",staticStyle:{width:"100%"},attrs:{data:t.goodList,border:""}},[o("el-table-column",{attrs:{type:"index",width:"50",label:"编号"}}),o("el-table-column",{attrs:{prop:"goods_id",label:"商品ID",width:"80px"}}),o("el-table-column",{attrs:{prop:"goods_name",label:"商品名称",width:"400px"}}),o("el-table-column",{attrs:{prop:"goods_price",label:"价格",width:"100px"}}),o("el-table-column",{attrs:{prop:"goods_number",label:"数量",width:"100px"}}),o("el-table-column",{attrs:{prop:"goods_weight",label:"重量",width:"100px"}}),o("el-table-column",{attrs:{label:"商品状态",width:"100px"},scopedSlots:t._u([{key:"default",fn:function(e){return[o("span",{staticStyle:{"margin-left":"10px"}},[t._v(t._s(t.handleState(e.row.goods_state)))])]}}])}),o("el-table-column",{attrs:{label:"添加时间",width:"200px"},scopedSlots:t._u([{key:"default",fn:function(e){return[o("span",{staticStyle:{"margin-left":"10px"}},[t._v(t._s(t.dateFormat(e.row.add_time)))])]}}])}),o("el-table-column",{attrs:{label:"更新时间",width:"200px"},scopedSlots:t._u([{key:"default",fn:function(e){return[o("span",{staticStyle:{"margin-left":"10px"}},[t._v(t._s(t.dateFormat(e.row.upd_time)))])]}}])}),o("el-table-column",{attrs:{prop:"hot_mumber",label:"热销品数量",width:"80px"}}),o("el-table-column",{attrs:{label:"是否是热销品",width:"80px"},scopedSlots:t._u([{key:"default",fn:function(e){return[o("span",{staticStyle:{"margin-left":"10px"}},[t._v(t._s(1==e.row.is_promote?"是":"否"))])]}}])}),o("el-table-column",{attrs:{fixed:"right",label:"操作",align:"center",width:"200px"},scopedSlots:t._u([{key:"default",fn:function(e){return[o("el-button",{attrs:{type:"primary",icon:"el-icon-edit",size:"small",plain:""},on:{click:function(o){return t.editGood(e.row)}}}),o("el-button",{attrs:{type:"danger",icon:"el-icon-delete",size:"small",plain:""},on:{click:function(o){return t.deleteGood(e.row)}}})]}}])})],1)],o("el-pagination",{attrs:{"current-page":t.pagenum,"page-sizes":[10,20,30,40],"page-size":t.pagesize,layout:"total, sizes, prev, pager, next, jumper",total:t.total},on:{"size-change":t.handleSizeChange,"current-change":t.handleCurrentChange}}),o("el-dialog",{attrs:{title:"商品名称",visible:t.editDialogFormVisible,width:"650px"},on:{"update:visible":function(e){t.editDialogFormVisible=e}}},[o("el-form",{ref:"editGoodList",staticClass:"eid-input",attrs:{model:t.editGoodList,rules:t.rules}},[o("el-form-item",{attrs:{label:"商品名称","label-width":"110px",prop:"goods_name"}},[o("el-input",{attrs:{autocomplete:"off"},model:{value:t.editGoodList.goods_name,callback:function(e){t.$set(t.editGoodList,"goods_name",e)},expression:"editGoodList.goods_name"}})],1),o("el-form-item",{attrs:{label:"价格","label-width":"110px",prop:"goods_price"}},[o("el-input",{attrs:{autocomplete:"off"},model:{value:t.editGoodList.goods_price,callback:function(e){t.$set(t.editGoodList,"goods_price",e)},expression:"editGoodList.goods_price"}})],1),o("el-form-item",{attrs:{label:"数量","label-width":"110px",prop:"goods_number"}},[o("el-input",{attrs:{autocomplete:"off"},model:{value:t.editGoodList.goods_number,callback:function(e){t.$set(t.editGoodList,"goods_number",e)},expression:"editGoodList.goods_number"}})],1),o("el-form-item",{attrs:{label:"重量","label-width":"110px",prop:"goods_weight"}},[o("el-input",{attrs:{autocomplete:"off"},model:{value:t.editGoodList.goods_weight,callback:function(e){t.$set(t.editGoodList,"goods_weight",e)},expression:"editGoodList.goods_weight"}})],1),o("el-form-item",{attrs:{label:"介绍","label-width":"110px",prop:"goods_introduce"}},[o("el-input",{attrs:{autocomplete:"off",disabled:""}})],1)],1),o("div",{attrs:{slot:"footer"},slot:"footer"},[o("el-button",{on:{click:function(e){t.eidDialogFormVisible=!1}}},[t._v("取 消")]),o("el-button",{attrs:{type:"primary"},on:{click:function(e){return t.editGoodsList("editGoodList")}}},[t._v("确 定")])],1)],1)],2)},a=[],s=o("365c"),n={data:function(){return{goodList:[],query:"",pagenum:1,pagesize:10,total:0,loading:!0,editDialogFormVisible:!1,editGoodList:{},rules:{goods_name:[{required:!0,message:"请输入商品名称",trigger:"blur"}],goods_price:[{required:!0,message:"请输入商品价格",trigger:"blur"}],goods_number:[{required:!0,message:"请输入商品数量",trigger:"blur"}],goods_weight:[{required:!0,message:"请输入商品重量",trigger:"blur"}]}}},created:function(){this.initData()},methods:{initData:function(){var t=this;this.loading=!0,Object(s["k"])({params:{query:this.query,pagenum:this.pagenum,pagesize:this.pagesize}}).then(function(e){200===e.meta.status&&(t.loading=!1,t.goodList=e.data.goods,t.total=e.data.total)})},queryGoods:function(){this.initData()},deleteGood:function(t){var e=this;Object(s["e"])(t.goods_id).then(function(t){e.$confirm("此操作将永久删除该商品, 是否继续?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(){200===t.meta.status&&(e.$message({type:"success",message:t.meta.msg}),e.initData())}).catch(function(){e.$message({type:"info",message:"已取消删除"})})})},editGood:function(t){var e=this;this.editDialogFormVisible=!0,Object(s["r"])(t.goods_id).then(function(t){200===t.meta.status&&(e.editGoodList=t.data)})},editGoodsList:function(t){var e=this;this.$refs[t].validate(function(t){if(t){var o={id:e.editGoodList.goods_id,goods_name:e.editGoodList.goods_name,goods_price:e.editGoodList.goods_price,goods_number:e.editGoodList.goods_number,goods_weight:e.editGoodList.goods_weight,goods_introduce:"",pics:"",attrs:[]};Object(s["i"])(o).then(function(t){200===t.meta.status?e.$message({type:"success",message:"商品数据更新成功"}):400===t.meta.status&&e.$message({type:"danger",message:"服务器请求参数错误！联系管理员"}),e.eidDialogFormVisible=!1,e.initData()})}})},handleState:function(t){return 0===t?"未通过":1===t?"审核中":"已审核"},dateFormat:function(t){var e=new Date(t),o=e.getFullYear(),i=e.getMonth()+1,a=e.getDate(),s=e.getHours(),n=e.getMinutes(),l=e.getSeconds();return o+"-"+i+"-"+a+" "+s+":"+n+":"+l},handleSizeChange:function(t){this.pagesize=t,this.initData()},handleCurrentChange:function(t){this.pagenum=t,this.initData()}}},l=n,r=(o("04ec"),o("2877")),d=Object(r["a"])(l,i,a,!1,null,"1c952f08",null);e["default"]=d.exports}}]);
//# sourceMappingURL=chunk-594d7ee7.f6a3ab57.js.map