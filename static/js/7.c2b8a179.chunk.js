(this.webpackJsonprebuild=this.webpackJsonprebuild||[]).push([[7],{323:function(e,t,o){"use strict";o.r(t),o.d(t,"default",function(){return i});var d=o(10),u=o(11),p=o(0),b=o(193),n=o(85),a=o(8),t=o(303),j=o(297),x=o(282),f=o(628),h=o(6),O=o(18),m=o(650),g=o(1),v=Object(n.a)({root:{width:"100%",padding:"15px",backgroundColor:"#263C7E",borderRadius:"20px",marginBottom:"40px"},title:{color:"#7B96EB",fontFamily:"Gillsans",fontSize:"21px",display:"flex",alignItems:"center",justifyContent:"space-between"},symbol:{fontFamily:"Material Icons Outlined",fontSize:"18px",color:"#B2B2B2"},time:{"& option":{backgroundColor:"#000 !important",borderTop:"none"}},content:{height:"250px",width:"100%",display:"flex",justifyContent:"center",alignItems:"center"}}),k=Object(a.a)({root:{},input:{color:"#fff",borderRadius:10,position:"relative",border:"1px solid #979797",fontSize:16,padding:"3px 10px","&:focus":{borderRadius:10,backgroundColor:"#000"}}})(t.a);function i(e){var t=e.period,o=e.setPeriod,n=e.handleChange,a=v(),i=Object(p.useState)(null),r=Object(u.a)(i,2),e=r[0],s=r[1],i=Object(p.useState)(!0),r=Object(u.a)(i,2),i=r[0],c=r[1],l=Object(p.useContext)(h.m).proState.totalLockedValue;return Object(p.useEffect)(function(){l.series&&c(!1)},[l]),Object(g.jsxs)("div",{className:a.root,children:[Object(g.jsxs)("div",{className:a.title,children:[Object(g.jsxs)("div",{children:[Object(g.jsx)("span",{style:{marginRight:"5px"},children:"Total Value Locked"}),Object(g.jsx)("span",{className:a.symbol,onMouseEnter:function(e){return s(e.currentTarget)},onMouseLeave:function(){return s(null)},children:"info"}),Object(g.jsx)(O.e,{anchorEl:e,info:"Total asset value locked in protocol."})]}),Object(g.jsx)(j.a,{className:a.time,children:Object(g.jsxs)(x.a,{value:t.totalLockedValue,onChange:function(e){e=e.target.value;o(Object(d.a)(Object(d.a)({},t),{},{totalLockedValue:e})),c(!0),n(e,"totalLockedValue")},input:Object(g.jsx)(k,{}),children:[Object(g.jsx)("option",{value:"12h",children:"12 hours"}),Object(g.jsx)("option",{value:"24h",children:"24 hours"}),Object(g.jsx)("option",{value:"7d",children:"Weekly"}),Object(g.jsx)("option",{value:"1m",children:"Monthly"})]})})]}),Object(g.jsx)("div",{className:a.content,children:i?Object(g.jsx)(f.a,{color:"primary",size:80}):Object(g.jsxs)("div",{style:{height:"100%",width:"100%",display:"flex",flexDirection:"column"},children:[Object(g.jsxs)("span",{style:{margin:"10px 0 25px 25px",fontSize:"35px",color:"#fff",fontFamily:"Frutiger"},children:["$ ",Object(m.a)(l.series[0].data.slice(-1)[0],1)]}),Object(g.jsx)(b.a,{option:l,style:{width:"100%"}})]})})]})}},650:function(e,t,o){"use strict";o.d(t,"b",function(){return a}),o.d(t,"a",function(){return i});var n=o(17),a=function(e,t){return n.ethers.utils.parseUnits(e||"0",t||18)},i=function(e){var t,o=1<arguments.length&&void 0!==arguments[1]?arguments[1]:3;switch(!0){case e<parseFloat("1e3"):t=parseFloat(e).toFixed(o);break;case e<parseFloat("1e6"):t=parseInt(e/1e3).toFixed(o)+" K";break;case e<parseFloat("1e9"):t=parseInt(e/1e6).toFixed(o)+" M";break;case e<parseFloat("1e12"):t=parseInt(e/1e6).toFixed(o)+" G";break;case e<parseFloat("1e15"):t=parseInt(e/1e6).toFixed(o)+" T";break;default:t=e}return t}}}]);