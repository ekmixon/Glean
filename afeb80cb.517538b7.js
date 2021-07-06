(window.webpackJsonp=window.webpackJsonp||[]).push([[36],{111:function(e,t,n){"use strict";n.r(t),n.d(t,"frontMatter",(function(){return o})),n.d(t,"metadata",(function(){return s})),n.d(t,"toc",(function(){return b})),n.d(t,"default",(function(){return u}));var r=n(3),a=n(7),c=(n(0),n(129)),l=n(132),i=["components"],o={id:"workflow",title:"Workflow",sidebar_label:"Workflow"},s={unversionedId:"schema/workflow",id:"schema/workflow",isDocsHomePage:!1,title:"Workflow",description:"Where is the schema defined?",source:"@site/../docs/schema/workflow.md",slug:"/schema/workflow",permalink:"/docs/schema/workflow",version:"current",sidebar_label:"Workflow",sidebar:"someSidebar",previous:{title:"How do I change a schema?",permalink:"/docs/schema/changing"},next:{title:"Thrift and JSON",permalink:"/docs/schema/thrift"}},b=[{value:"Where is the schema defined?",id:"where-is-the-schema-defined",children:[]},{value:"Thrift types generated from the schema",id:"thrift-types-generated-from-the-schema",children:[]},{value:"Experimenting with schemas",id:"experimenting-with-schemas",children:[]}],p={toc:b};function u(e){var t=e.components,n=Object(a.a)(e,i);return Object(c.b)("wrapper",Object(r.a)({},p,n,{components:t,mdxType:"MDXLayout"}),Object(c.b)("h2",{id:"where-is-the-schema-defined"},"Where is the schema defined?"),Object(c.b)("ul",null,Object(c.b)("li",{parentName:"ul"},"Source code: ",Object(c.b)(l.b,{file:"glean/schema/source",mdxType:"SrcFile"}))),Object(c.b)("h2",{id:"thrift-types-generated-from-the-schema"},"Thrift types generated from the schema"),Object(c.b)("p",null,"The schema is compiled into Thrift files and language-specific support code, which can be used directly by clients for querying Glean. This means that you can query Glean using native types and data structures in whatever language you're using."),Object(c.b)("p",null,"The Thrift files are generated by"),Object(c.b)("pre",null,Object(c.b)("code",{parentName:"pre"},"make gen-schema\n")),Object(c.b)("p",null,"In the root of the Glean repository.  This puts files in\n",Object(c.b)("inlineCode",{parentName:"p"},"glean/schema/thrift"),", which are then processed into Haskell code by"),Object(c.b)("pre",null,Object(c.b)("code",{parentName:"pre"},"make thrift-schema-hs\n")),Object(c.b)("p",null,"and finally built by"),Object(c.b)("pre",null,Object(c.b)("code",{parentName:"pre"},"make glean\n")),Object(c.b)("p",null,"Examples of code using these types:"),Object(c.b)("ul",null,Object(c.b)("li",{parentName:"ul"},"Haskell: ",Object(c.b)(l.b,{file:"glean/client/hs/example/Example.hs",mdxType:"SrcFile"}))),Object(c.b)("h2",{id:"experimenting-with-schemas"},"Experimenting with schemas"),Object(c.b)("ol",null,Object(c.b)("li",{parentName:"ol"},Object(c.b)("p",{parentName:"li"},"Modify the source files in ",Object(c.b)(l.b,{file:"glean/schema/source",mdxType:"SrcFile"}))),Object(c.b)("li",{parentName:"ol"},Object(c.b)("p",{parentName:"li"},"Start up the shell locally using your schema:",Object(c.b)("br",null),"\n",Object(c.b)("inlineCode",{parentName:"p"},"glean-shell --db-root ~/local/gleandb --schema glean/schema/source"),Object(c.b)("br",null),"\nIf you don't already have a ",Object(c.b)("inlineCode",{parentName:"p"},"~/local/gleandb")," for storing local DBs, create it with ",Object(c.b)("inlineCode",{parentName:"p"},"mkdir ~/local/gleandb"),".")),Object(c.b)("li",{parentName:"ol"},Object(c.b)("p",{parentName:"li"},"Test it with some example data: see ",Object(c.b)("a",{parentName:"p",href:"../write#loading-a-db-from-json-in-the-shell"},"Loading a DB from JSON in the shell"),".")),Object(c.b)("li",{parentName:"ol"},Object(c.b)("p",{parentName:"li"},"Iterate as necessary, using ",Object(c.b)("inlineCode",{parentName:"p"},":reload")," in the shell to reload the schema."))))}u.isMDXComponent=!0},129:function(e,t,n){"use strict";n.d(t,"a",(function(){return p})),n.d(t,"b",(function(){return h}));var r=n(0),a=n.n(r);function c(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function l(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?l(Object(n),!0).forEach((function(t){c(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):l(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function o(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},c=Object.keys(e);for(r=0;r<c.length;r++)n=c[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var c=Object.getOwnPropertySymbols(e);for(r=0;r<c.length;r++)n=c[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var s=a.a.createContext({}),b=function(e){var t=a.a.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},p=function(e){var t=b(e.components);return a.a.createElement(s.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return a.a.createElement(a.a.Fragment,{},t)}},m=a.a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,c=e.originalType,l=e.parentName,s=o(e,["components","mdxType","originalType","parentName"]),p=b(n),m=r,h=p["".concat(l,".").concat(m)]||p[m]||u[m]||c;return n?a.a.createElement(h,i(i({ref:t},s),{},{components:n})):a.a.createElement(h,i({ref:t},s))}));function h(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var c=n.length,l=new Array(c);l[0]=m;var i={};for(var o in t)hasOwnProperty.call(t,o)&&(i[o]=t[o]);i.originalType=e,i.mdxType="string"==typeof e?e:r,l[1]=i;for(var s=2;s<c;s++)l[s]=n[s];return a.a.createElement.apply(null,l)}return a.a.createElement.apply(null,n)}m.displayName="MDXCreateElement"},132:function(e,t,n){"use strict";n.d(t,"b",(function(){return i})),n.d(t,"c",(function(){return o})),n.d(t,"a",(function(){return s}));var r=n(0),a=n.n(r),c=n(39);let l;function i(e){return a.a.createElement("a",{href:l+e.file},e.file)}function o(e){return a.a.createElement("a",{href:l+e.file},e.children)}l=Object(c.isInternal)()?"https://www.internalfb.com/code/fbsource/fbcode/":"https://github.com/facebookincubator/Glean/tree/master/";const s=({children:e,internal:t,external:n})=>Object(c.fbContent)({internal:a.a.createElement("code",null,t),external:a.a.createElement("code",null,n)})}}]);