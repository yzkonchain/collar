(this.webpackJsonprebuild=this.webpackJsonprebuild||[]).push([[21],{305:function(t,e,i){"use strict";i.r(e),i.d(e,"default",function(){return n});var o=i(11),l=i(17),c=i(0),e=i(85),a=(i(18),i(6),i(28)),r=i(1),d=Object(e.a)({root:{fontFamily:"Frutiger",display:"flex",padding:"10px",alignItems:"center"},main:{display:"flex",flexDirection:"column",justifyContent:"center",color:"#30384B",fontWeight:"bold","&>span":{fontSize:"12px",marginLeft:"2px"}},dollar:{color:"#99A8C9",margin:"5px"},token:{fontSize:"12px",fontWeight:"bold",fontFamily:"Frutiger",color:"#30384B",display:"flex",flexDirection:"column",alignItems:"center",marginRight:"10px"}}),u=function(t,e){return l.ethers.utils.formatUnits(t,e||18)};function n(t){var e=t.state,i=e.state,l=e.token,n=t.title,s=(t.contract,t.fixed),e=d(),t=Object(c.useState)(null),t=Object(o.a)(t,2);return t[0],t[1],Object(r.jsxs)("div",{className:e.root,children:[Object(r.jsxs)("div",{className:e.token,children:[Object(r.jsx)("img",{alt:"",src:l.icon,style:["coll","call","clpt"].includes(n)?{width:"35px",borderRadius:"50%",border:"#DCDCDC 2px solid"}:{width:"35px"}}),Object(r.jsx)("span",{children:l.symbol})]}),Object(r.jsxs)("div",{className:e.main,children:[Object(r.jsx)("div",{style:{fontSize:"35px"},children:s?(+u(i.output[n],l.decimals)).toFixed(s):u(i.output[n],l.decimals)}),Object(r.jsxs)("span",{className:e.dollar,children:["~$",("CLPT"==l.symbol?+u(i.output.clpt):a.a[l.addr]*u(i.output[n],l.decimals)).toFixed(3)]})]})]})}}}]);