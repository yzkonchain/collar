(this.webpackJsonprebuild=this.webpackJsonprebuild||[]).push([[13],{314:function(e,t,o){"use strict";o.r(t),o.d(t,"default",function(){return a});var j=o(10),u=o(11),d=o(0),b=o(632),n=o(52),l=o(8),t=o(300),h=o(294),p=o(279),O=o(611),x=o(6),f=o(17),m=o(1),v=Object(n.a)({root:{width:"100%"},title:{color:"#7B96EB",fontFamily:"Gillsans",fontSize:"21px",display:"flex",alignItems:"center",justifyContent:"space-between"},symbol:{fontFamily:"Material Icons Outlined",fontSize:"18px",color:"#B2B2B2"},time:{"& option":{backgroundColor:"#000 !important",borderTop:"none"}},content:{height:"300px",width:"100%",display:"flex",justifyContent:"center",alignItems:"center"}}),g=Object(l.a)({root:{},input:{color:"#fff",borderRadius:10,position:"relative",border:"1px solid #979797",fontSize:16,padding:"3px 10px","&:focus":{borderRadius:10,backgroundColor:"#000"}}})(t.a);function a(e){var t=e.period,o=e.setPeriod,n=e.handleChange,l=v(),a=Object(d.useState)(null),i=Object(u.a)(a,2),e=i[0],r=i[1],a=Object(d.useState)(!0),i=Object(u.a)(a,2),a=i[0],c=i[1],s=Object(d.useContext)(x.m).proState.totalCollateral;return Object(d.useEffect)(function(){s.series&&c(!1)},[s]),Object(m.jsxs)("div",{className:l.root,children:[Object(m.jsxs)("div",{className:l.title,children:[Object(m.jsxs)("div",{children:[Object(m.jsx)("span",{style:{marginRight:"5px"},children:"Total Collateral"}),Object(m.jsx)("span",{className:l.symbol,onMouseEnter:function(e){return r(e.currentTarget)},onMouseLeave:function(){return r(null)},children:"info"}),Object(m.jsx)(f.e,{anchorEl:e,info:"Total Collateral"})]}),Object(m.jsx)(h.a,{className:l.time,children:Object(m.jsxs)(p.a,{value:t.totalCollateral,onChange:function(e){e=e.target.value;o(Object(j.a)(Object(j.a)({},t),{},{totalCollateral:e})),c(!0),n(e,"totalCollateral")},input:Object(m.jsx)(g,{}),children:[Object(m.jsx)("option",{value:"12h",children:"12 hours"}),Object(m.jsx)("option",{value:"24h",children:"24 hours"}),Object(m.jsx)("option",{value:"7d",children:"Weekly"}),Object(m.jsx)("option",{value:"1m",children:"Monthly"})]})})]}),Object(m.jsx)("div",{className:l.content,children:a?Object(m.jsx)(O.a,{color:"primary",size:80}):Object(m.jsx)(b.a,{option:s,style:{height:"100%",width:"100%"}})})]})}}}]);