(this.webpackJsonprebuild=this.webpackJsonprebuild||[]).push([[0,19,20,21,22],{305:function(e,t,n){"use strict";n.r(t),n.d(t,"default",function(){return l});var c=n(11),a=n(17),o=n(0),t=n(85),r=(n(18),n(6),n(28)),s=n(1),d=Object(t.a)({root:{fontFamily:"Frutiger",display:"flex",padding:"10px",alignItems:"center"},main:{display:"flex",flexDirection:"column",justifyContent:"center",color:"#30384B",fontWeight:"bold","&>span":{fontSize:"12px",marginLeft:"2px"}},dollar:{color:"#99A8C9",margin:"5px"},token:{fontSize:"12px",fontWeight:"bold",fontFamily:"Frutiger",color:"#30384B",display:"flex",flexDirection:"column",alignItems:"center",marginRight:"10px"}}),u=function(e,t){return a.ethers.utils.formatUnits(e,t||18)};function l(e){var t=e.state,n=t.state,a=t.token,l=e.title,i=(e.contract,e.fixed),t=d(),e=Object(o.useState)(null),e=Object(c.a)(e,2);return e[0],e[1],Object(s.jsxs)("div",{className:t.root,children:[Object(s.jsxs)("div",{className:t.token,children:[Object(s.jsx)("img",{alt:"",src:a.icon,style:["coll","call","clpt"].includes(l)?{width:"35px",borderRadius:"50%",border:"#DCDCDC 2px solid"}:{width:"35px"}}),Object(s.jsx)("span",{children:a.symbol})]}),Object(s.jsxs)("div",{className:t.main,children:[Object(s.jsx)("div",{style:{fontSize:"35px"},children:i?(+u(n.output[l],a.decimals)).toFixed(i):u(n.output[l],a.decimals)}),Object(s.jsxs)("span",{className:t.dollar,children:["~$",("CLPT"==a.symbol?+u(n.output.clpt):r.a[a.addr]*u(n.output[l],a.decimals)).toFixed(3)]})]})]})}},306:function(e,t,n){"use strict";n.r(t),n.d(t,"default",function(){return i});var a=n(130),l=n(1);function i(e){var t=e.token,e=e.contract;return Object(l.jsxs)("div",{style:{paddingLeft:"55px",color:"#99A8C9",fontFamily:"Gillsans",fontSize:"18px",display:"flex",alignItems:"center",margin:"10px 0"},children:[Object(l.jsx)("span",{children:t}),Object(l.jsx)("span",{style:{margin:"0 10px"},children:"Contract Link"}),Object(l.jsx)("a",{style:{color:"#99A8C9",fontSize:"14px",width:"100px",textDecoration:"none",textOverflow:"ellipsis",overflow:"hidden",whiteSpace:"nowrap",marginLeft:"20px",borderRadius:"10px",padding:"0 15px",boxShadow:"0px 5px 5px -3px rgb(38 111 239 / 10%), \n        0px 8px 10px 1px rgb(38 111 239 / 8%), \n        0px 1px 5px 2px rgb(38 111 239 / 30%)"},href:"".concat(a.a.browser,"/address/").concat(e),target:"_blank",rel:"noopener noreferrer",children:e})]})}},307:function(e,t,n){"use strict";n.r(t),n.d(t,"default",function(){return a});var f=n(15),b=n(10),p=n(11),j=n(17),m=n(0),t=n(85),O=n(645),h=n(27),g=n(28),v=n(1),y=Object(t.a)({root:{display:"flex",padding:"10px",alignItems:"center"},main:{display:"flex",flexDirection:"column",justifyContent:"center",position:"relative",fontFamily:"Frutiger",width:"100%","& input":{padding:"0",margin:"0 5px 0 0",fontSize:function(e){e=e.fontSize;return"".concat(e,"px")},fontWeight:"bold",border:"none",width:"100%",color:"#30384B"}},amount:{display:"flex",alignItems:"center",justifyContent:"space-between","&>div":{width:"100%","&>div":{"&:before,&:after,&:hover:not(.Mui-disabled):before":{border:"none"}}}},token:{fontSize:"12px",fontWeight:"bold",fontFamily:"Frutiger",color:"#30384B",display:"flex",flexDirection:"column",alignItems:"center",marginRight:"10px"},dollar:{color:"#99A8C9",margin:"5px",fontWeight:"bold",fontSize:"12px"}});function a(e){var t=e.State,l=e.title,e=Object(m.useState)(35),e=Object(p.a)(e,2),i=e[0],c=e[1],n=y({fontSize:i}),o=t.state,a=t.setState,r=t.token,s=t.max,d=t.if_max,u=Object(m.useRef)(),x=Object(m.useCallback)(function(e){var t=e.target.value,n=e.nativeEvent.data;-1<["0","1","2","3","4","5","6","7","8","9",".",null].indexOf(n)&&(e=o.I[l],"."===n&&(1===t.length||-1!==e.indexOf("."))||"0"===e&&-1===[".",null].indexOf(n)||(-1==t.indexOf(".")?0:t.length-t.indexOf(".")-1)>r.decimals||a({I:Object(b.a)(Object(b.a)({},o.I),{},Object(f.a)({},l,t)),old:Object(b.a)(Object(b.a)({},o.old),{},Object(f.a)({},l,e))}))},[o.I,s]);return Object(m.useEffect)(function(){var e=[o.I[l],o.old[l]],t=e[0],n=e[1],a=u.current,e=a.offsetWidth,a=a.scrollWidth;t.length>(n||"").length&&e<a-1&&8<=i?c(.91*i):t.length<(n||"").length&&a<=e&&i<35&&c(1.1*i)},[i,o.I[l]]),Object(m.useMemo)(function(){return Object(v.jsxs)("div",{className:n.root,children:[Object(v.jsxs)("div",{className:n.token,children:[Object(v.jsx)("img",{alt:"",src:r.icon,style:["coll","call"].includes(l)?{width:"35px",borderRadius:"50%",border:"#DCDCDC 2px solid"}:{width:"35px"}}),Object(v.jsx)("span",{children:r.symbol})]}),Object(v.jsxs)("div",{className:n.main,children:[Object(v.jsx)("div",{className:n.amount,children:Object(v.jsx)(O.a,{value:o.I[l],onChange:x,inputRef:u,placeholder:"0.00",InputProps:{endAdornment:Object(v.jsx)("img",{alt:"",src:d?h.k:h.l,onClick:d?function(){var e;a({I:Object(b.a)(Object(b.a)({},o.I),{},Object(f.a)({},l,"".concat((e=r.decimals,j.ethers.utils.formatUnits(s,e||18)))))})}:function(){},style:{width:"60px"}})}})}),Object(v.jsxs)("span",{className:n.dollar,children:["~$",(g.a[r.addr]*o.I[l]).toFixed(3)]})]})]})},[t])}},308:function(e,t,n){"use strict";n.r(t),n.d(t,"default",function(){return a});var b=n(15),p=n(10),j=n(11),m=n(17),O=n(0),t=n(85),h=n(645),g=n(27),v=n(28),y=n(1),w=Object(t.a)({root:{display:"flex",padding:"10px",alignItems:"center"},main:{display:"flex",flexDirection:"column",justifyContent:"center",position:"relative",fontFamily:"Frutiger",width:"100%","& input":{padding:"0",margin:"0 5px 0 0",fontSize:function(e){e=e.fontSize;return"".concat(e,"px")},fontWeight:"bold",border:"none",width:"100%",color:"#30384B"}},amount:{display:"flex",alignItems:"center",justifyContent:"space-between","&>div":{width:"100%","&>div":{"&:before,&:after,&:hover:not(.Mui-disabled):before":{border:"none"}}}},token:{fontSize:"12px",fontWeight:"bold",fontFamily:"Frutiger",color:"#30384B",display:"flex",flexDirection:"column",alignItems:"center",marginRight:"10px"},dollar:{color:"#99A8C9",margin:"5px",fontWeight:"bold",fontSize:"12px"}});function a(e){var t=e.State,l=e.title,n=e.setTokenSelected,e=Object(O.useState)(35),e=Object(j.a)(e,2),i=e[0],c=e[1],a=w({fontSize:i}),o=t.state,r=t.setState,s=t.token,d=t.max,u=t.if_max,x=Object(O.useRef)(),f=Object(O.useCallback)(function(e){var t=e.target.value,n=e.nativeEvent.data;-1<["0","1","2","3","4","5","6","7","8","9",".",null].indexOf(n)&&(e=o.I[l],"."===n&&(1===t.length||-1!==e.indexOf("."))||"0"===e&&-1===[".",null].indexOf(n)||(-1==t.indexOf(".")?0:t.length-t.indexOf(".")-1)>s.decimals||r({I:Object(p.a)(Object(p.a)({},o.I),{},Object(b.a)({},l,t)),old:Object(p.a)(Object(p.a)({},o.old),{},Object(b.a)({},l,e))}))},[o.I,d]);return Object(O.useEffect)(function(){var e=[o.I[l],o.old[l]],t=e[0],n=e[1],a=x.current,e=a.offsetWidth,a=a.scrollWidth;t.length>(n||"").length&&e<a-1&&8<=i?c(.91*i):t.length<(n||"").length&&a<=e&&i<35&&c(1.1*i)},[i,o.I[l]]),Object(O.useMemo)(function(){return Object(y.jsxs)("div",{className:a.root,children:[Object(y.jsxs)("div",{className:a.token,children:[Object(y.jsx)("img",{alt:"",src:s.icon,style:["coll","call"].includes(l)?{width:"35px",borderRadius:"50%",border:"#DCDCDC 2px solid"}:{width:"35px"}}),Object(y.jsx)("span",{children:s.symbol}),Object(y.jsx)("span",{style:{display:"flex",alignItems:"center",justifyContent:"center",backgroundColor:"#275BFF",color:"white",textTransform:"none",fontFamily:"Material Icons",fontSize:"18px",margin:"0 8px",height:"14px",width:"24px",borderRadius:"8px"},onClick:n,children:"expand_more"})]}),Object(y.jsxs)("div",{className:a.main,children:[Object(y.jsx)("div",{className:a.amount,children:Object(y.jsx)(h.a,{value:o.I[l],onChange:f,inputRef:x,placeholder:"0.00",InputProps:{endAdornment:Object(y.jsx)("img",{alt:"",src:u?g.k:g.l,onClick:u?function(){var e;r({I:Object(p.a)(Object(p.a)({},o.I),{},Object(b.a)({},l,"".concat((e=s.decimals,m.ethers.utils.formatUnits(d,e||18)))))})}:function(){},style:{width:"60px"}})}})}),Object(y.jsxs)("span",{className:a.dollar,children:["~$",(v.a[s.addr]*o.I[l]).toFixed(3)]})]})]})},[t])}},327:function(e,t,n){"use strict";n.r(t),n.d(t,"default",function(){return l});var s=n(10),d=n(11),a=n(17),u=n(0),t=n(85),x=n(18),f=n(6),b=n(651),p=n(308),j=n(307),m=n(305),O=n(306),h=n(1),g=a.ethers.constants.Zero,v={input:{coll:g,call:g,want:g},output:{bond:g},I:{coll:"",call:"",want:""},old:{coll:"",call:"",want:""}},y=Object(t.a)({root:{display:"flex",justifyContent:"space-between",alignItems:"stretch"},main:{flex:6,display:"flex",flexDirection:"column"},icon_arrow:{fontFamily:"Material Icons",fontSize:"24px",display:"flex",alignItems:"center",justifyContent:"center",flex:1},button:{marginTop:"20px",display:"flex",justifyContent:"space-between","&>button":{flex:1,"&:nth-child(1)":{marginRight:"10px"}}},input:{width:"100%",border:"black 2px solid",flexGrow:1,display:"flex",flexDirection:"column",justifyContent:"center"},show:{flex:9,display:"flex",flexDirection:"column","&>div":{flex:1,border:"black 2px solid"}}});function l(e){var t=e.data,n=y(),a=(Object(u.useContext)(f.e).state.controller,Object(u.useContext)(f.m).handleClick),e=Object(u.useReducer)(function(e,t){return Object(s.a)(Object(s.a)({},e),t)},v),e=Object(d.a)(e,2),l=e[0],i=e[1],e=Object(u.useState)(0),e=Object(d.a)(e,2),c=e[0],o=e[1],r=t.pool;return Object(u.useEffect)(function(){var e=Object(b.c)(l.I.coll),t=(Object(b.c)(l.I.call),Object(b.c)(l.I.want,r.want.decimals));e.eq(l.input.coll)?t.eq(l.input.want)||i({input:Object(s.a)(Object(s.a)({},l.input),{},{want:t}),output:{bond:t}}):i({input:Object(s.a)(Object(s.a)({},l.input),{},{coll:e}),output:{bond:e}})},[l.I]),Object(h.jsxs)("div",{className:n.root,children:[Object(h.jsxs)("div",{className:n.main,children:[Object(h.jsxs)("div",{className:n.input,children:[Object(h.jsx)(j.default,{title:"call",State:{state:l,setState:i,token:r.call,max:t.call,if_max:t.call.gt("0")}}),Object(h.jsx)(p.default,{title:["coll","want"][c],State:{state:l,setState:i,token:[r.coll,r.want][c],max:[t.coll,t.want_balance][c],if_max:[t.coll.gt("0"),t.want_balance.gt("0")][c]},setTokenSelected:function(){o(0<c?0:1),i(v)}})]}),Object(h.jsxs)("div",{className:n.button,children:[Object(h.jsx)(x.j,{name:"Approve",onClick:function(){return a("approve",r.want,r)},disabled:!r.ct.signer||t.want_allowance.gt("100000000000000000000000000000000")}),Object(h.jsx)(x.j,{name:"Burn",onClick:function(){return a("repay",l.input.want,l.input.coll,r)},disabled:g.eq(l.output.bond)||0===c&&Object(b.c)(l.I.coll).gt(t.coll)||1===c&&Object(b.c)(l.I.want,r.want.decimals).gt(t.want_balance)})]})]}),Object(h.jsx)("span",{className:n.icon_arrow,children:"navigate_next"}),Object(h.jsx)("div",{className:n.show,children:Object(h.jsxs)("div",{children:[Object(h.jsx)(m.default,{title:"bond",state:{state:l,token:r.bond}}),Object(h.jsx)(O.default,{token:r.coll.symbol,contract:r.coll.addr}),Object(h.jsx)(O.default,{token:r.call.symbol,contract:r.call.addr})]})})]})}},651:function(e,t,n){"use strict";n.d(t,"a",function(){return l}),n.d(t,"c",function(){return i}),n.d(t,"b",function(){return c});var a=n(17),l=function(e,t){return a.ethers.utils.formatUnits(e,t||18)},i=function(e,t){return a.ethers.utils.parseUnits(e||"0",t||18)},c=function(e){var t,n=1<arguments.length&&void 0!==arguments[1]?arguments[1]:3;switch(!0){case e<parseFloat("1e3"):t=parseFloat(e).toFixed(n);break;case e<parseFloat("1e6"):t=parseInt(e/1e3).toFixed(n)+" K";break;case e<parseFloat("1e9"):t=parseInt(e/1e6).toFixed(n)+" M";break;case e<parseFloat("1e12"):t=parseInt(e/1e6).toFixed(n)+" G";break;case e<parseFloat("1e15"):t=parseInt(e/1e6).toFixed(n)+" T";break;default:t=e}return t}}}]);