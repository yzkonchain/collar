(this.webpackJsonprebuild=this.webpackJsonprebuild||[]).push([[11],{312:function(e,t,n){"use strict";n.r(t),n.d(t,"default",function(){return c});var t=n(3),p=n.n(t),j=n(7),x=n(10),m=n(11),a=n(17),h=n(0),O=n(6),f=n(18),w=n(1),y=a.ethers.constants.Zero,v={input:{want:y,coll:y},output:{bond:y},tip:{fee:"0.0000",min:"0.000",slip:"0.00"},I:{want:"",coll:""},old:{want:"",coll:""}},g=function(e,t){return a.ethers.utils.formatUnits(e,t||18)},k=function(e,t){return a.ethers.utils.parseUnits(e||"0",t||18)};function c(){var e=Object(h.useContext)(O.e).state,t=e.signer,l=e.controller,n=Object(h.useContext)(O.f),e=n.liteState,a=e.bond,c=e.want,s=e.coll,i=e.pool,o=e.data,r=n.classesChild,b=n.handleClick;v.tip.apy=o.apy.toPrecision(3);var n=Object(h.useReducer)(function(e,t){return Object(x.a)(Object(x.a)({},e),t)},v),n=Object(m.a)(n,2),u=n[0],d=n[1];return Object(h.useEffect)(function(){return u==v||d(v)},[i]),Object(h.useEffect)(function(){Object(j.a)(p.a.mark(function e(){var t,n,a,c;return p.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:t=k(u.I.want,i.want.decimals),n=k(u.I.coll),t.eq(u.input.want)&&n.eq(u.input.coll)||(a=t.add(n),c={fee:(g(t,i.want.decimals)*(1-g(o.swap.fee))).toFixed(4),min:(.995*g(a,i.bond.decimals)).toFixed(3),slip:l.calc_slip(o,[a,null],i).toPrecision(3),apy:o.apy.toPrecision(3)},d({input:{want:t,coll:n},output:{bond:a},tip:c}));case 3:case"end":return e.stop()}},e)}))()},[u]),Object(h.useMemo)(function(){return Object(w.jsxs)("div",{className:r.root,children:[Object(w.jsxs)("div",{className:r.amount,children:[Object(w.jsx)("div",{children:Object(w.jsx)(f.b,{title:["want","coll"],State:{state:u,setState:d,token:[c,s],max:[o.balance.want.lt(o.balance.call.sub(u.input.coll))?o.balance.want:o.balance.call.sub(u.input.coll),o.balance.coll.lt(o.balance.call.sub(u.input.want))?o.balance.coll:o.balance.call.sub(u.input.want)],if_max:[o.allowance.want.gt("100000000000000000000000000000000")&&u.output.bond.lt(o.balance.call),o.balance.coll.gt("0")&&u.output.bond.lt(o.balance.call)]},style:{height:"90px"}})}),Object(w.jsx)("span",{className:r.icon,children:"navigate_next"}),Object(w.jsx)("div",{children:Object(w.jsx)(f.c,{title:"bond",state:{state:u,token:a},style:{height:"90px"}})})]}),Object(w.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"},children:[Object(w.jsxs)("div",{style:{margin:"10px 0",fontFamily:"Helvetica",fontSize:"12px"},children:["Maximum debt = ",g(o.balance.call)," ",i.call.symbol]}),Object(w.jsx)(f.d,{apy:u.tip.apy,info:Object(w.jsxs)("div",{children:[Object(w.jsxs)("div",{children:["Slippage tolerance: ",u.tip.slip," %"]}),Object(w.jsxs)("div",{children:["Minimum recieved: ",u.tip.min," ",a.symbol]}),Object(w.jsxs)("div",{style:{display:"flex",alignItems:"center"},children:[Object(w.jsx)("span",{style:{marginRight:"5px"},children:"Route:"}),Object(w.jsx)("span",{children:s.symbol}),Object(w.jsx)("span",{className:"material-icons",children:"keyboard_double_arrow_right"}),Object(w.jsx)("span",{children:a.symbol}),Object(w.jsx)("span",{style:{margin:"0 5px"},children:"/"}),Object(w.jsx)("span",{children:c.symbol}),Object(w.jsx)("span",{className:"material-icons",children:"keyboard_double_arrow_right"}),Object(w.jsx)("span",{children:a.symbol})]}),Object(w.jsxs)("div",{children:["Nominal swap fee: ",u.tip.fee," ",c.symbol]})]})})]}),Object(w.jsx)("div",{className:r.buttonOne,children:Object(w.jsxs)("div",{children:[Object(w.jsx)(f.j,{name:"Approve",onClick:function(){return b("approve")(c)},disabled:!t||o.allowance.want.gt("100000000000000000000000000000000")}),Object(w.jsx)(f.j,{name:"Repay",onClick:Object(j.a)(p.a.mark(function e(){return p.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,b("repay")(u.input.want,u.input.coll);case 2:if(e.t0=e.sent,!e.t0){e.next=5;break}e.t0=d({I:{want:"",coll:""}});case 5:return e.abrupt("return",e.t0);case 6:case"end":return e.stop()}},e)})),disabled:y.eq(u.output.bond)||u.output.bond.gt(o.balance.call)||k(u.I.want,i.want.decimals).gt(o.balance.want)||k(u.I.coll).gt(o.balance.coll)})]})})]})},[u,o])}}}]);