(window.webpackJsonp=window.webpackJsonp||[]).push([[22],{128:function(e,t,n){"use strict";n.d(t,"a",(function(){return b})),n.d(t,"b",(function(){return d}));var r=n(0),a=n.n(r);function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function l(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){i(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function c(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var u=a.a.createContext({}),s=function(e){var t=a.a.useContext(u),n=t;return e&&(n="function"==typeof e?e(t):l(l({},t),e)),n},b=function(e){var t=s(e.components);return a.a.createElement(u.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return a.a.createElement(a.a.Fragment,{},t)}},g=a.a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,i=e.originalType,o=e.parentName,u=c(e,["components","mdxType","originalType","parentName"]),b=s(n),g=r,d=b["".concat(o,".").concat(g)]||b[g]||p[g]||i;return n?a.a.createElement(d,l(l({ref:t},u),{},{components:n})):a.a.createElement(d,l({ref:t},u))}));function d(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var i=n.length,o=new Array(i);o[0]=g;var l={};for(var c in t)hasOwnProperty.call(t,c)&&(l[c]=t[c]);l.originalType=e,l.mdxType="string"==typeof e?e:r,o[1]=l;for(var u=2;u<i;u++)o[u]=n[u];return a.a.createElement.apply(null,o)}return a.a.createElement.apply(null,n)}g.displayName="MDXCreateElement"},97:function(e,t,n){"use strict";n.r(t),n.d(t,"frontMatter",(function(){return l})),n.d(t,"metadata",(function(){return c})),n.d(t,"toc",(function(){return u})),n.d(t,"default",(function(){return b}));var r=n(3),a=n(7),i=(n(0),n(128)),o=(n(39),["components"]),l={id:"debugging",title:"Debugging",sidebar_label:"Debugging"},c={unversionedId:"angle/debugging",id:"angle/debugging",isDocsHomePage:!1,title:"Debugging",description:"Typically you want to do most of your debugging in the",source:"@site/../docs/angle/debugging.md",slug:"/angle/debugging",permalink:"/docs/angle/debugging",version:"current",sidebar_label:"Debugging",sidebar:"someSidebar",previous:{title:"Advanced Query Features",permalink:"/docs/angle/advanced"},next:{title:"Angle Reference",permalink:"/docs/angle/reference"}},u=[{value:"Debugging a slow query",id:"debugging-a-slow-query",children:[]},{value:"Showing the internals",id:"showing-the-internals",children:[]}],s={toc:u};function b(e){var t=e.components,n=Object(a.a)(e,o);return Object(i.b)("wrapper",Object(r.a)({},s,n,{components:t,mdxType:"MDXLayout"}),Object(i.b)("p",null,"Typically you want to do most of your debugging in the\n",Object(i.b)("a",{parentName:"p",href:"../shell"},"shell"),", where you can experiment with queries quickly and\neasily."),Object(i.b)("p",null,"If you're writing particularly complex queries, then consider using ",Object(i.b)("a",{parentName:"p",href:"../derived"},"Derived Predicates")," to structure your query and to allow parts of the query to be re-used. To iterate on derived predicates, see ",Object(i.b)("a",{parentName:"p",href:"../derived/#how-do-i-write-and-test"},"How do I write and test a derived predicate?")),Object(i.b)("h2",{id:"debugging-a-slow-query"},"Debugging a slow query"),Object(i.b)("p",null,"Performance debugging can be tricky, because Angle is a very declarative language. There are often many ways to write the query that are correct, but not all of them will be fast."),Object(i.b)("p",null,"The shell provides a few facilities to help with this."),Object(i.b)("pre",null,Object(i.b)("code",{parentName:"pre"},"> :profile full\n")),Object(i.b)("p",null,"Turning on query profiling allows you to see how many facts of each predicate are being searched by your query. For example:"),Object(i.b)("pre",null,Object(i.b)("code",{parentName:"pre"},'fbsource> search.cxx.SearchByNameAndScope { name = "Future" }\n...\nFacts searched:\n                cxx1.RecordDeclaration.1 : 103\n             cxx1.TypeAliasDeclaration.2 : 11\n                            cxx1.QName.1 : 8\n              cxx1.VariableDeclaration.2 : 7\n                  cxx1.EnumDeclaration.1 : 7\n                             cxx1.Name.1 : 1\n')),Object(i.b)("p",null,"If your query is expensive, then likely you will see some large numbers next to one or more predicates. This is a sign that you probably want to reorder the statements in your query, or lift out some nested queries into statements so that you can control the ordering more precisely."),Object(i.b)("pre",null,Object(i.b)("code",{parentName:"pre"},"> :debug on\n")),Object(i.b)("h2",{id:"showing-the-internals"},"Showing the internals"),Object(i.b)("p",null,"The shell provides ways to show what Glean's query engine is doing internally. This is mostly useful for those working on the query engine itself, but it might also be helpful when debugging queries."),Object(i.b)("div",{className:"admonition admonition-warning alert alert--danger"},Object(i.b)("div",{parentName:"div",className:"admonition-heading"},Object(i.b)("h5",{parentName:"div"},Object(i.b)("span",{parentName:"h5",className:"admonition-icon"},Object(i.b)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"12",height:"16",viewBox:"0 0 12 16"},Object(i.b)("path",{parentName:"svg",fillRule:"evenodd",d:"M5.05.31c.81 2.17.41 3.38-.52 4.31C3.55 5.67 1.98 6.45.9 7.98c-1.45 2.05-1.7 6.53 3.53 7.7-2.2-1.16-2.67-4.52-.3-6.61-.61 2.03.53 3.33 1.94 2.86 1.39-.47 2.3.53 2.27 1.67-.02.78-.31 1.44-1.13 1.81 3.42-.59 4.78-3.42 4.78-5.56 0-2.84-2.53-3.22-1.25-5.61-1.52.13-2.03 1.13-1.89 2.75.09 1.08-1.02 1.8-1.86 1.33-.67-.41-.66-1.19-.06-1.78C8.18 5.31 8.68 2.45 5.05.32L5.03.3l.02.01z"}))),"warning")),Object(i.b)("div",{parentName:"div",className:"admonition-content"},Object(i.b)("p",{parentName:"div"},"We provide no guarantees about this functionality and it might change\nwithout warning."))),Object(i.b)("pre",null,Object(i.b)("code",{parentName:"pre",className:"language-lang=sh"},"> :debug ir\n")),Object(i.b)("p",null,"Shows the internal representation of the query after parsing, name resolution, type checking, and various transformations to simplify it.  In particular, all the nesting has been flattened at this stage, so you can see the exact order of the searches on each predicate, which might help with performance debugging."),Object(i.b)("pre",null,Object(i.b)("code",{parentName:"pre",className:"language-lang=sh"},"> :debug bytecode\n")),Object(i.b)("p",null,"Shows the compiled bytecode for the query. This is what Glean's virtual machine (VM) will execute to perform the query. Probably not all that useful for debugging queries."))}b.isMDXComponent=!0}}]);