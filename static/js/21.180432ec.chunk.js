(this.webpackJsonprebuild=this.webpackJsonprebuild||[]).push([[21],{319:function(e,t,i){"use strict";i.r(t),i.d(t,"default",function(){return s});var d=i(10),j=i(11),u=i(0),b=i(193),n=i(85),o=i(8),t=i(303),p=i(297),h=i(282),x=i(628),f=i(6),O=i(18),m=i(1),g=Object(n.a)({root:{width:"100%",padding:"15px",backgroundColor:"#263C7E",borderRadius:"20px",marginBottom:"40px"},title:{color:"#7B96EB",fontFamily:"Gillsans",fontSize:"21px",display:"flex",alignItems:"center",justifyContent:"space-between"},symbol:{fontFamily:"Material Icons Outlined",fontSize:"18px",color:"#B2B2B2"},time:{"& option":{backgroundColor:"#000 !important",borderTop:"none"}},content:{height:"250px",width:"100%",display:"flex",justifyContent:"center",alignItems:"center"}}),y=Object(o.a)({root:{},input:{color:"#fff",borderRadius:10,position:"relative",border:"1px solid #979797",fontSize:16,padding:"3px 10px","&:focus":{borderRadius:10,backgroundColor:"#000"}}})(t.a);function s(e){var t=e.period,i=e.setPeriod,n=e.handleChange,o=g(),s=Object(u.useState)(null),r=Object(j.a)(s,2),e=r[0],a=r[1],s=Object(u.useState)(!0),r=Object(j.a)(s,2),s=r[0],c=r[1],l=Object(u.useContext)(f.m).proState.historicalInterestRate;return Object(u.useEffect)(function(){l.series&&c(!1)},[l]),Object(m.jsxs)("div",{className:o.root,children:[Object(m.jsxs)("div",{className:o.title,children:[Object(m.jsxs)("div",{children:[Object(m.jsx)("span",{style:{marginRight:"5px"},children:"Historical Interest Rate"}),Object(m.jsx)("span",{className:o.symbol,onMouseEnter:function(e){return a(e.currentTarget)},onMouseLeave:function(){return a(null)},children:"info"}),Object(m.jsx)(O.e,{anchorEl:e,info:"Historical Interest Rate"})]}),Object(m.jsx)(p.a,{className:o.time,children:Object(m.jsxs)(h.a,{value:t.historicalInterestRate,onChange:function(e){e=e.target.value;i(Object(d.a)(Object(d.a)({},t),{},{historicalInterestRate:e})),c(!0),n(e,"historicalInterestRate")},input:Object(m.jsx)(y,{}),children:[Object(m.jsx)("option",{value:"12h",children:"12 hours"}),Object(m.jsx)("option",{value:"24h",children:"24 hours"}),Object(m.jsx)("option",{value:"7d",children:"Weekly"}),Object(m.jsx)("option",{value:"1m",children:"Monthly"})]})})]}),Object(m.jsx)("div",{className:o.content,children:s?Object(m.jsx)(x.a,{color:"primary",size:80}):Object(m.jsxs)("div",{style:{height:"100%",width:"100%",display:"flex",flexDirection:"column"},children:[Object(m.jsxs)("span",{style:{margin:"10px 0 25px 25px",fontSize:"35px",color:"#fff",fontFamily:"Frutiger"},children:[l.series[0].data.slice(-1)[0].toFixed(3)," %"]}),Object(m.jsx)(b.a,{option:l,style:{width:"100%"}})]})})]})}}}]);