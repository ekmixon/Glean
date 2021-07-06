(window.webpackJsonp=window.webpackJsonp||[]).push([[23],{129:function(e,t,n){"use strict";n.d(t,"a",(function(){return p})),n.d(t,"b",(function(){return m}));var a=n(0),r=n.n(a);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function c(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function l(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?c(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):c(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function i(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},o=Object.keys(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var b=r.a.createContext({}),s=function(e){var t=r.a.useContext(b),n=t;return e&&(n="function"==typeof e?e(t):l(l({},t),e)),n},p=function(e){var t=s(e.components);return r.a.createElement(b.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return r.a.createElement(r.a.Fragment,{},t)}},d=r.a.forwardRef((function(e,t){var n=e.components,a=e.mdxType,o=e.originalType,c=e.parentName,b=i(e,["components","mdxType","originalType","parentName"]),p=s(n),d=a,m=p["".concat(c,".").concat(d)]||p[d]||u[d]||o;return n?r.a.createElement(m,l(l({ref:t},b),{},{components:n})):r.a.createElement(m,l({ref:t},b))}));function m(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=n.length,c=new Array(o);c[0]=d;var l={};for(var i in t)hasOwnProperty.call(t,i)&&(l[i]=t[i]);l.originalType=e,l.mdxType="string"==typeof e?e:a,c[1]=l;for(var b=2;b<o;b++)c[b]=n[b];return r.a.createElement.apply(null,c)}return r.a.createElement.apply(null,n)}d.displayName="MDXCreateElement"},132:function(e,t,n){"use strict";n.d(t,"b",(function(){return l})),n.d(t,"c",(function(){return i})),n.d(t,"a",(function(){return b}));var a=n(0),r=n.n(a),o=n(39);let c;function l(e){return r.a.createElement("a",{href:c+e.file},e.file)}function i(e){return r.a.createElement("a",{href:c+e.file},e.children)}c=Object(o.isInternal)()?"https://www.internalfb.com/code/fbsource/fbcode/":"https://github.com/facebookincubator/Glean/tree/master/";const b=({children:e,internal:t,external:n})=>Object(o.fbContent)({internal:r.a.createElement("code",null,t),external:r.a.createElement("code",null,n)})},99:function(e,t,n){"use strict";n.r(t),n.d(t,"frontMatter",(function(){return i})),n.d(t,"metadata",(function(){return b})),n.d(t,"toc",(function(){return s})),n.d(t,"default",(function(){return u}));var a=n(3),r=n(7),o=(n(0),n(129)),c=(n(39),n(132)),l=["components"],i={id:"trying",title:"Trying Glean",sidebar_label:"Trying Glean"},b={unversionedId:"trying",id:"trying",isDocsHomePage:!1,title:"Trying Glean",description:"We provide a Docker image containing a pre-built set of Glean binaries",source:"@site/../docs/trying.md",slug:"/trying",permalink:"/docs/trying",version:"current",sidebar_label:"Trying Glean",sidebar:"someSidebar",previous:{title:"Glean at Facebook",permalink:"/docs/fb/internal"},next:{title:"Building Glean from Source",permalink:"/docs/building"}},s=[{value:"Running the server",id:"running-the-server",children:[]},{value:"Hyperlink demo",id:"hyperlink-demo",children:[]}],p={toc:s};function u(e){var t=e.components,n=Object(r.a)(e,l);return Object(o.b)("wrapper",Object(a.a)({},p,n,{components:t,mdxType:"MDXLayout"}),Object(o.b)("p",null,"We provide a Docker image containing a pre-built set of Glean binaries\nthat you can try out.  These images are built automatically by a\n",Object(o.b)("a",{parentName:"p",href:"https://github.com/facebookincubator/Glean/blob/master/.github/workflows/glean-docker.yml"},"Github Action"),"."),Object(o.b)("p",null,"Pull the latest demo Docker image (warning, this is around 7GB):"),Object(o.b)("pre",null,Object(o.b)("code",{parentName:"pre"},"docker pull ghcr.io/facebookincubator/glean/demo:latest\n")),Object(o.b)("p",null,"Run it:"),Object(o.b)("pre",null,Object(o.b)("code",{parentName:"pre"},"docker run -it -p 8888:8888 ghcr.io/facebookincubator/glean/demo:latest\n")),Object(o.b)("div",{className:"admonition admonition-info alert alert--info"},Object(o.b)("div",{parentName:"div",className:"admonition-heading"},Object(o.b)("h5",{parentName:"div"},Object(o.b)("span",{parentName:"h5",className:"admonition-icon"},Object(o.b)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"},Object(o.b)("path",{parentName:"svg",fillRule:"evenodd",d:"M7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 0 1 1.3 8c0-3.14 2.56-5.7 5.7-5.7zM7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm1 3H6v5h2V4zm0 6H6v2h2v-2z"}))),"info")),Object(o.b)("div",{parentName:"div",className:"admonition-content"},Object(o.b)("p",{parentName:"div"},"What's in the image?"),Object(o.b)("ul",{parentName:"div"},Object(o.b)("li",{parentName:"ul"},"A build of Glean, in ",Object(o.b)("inlineCode",{parentName:"li"},"/glean-code")),Object(o.b)("li",{parentName:"ul"},"The ",Object(o.b)("a",{parentName:"li",href:"https://github.com/facebook/flow/"},"flow")," binary, in ",Object(o.b)("inlineCode",{parentName:"li"},"/usr/local/bin/flow")),Object(o.b)("li",{parentName:"ul"},"A checkout of ",Object(o.b)("a",{parentName:"li",href:"https://github.com/facebook/react/"},"react")," in ",Object(o.b)("inlineCode",{parentName:"li"},"/react-code")),Object(o.b)("li",{parentName:"ul"},"A Glean database containing the Flow index of React in ",Object(o.b)("inlineCode",{parentName:"li"},"/gleandb"))))),Object(o.b)("p",null,"Start the Glean ",Object(o.b)("a",{parentName:"p",href:"shell"},"shell"),":"),Object(o.b)("pre",null,Object(o.b)("code",{parentName:"pre"},"glean-shell --db-root /gleandb --schema /glean-code/glean/schema/source\n")),Object(o.b)("p",null,"You should see:"),Object(o.b)("pre",null,Object(o.b)("code",{parentName:"pre"},"Glean Shell, built on <time>, from rev <unknown>\ntype :help for help.\n>\n")),Object(o.b)("p",null,"The demo image contains a pre-generated database containing the\nresults of running the Flow indexer on the React repository:"),Object(o.b)("pre",null,Object(o.b)("code",{parentName:"pre"},"> :list\nreact/0 (complete)\n  Created: 2021-05-24T02:42:33Z (30 days, 9 hours ago)\n")),Object(o.b)("p",null,"We can look at the contents:"),Object(o.b)("pre",null,Object(o.b)("code",{parentName:"pre"},"react> :db react\nusing database react/0\nreact> :stat\nflow.Declaration.3\n  count: 26756\n  size:  888756 (867.93 kB) 4.8248%\n...\nTotal size: 17.57 MB\n")),Object(o.b)("h2",{id:"running-the-server"},"Running the server"),Object(o.b)("p",null,"Above we showed the shell reading the database from the filesystem\ndirectly. Instead we can run a server that the clients will interact\nwith to make queries:"),Object(o.b)("pre",null,Object(o.b)("code",{parentName:"pre"},"glean-server --db-root /gleandb --schema /glean-code/glean/schema/source --port 12345\n")),Object(o.b)("p",null,"And now the shell can connect to the server:"),Object(o.b)("pre",null,Object(o.b)("code",{parentName:"pre"},"glean-shell --service localhost:12345\n")),Object(o.b)("p",null,"The commands work exactly the same as with local databases, but now it\nwould also work over the network."),Object(o.b)("h2",{id:"hyperlink-demo"},"Hyperlink demo"),Object(o.b)("p",null,"We have a small demo showing how Glean can enable code navigation. The ",Object(o.b)(c.c,{file:"glean/demo/Hyperlink.hs",mdxType:"SrcFileLink"},"glean-hyperlink")," tool\ncreates a webserver that serves hyperlinked source code using data\nfrom a specified Glean database."),Object(o.b)("p",null,"We can navigate the React source code as follows. First start the\nGlean server:"),Object(o.b)("pre",null,Object(o.b)("code",{parentName:"pre"},"glean-server --db-root /gleandb --schema /glean-code/glean/schema/source --port 12345\n")),Object(o.b)("p",null,"Next start the Hyperlink server:"),Object(o.b)("pre",null,Object(o.b)("code",{parentName:"pre"},"glean-hyperlink --service localhost:12345 --repo react --root /react-code --http 8888\n")),Object(o.b)("p",null,"Now navigate to ",Object(o.b)("inlineCode",{parentName:"p"},"http://localhost:8888")," in your browser, and you\nshould see a list of source files. Click on a file, and navigate\naround the code by clicking on a symbol reference to jump to its\ndefinition.  Try something substantial like\n",Object(o.b)("inlineCode",{parentName:"p"},"react-dom/src/client/ReactDOMComponent.js"),"\n(",Object(o.b)("a",{parentName:"p",href:"http://localhost:8888/packages/react-dom/src/client/ReactDOMComponent.js"},"http://localhost:8888/packages/react-dom/src/client/ReactDOMComponent.js"),") -\nnote how Glean is accurately linking both local and imported\nsymbols."))}u.isMDXComponent=!0}}]);