(window.webpackJsonp=window.webpackJsonp||[]).push([[42],{117:function(e,n,r){"use strict";r.r(n),r.d(n,"frontMatter",(function(){return l})),r.d(n,"metadata",(function(){return p})),r.d(n,"toc",(function(){return s})),r.d(n,"default",(function(){return d}));var t,o=r(3),a=r(7),i=(r(0),r(129)),c=["components"],l={id:"server",title:"Running the Glean Server",sidebar_label:"Running the Glean Server"},p={unversionedId:"server",id:"server",isDocsHomePage:!1,title:"Running the Glean Server",description:"Typically the Glean server is invoked as:",source:"@site/../docs/server.md",slug:"/server",permalink:"/docs/server",version:"current",sidebar_label:"Running the Glean Server",sidebar:"someSidebar",previous:{title:"Using the Shell",permalink:"/docs/shell"},next:{title:"The Glean CLI tool",permalink:"/docs/cli"}},s=[],u=(t="Facebook",function(e){return console.warn("Component "+t+" was not imported, exported, or provided by MDXProvider as global scope"),Object(i.b)("div",e)}),b={toc:s};function d(e){var n=e.components,r=Object(a.a)(e,c);return Object(i.b)("wrapper",Object(o.a)({},b,r,{components:n,mdxType:"MDXLayout"}),Object(i.b)("p",null,"Typically the Glean server is invoked as:"),Object(i.b)("pre",null,Object(i.b)("code",{parentName:"pre"},"glean-server --db-root <dir> --schema <schema> --port <port>\n")),Object(i.b)("p",null,"Where ",Object(i.b)("inlineCode",{parentName:"p"},"<dir>")," is where your Glean databases are stored, ",Object(i.b)("inlineCode",{parentName:"p"},"<port>")," is\nthe port number, and ",Object(i.b)("inlineCode",{parentName:"p"},"<schema>")," is the directory containing the schema\nsources."),Object(i.b)("p",null,"The Glean server accepts all the common options described in ",Object(i.b)("a",{parentName:"p",href:"running#common-options"},"Common options"),", and additionally:"),Object(i.b)("ul",null,Object(i.b)("li",{parentName:"ul"},Object(i.b)("inlineCode",{parentName:"li"},"--port PORT"),Object(i.b)("br",null),"\nPort number to listen on.")),Object(i.b)("p",null,"The server watches for changes in any ",Object(i.b)("a",{parentName:"p",href:"running#configuration-files"},"configuration\nfiles")," specified with ",Object(i.b)("inlineCode",{parentName:"p"},"config:PATH"),",\nincluding the schema."),Object(i.b)(u,{mdxType:"Facebook"}))}d.isMDXComponent=!0},129:function(e,n,r){"use strict";r.d(n,"a",(function(){return u})),r.d(n,"b",(function(){return m}));var t=r(0),o=r.n(t);function a(e,n,r){return n in e?Object.defineProperty(e,n,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[n]=r,e}function i(e,n){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var t=Object.getOwnPropertySymbols(e);n&&(t=t.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),r.push.apply(r,t)}return r}function c(e){for(var n=1;n<arguments.length;n++){var r=null!=arguments[n]?arguments[n]:{};n%2?i(Object(r),!0).forEach((function(n){a(e,n,r[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):i(Object(r)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(r,n))}))}return e}function l(e,n){if(null==e)return{};var r,t,o=function(e,n){if(null==e)return{};var r,t,o={},a=Object.keys(e);for(t=0;t<a.length;t++)r=a[t],n.indexOf(r)>=0||(o[r]=e[r]);return o}(e,n);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(t=0;t<a.length;t++)r=a[t],n.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(o[r]=e[r])}return o}var p=o.a.createContext({}),s=function(e){var n=o.a.useContext(p),r=n;return e&&(r="function"==typeof e?e(n):c(c({},n),e)),r},u=function(e){var n=s(e.components);return o.a.createElement(p.Provider,{value:n},e.children)},b={inlineCode:"code",wrapper:function(e){var n=e.children;return o.a.createElement(o.a.Fragment,{},n)}},d=o.a.forwardRef((function(e,n){var r=e.components,t=e.mdxType,a=e.originalType,i=e.parentName,p=l(e,["components","mdxType","originalType","parentName"]),u=s(r),d=t,m=u["".concat(i,".").concat(d)]||u[d]||b[d]||a;return r?o.a.createElement(m,c(c({ref:n},p),{},{components:r})):o.a.createElement(m,c({ref:n},p))}));function m(e,n){var r=arguments,t=n&&n.mdxType;if("string"==typeof e||t){var a=r.length,i=new Array(a);i[0]=d;var c={};for(var l in n)hasOwnProperty.call(n,l)&&(c[l]=n[l]);c.originalType=e,c.mdxType="string"==typeof e?e:t,i[1]=c;for(var p=2;p<a;p++)i[p]=r[p];return o.a.createElement.apply(null,i)}return o.a.createElement.apply(null,r)}d.displayName="MDXCreateElement"}}]);