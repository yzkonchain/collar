(this.webpackJsonprebuild=this.webpackJsonprebuild||[]).push([[18],{319:function(e,t,o){"use strict";o.r(t),o.d(t,"default",function(){return f});var a=o(11),s=o(0),l=o(632),i=o(633),n=o(52),r=o(8),t=o(300),c=o(294),u=o(279),d=o(17),b=o(1),h=Object(n.a)({root:{width:"100%"},title:{color:"#7B96EB",fontFamily:"Gillsans",fontSize:"21px",display:"flex",alignItems:"center",justifyContent:"space-between"},symbol:{fontFamily:"Material Icons Outlined",fontSize:"18px",color:"#B2B2B2"},time:{"& option":{backgroundColor:"#000 !important",borderTop:"none"}},content:{height:"300px",width:"100%"}}),j=Object(r.a)({root:{},input:{color:"#fff",borderRadius:10,position:"relative",border:"1px solid #979797",fontSize:16,padding:"3px 10px","&:focus":{borderRadius:10,backgroundColor:"#000"}}})(t.a),p={grid:{right:0},xAxis:{type:"category",data:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],boundaryGap:!1,axisLabel:{color:"#fff",interval:0,rotate:30},axisTick:{show:!1}},yAxis:{type:"value",axisLine:{show:!0},splitLine:{show:!0,lineStyle:{type:"dashed",color:"grey"}},axisLabel:{color:"#fff",formatter:function(e){var t=[];return e<1e3?t.push(e):t.push(e/1e3+"k"),t}}},series:[{data:[1500,2300,2240,2180,1350,1407,2600],type:"line",symbol:"none",lineStyle:{color:"#59FFAD"},areaStyle:{color:new i.graphic.LinearGradient(0,0,0,1,[{offset:0,color:"rgba(73,255,199,1)"},{offset:1,color:"rgba(128,255,229,0)"}])}}]};function f(){var e=h(),t=Object(s.useState)(null),o=Object(a.a)(t,2),i=o[0],n=o[1],t=Object(s.useState)(""),o=Object(a.a)(t,2),t=o[0],r=o[1];return Object(b.jsxs)("div",{className:e.root,children:[Object(b.jsxs)("div",{className:e.title,children:[Object(b.jsxs)("div",{children:[Object(b.jsx)("span",{style:{marginRight:"5px"},children:"Total Liquidity"}),Object(b.jsx)("span",{className:e.symbol,onMouseEnter:function(e){return n(e.currentTarget)},onMouseLeave:function(){return n(null)},children:"info"}),Object(b.jsx)(d.e,{anchorEl:i,info:"Total Liquidity"})]}),Object(b.jsx)(c.a,{className:e.time,children:Object(b.jsxs)(u.a,{value:t,onChange:function(e){e=e.target.value;return r(e)},input:Object(b.jsx)(j,{}),children:[Object(b.jsx)("option",{value:1,children:"12 hours"}),Object(b.jsx)("option",{value:2,children:"24 hours"}),Object(b.jsx)("option",{value:3,children:"Weekly"}),Object(b.jsx)("option",{value:4,children:"Monthly"})]})})]}),Object(b.jsx)("div",{className:e.content,children:Object(b.jsx)(l.a,{option:p,style:{height:"100%",width:"100%"}})})]})}}}]);