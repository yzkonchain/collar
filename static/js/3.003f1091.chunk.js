(this.webpackJsonprebuild=this.webpackJsonprebuild||[]).push([[3],{294:function(t,e,n){"use strict";n.r(e),n.d(e,"default",function(){return c});var e=n(3),p=n.n(e),j=n(6),b=n(11),x=n(13),a=n(18),h=n(0),f=n(7),w=n(17),O=n(1),m=a.ethers.constants.Zero,v={input:{want:m},output:{coll:m},tip:{fee:"0.0000",min:"0.000",slip:"0.00"},I:{want:""},old:{want:""}},g=function(t,e){return a.ethers.utils.formatUnits(t,e||18)},y=function(t,e){return a.ethers.utils.parseUnits(t||"0",e||18)};function c(){var t=Object(h.useContext)(f.d).state,e=t.signer,c=t.controller,n=Object(h.useContext)(f.e),t=n.liteState,a=(t.bond,t.want),i=t.coll,s=t.pool,r=t.data,l=n.classesChild,o=n.handleClick;v.tip.apy=r.apy.toPrecision(3);var n=Object(h.useReducer)(function(t,e){return Object(b.a)(Object(b.a)({},t),e)},v),n=Object(x.a)(n,2),u=n[0],d=n[1];return Object(h.useEffect)(function(){return u==v||d(v)},[s]),Object(h.useEffect)(function(){Object(j.a)(p.a.mark(function t(){var e,n,a;return p.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:if((e=y(u.I.want,s.want.decimals)).eq(u.input.want)){t.next=6;break}return t.next=4,s.ct.get_dx(e).catch(function(){return u.I.want.length>u.old.want.length&&u.I.want.length<g(u.input.want).length&&c.notify("balance","insufficient"),!1});case 4:(n=t.sent)&&(a={fee:(g(n)*(1-g(r.swap.fee))).toFixed(4),min:(.995*g(n)).toFixed(3),slip:c.calc_slip(r,[null,e],s).toPrecision(3),apy:r.apy.toPrecision(3)},d({input:{want:e},output:{coll:n},tip:a}));case 6:case"end":return t.stop()}},t)}))()},[u]),Object(h.useMemo)(function(){return Object(O.jsxs)("div",{className:l.root,children:[Object(O.jsxs)("div",{className:l.amount,children:[Object(O.jsx)("div",{children:Object(O.jsx)(w.a,{title:"want",State:{state:u,setState:d,token:a,max:r.balance.want,if_max:r.allowance.want.gt("100000000000000000000000000000000")},style:{height:"90px"}})}),Object(O.jsx)("span",{className:l.icon,children:"navigate_next"}),Object(O.jsx)("div",{children:Object(O.jsx)(w.c,{title:"coll",state:{state:u,token:i},style:{height:"90px"}})})]}),Object(O.jsx)(w.d,{apy:u.tip.apy,info:Object(O.jsxs)("div",{children:[Object(O.jsxs)("div",{children:["Slippage tolerance: ",u.tip.slip," %"]}),Object(O.jsxs)("div",{children:["Minimum recieved: ",u.tip.min," COLL"]}),Object(O.jsxs)("div",{style:{display:"flex",alignItems:"center"},children:[Object(O.jsx)("span",{style:{marginRight:"5px"},children:"Route:"}),Object(O.jsx)("span",{children:a.symbol}),Object(O.jsx)("span",{className:"material-icons",children:"keyboard_double_arrow_right"}),Object(O.jsx)("span",{children:i.symbol})]}),Object(O.jsxs)("div",{children:["Nominal swap fee: ",u.tip.fee," COLL"]})]})}),Object(O.jsx)("div",{className:l.buttonOne,children:Object(O.jsxs)("div",{children:[Object(O.jsx)(w.j,{name:"Approve",onClick:function(){return o("approve")(a)},disabled:!e||r.allowance.want.gt("100000000000000000000000000000000")}),Object(O.jsx)(w.j,{name:"Lend",onClick:Object(j.a)(p.a.mark(function t(){return p.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,o("lend")(u.input.want,u.output.coll);case 2:if(t.t0=t.sent,!t.t0){t.next=5;break}t.t0=d({I:{want:""}});case 5:return t.abrupt("return",t.t0);case 6:case"end":return t.stop()}},t)})),disabled:m.eq(u.output.coll)||y(u.I.want,s.want.decimals).gt(r.balance.want)||!y(u.I.want,s.want.decimals).eq(u.input.want)})]})})]})},[u,r])}}}]);