"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[5917],{3905:function(e,n,t){t.r(n),t.d(n,{MDXContext:function(){return s},MDXProvider:function(){return p},mdx:function(){return f},useMDXComponents:function(){return l},withMDXComponents:function(){return m}});var a=t(67294);function r(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function i(){return(i=Object.assign||function(e){for(var n=1;n<arguments.length;n++){var t=arguments[n];for(var a in t)Object.prototype.hasOwnProperty.call(t,a)&&(e[a]=t[a])}return e}).apply(this,arguments)}function o(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);n&&(a=a.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,a)}return t}function d(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?o(Object(t),!0).forEach((function(n){r(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):o(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function c(e,n){if(null==e)return{};var t,a,r=function(e,n){if(null==e)return{};var t,a,r={},i=Object.keys(e);for(a=0;a<i.length;a++)t=i[a],n.indexOf(t)>=0||(r[t]=e[t]);return r}(e,n);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(a=0;a<i.length;a++)t=i[a],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(r[t]=e[t])}return r}var s=a.createContext({}),m=function(e){return function(n){var t=l(n.components);return a.createElement(e,i({},n,{components:t}))}},l=function(e){var n=a.useContext(s),t=n;return e&&(t="function"==typeof e?e(n):d(d({},n),e)),t},p=function(e){var n=l(e.components);return a.createElement(s.Provider,{value:n},e.children)},u={inlineCode:"code",wrapper:function(e){var n=e.children;return a.createElement(a.Fragment,{},n)}},h=a.forwardRef((function(e,n){var t=e.components,r=e.mdxType,i=e.originalType,o=e.parentName,s=c(e,["components","mdxType","originalType","parentName"]),m=l(t),p=r,h=m["".concat(o,".").concat(p)]||m[p]||u[p]||i;return t?a.createElement(h,d(d({ref:n},s),{},{components:t})):a.createElement(h,d({ref:n},s))}));function f(e,n){var t=arguments,r=n&&n.mdxType;if("string"==typeof e||r){var i=t.length,o=new Array(i);o[0]=h;var d={};for(var c in n)hasOwnProperty.call(n,c)&&(d[c]=n[c]);d.originalType=e,d.mdxType="string"==typeof e?e:r,o[1]=d;for(var s=2;s<i;s++)o[s]=t[s];return a.createElement.apply(null,o)}return a.createElement.apply(null,t)}h.displayName="MDXCreateElement"},52867:function(e,n,t){t.r(n),t.d(n,{frontMatter:function(){return d},contentTitle:function(){return c},metadata:function(){return s},toc:function(){return m},default:function(){return p}});var a=t(87462),r=t(63366),i=(t(67294),t(3905)),o=["components"],d={id:"changing",title:"How do I change a schema?",sidebar_label:"Changing a schema"},c=void 0,s={unversionedId:"schema/changing",id:"schema/changing",isDocsHomePage:!1,title:"How do I change a schema?",description:"Predicates are never modified. We can only make new versions of a",source:"@site/docs/schema/changing.md",sourceDirName:"schema",slug:"/schema/changing",permalink:"/docs/schema/changing",editUrl:"https://github.com/facebookincubator/Glean/tree/main/glean/website/docs/schema/changing.md",version:"current",frontMatter:{id:"changing",title:"How do I change a schema?",sidebar_label:"Changing a schema"},sidebar:"someSidebar",previous:{title:"Recursion",permalink:"/docs/schema/recursion"},next:{title:"Workflow",permalink:"/docs/schema/workflow"}},m=[{value:"Adding new predicates",id:"adding-new-predicates",children:[]},{value:"Deleting predicates",id:"deleting-predicates",children:[]}],l={toc:m};function p(e){var n=e.components,t=(0,r.Z)(e,o);return(0,i.mdx)("wrapper",(0,a.Z)({},l,t,{components:n,mdxType:"MDXLayout"}),(0,i.mdx)("div",{className:"admonition admonition-important alert alert--info"},(0,i.mdx)("div",{parentName:"div",className:"admonition-heading"},(0,i.mdx)("h5",{parentName:"div"},(0,i.mdx)("span",{parentName:"h5",className:"admonition-icon"},(0,i.mdx)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"},(0,i.mdx)("path",{parentName:"svg",fillRule:"evenodd",d:"M7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 0 1 1.3 8c0-3.14 2.56-5.7 5.7-5.7zM7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm1 3H6v5h2V4zm0 6H6v2h2v-2z"}))),"important")),(0,i.mdx)("div",{parentName:"div",className:"admonition-content"},(0,i.mdx)("p",{parentName:"div"},"Predicates are never modified. We can only make new versions of a\npredicate, or delete an old version of a predicate when we no longer\nneed to read or write data using it."))),(0,i.mdx)("p",null,"You can only add new predicates or new versions of predicates, and\ndelete old ones. This is to ensure compatibilty between different\nversions of clients and databases: adding new predicates to the schema\ndoesn't break existing clients or indexers."),(0,i.mdx)("p",null,"To be specific, ",(0,i.mdx)("em",{parentName:"p"},"modifying")," a predicate means changing its type in any way. To modify a predicate you need to:"),(0,i.mdx)("ul",null,(0,i.mdx)("li",{parentName:"ul"},"Add a new version of the predicate, creating a new schema version at the same time if necessary.",(0,i.mdx)("ul",{parentName:"li"},(0,i.mdx)("li",{parentName:"ul"},"This may entail adding new versions of other predicates too, because predicates that depended on the old version of the predicate must now be copied so that they can point to the new predicate you created."))),(0,i.mdx)("li",{parentName:"ul"},"Update and recompile clients and indexers as necessary to use your new version. Most of the time we don't use explicit versions in client code, so usually updating a client is just a recompile after the schema update.")),(0,i.mdx)("p",null,"Changing the schema can present a tricky migration problem: there are indexers generating the data, clients reading the data, and existing databases that can contain either the old schema or the new schema. Glean provides features to make smooth migration possible, see ",(0,i.mdx)("a",{parentName:"p",href:"/docs/derived#derived-predicates-for-schema-migration"},"Derived Predicates for Schema Migration")),(0,i.mdx)("div",{className:"admonition admonition-note alert alert--secondary"},(0,i.mdx)("div",{parentName:"div",className:"admonition-heading"},(0,i.mdx)("h5",{parentName:"div"},(0,i.mdx)("span",{parentName:"h5",className:"admonition-icon"},(0,i.mdx)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"},(0,i.mdx)("path",{parentName:"svg",fillRule:"evenodd",d:"M6.3 5.69a.942.942 0 0 1-.28-.7c0-.28.09-.52.28-.7.19-.18.42-.28.7-.28.28 0 .52.09.7.28.18.19.28.42.28.7 0 .28-.09.52-.28.7a1 1 0 0 1-.7.3c-.28 0-.52-.11-.7-.3zM8 7.99c-.02-.25-.11-.48-.31-.69-.2-.19-.42-.3-.69-.31H6c-.27.02-.48.13-.69.31-.2.2-.3.44-.31.69h1v3c.02.27.11.5.31.69.2.2.42.31.69.31h1c.27 0 .48-.11.69-.31.2-.19.3-.42.31-.69H8V7.98v.01zM7 2.3c-3.14 0-5.7 2.54-5.7 5.68 0 3.14 2.56 5.7 5.7 5.7s5.7-2.55 5.7-5.7c0-3.15-2.56-5.69-5.7-5.69v.01zM7 .98c3.86 0 7 3.14 7 7s-3.14 7-7 7-7-3.12-7-7 3.14-7 7-7z"}))),"note")),(0,i.mdx)("div",{parentName:"div",className:"admonition-content"},(0,i.mdx)("p",{parentName:"div"},"if you're just changing the derivation of a derived predicate, there's no need to create a new predicate version. The new derivation will take effect, for both old and new databases, as soon as the schema change is deployed."))),(0,i.mdx)("h3",{id:"adding-new-predicates"},"Adding new predicates"),(0,i.mdx)("p",null,"If you're just adding new predicates or types, then you don't need to add a new schema version."),(0,i.mdx)("h3",{id:"deleting-predicates"},"Deleting predicates"),(0,i.mdx)("p",null,"In most cases it's safe to delete predicates from the schema, provided you have no existing client code using them."))}p.isMDXComponent=!0}}]);