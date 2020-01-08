(window.webpackJsonp=window.webpackJsonp||[]).push([[2],{108:function(e,t,n){"use strict";n.d(t,"a",(function(){return c})),n.d(t,"b",(function(){return m}));var a=n(0),i=n.n(a),r=i.a.createContext({}),o=function(e){var t=i.a.useContext(r),n=t;return e&&(n="function"==typeof e?e(t):Object.assign({},t,e)),n},c=function(e){var t=o(e.components);return i.a.createElement(r.Provider,{value:t},e.children)};var l="mdxType",s={inlineCode:"code",wrapper:function(e){var t=e.children;return i.a.createElement(i.a.Fragment,{},t)}},d=Object(a.forwardRef)((function(e,t){var n=e.components,a=e.mdxType,r=e.originalType,c=e.parentName,l=function(e,t){var n={};for(var a in e)Object.prototype.hasOwnProperty.call(e,a)&&-1===t.indexOf(a)&&(n[a]=e[a]);return n}(e,["components","mdxType","originalType","parentName"]),d=o(n),m=a,p=d[c+"."+m]||d[m]||s[m]||r;return n?i.a.createElement(p,Object.assign({},{ref:t},l,{components:n})):i.a.createElement(p,Object.assign({},{ref:t},l))}));function m(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var r=n.length,o=new Array(r);o[0]=d;var c={};for(var s in t)hasOwnProperty.call(t,s)&&(c[s]=t[s]);c.originalType=e,c[l]="string"==typeof e?e:a,o[1]=c;for(var m=2;m<r;m++)o[m]=n[m];return i.a.createElement.apply(null,o)}return i.a.createElement.apply(null,n)}d.displayName="MDXCreateElement"},88:function(e,t,n){"use strict";n.r(t),n.d(t,"frontMatter",(function(){return o})),n.d(t,"rightToc",(function(){return c})),n.d(t,"metadata",(function(){return l})),n.d(t,"default",(function(){return m}));var a=n(1),i=n(6),r=(n(0),n(108)),o={id:"overview",title:"Overview"},c=[],l={id:"architecture/overview",title:"Overview",description:"-   The `State` is the single source of truth for all information that may change over time, must be shared between different users and cannot be derived. It is constituted of:",source:"@site/docs/architecture/overview.md",permalink:"/allui/docs/architecture/overview",sidebar:"docs",previous:{title:"Installation",permalink:"/allui/docs/installation"},next:{title:"State",permalink:"/allui/docs/architecture/state"}},s={rightToc:c,metadata:l},d="wrapper";function m(e){var t=e.components,n=Object(i.a)(e,["components"]);return Object(r.b)(d,Object(a.a)({},s,n,{components:t,mdxType:"MDXLayout"}),Object(r.b)("ul",null,Object(r.b)("li",{parentName:"ul"},"The ",Object(r.b)("inlineCode",{parentName:"li"},"State")," is the single source of truth for all information that may change over time, must be shared between different users and cannot be derived. It is constituted of:",Object(r.b)("ul",{parentName:"li"},Object(r.b)("li",{parentName:"ul"},Object(r.b)("inlineCode",{parentName:"li"},"Data"),": the data itself. This is a tree where leafs are primitives (",Object(r.b)("inlineCode",{parentName:"li"},"string"),", ",Object(r.b)("inlineCode",{parentName:"li"},"number")," or ",Object(r.b)("inlineCode",{parentName:"li"},"boolean"),") and branches might be either a ",Object(r.b)("inlineCode",{parentName:"li"},"map")," (where children are retrieved by a string key) or a ",Object(r.b)("inlineCode",{parentName:"li"},"list")," (where children are stored as an ordered sequence)."),Object(r.b)("li",{parentName:"ul"},Object(r.b)("inlineCode",{parentName:"li"},"Meta"),": additional information attached to the data: all information needed by the final form which is not the data itself. This includes for example which node each user is currently focusing, and which nodes have been focused in the past (refereed as ",Object(r.b)("em",{parentName:"li"},"touched")," nodes)."))),Object(r.b)("li",{parentName:"ul"},"The ",Object(r.b)("inlineCode",{parentName:"li"},"reduce()")," takes an ",Object(r.b)("inlineCode",{parentName:"li"},"Action")," and the previous ",Object(r.b)("inlineCode",{parentName:"li"},"State")," as arguments and returns the next state. This is the one and only way to change application state: all modifications requests pass through this function. As all changes are centralized, this makes it easy to store them (for example to enables undo/redo actions) or to transmit them to other users."),Object(r.b)("li",{parentName:"ul"},"The ",Object(r.b)("inlineCode",{parentName:"li"},"Schema")," provides functions and information on how to compute derived information from ",Object(r.b)("inlineCode",{parentName:"li"},"Data\x1c"),". It is used for example to validate ",Object(r.b)("inlineCode",{parentName:"li"},"Data\x1c"),", deriving errors. It is also the schema that provides react components used to display each ",Object(r.b)("inlineCode",{parentName:"li"},"Data\x1c")," node."),Object(r.b)("li",{parentName:"ul"},Object(r.b)("inlineCode",{parentName:"li"},"UIComponents")," is a list of react components corresponding to common user interface elements (text input, checkbox, sliders, grid, titles, etc.). They might be used by schema generators to abstract user interface."),Object(r.b)("li",{parentName:"ul"},Object(r.b)("inlineCode",{parentName:"li"},"makeForm()\x1c")," is where all magic appends: the function is responsible for \u201cmerging\u201d all information provided by ",Object(r.b)("inlineCode",{parentName:"li"},"State\x1c")," and ",Object(r.b)("inlineCode",{parentName:"li"},"Schema"),", and to output the react components hierarchy (",Object(r.b)("inlineCode",{parentName:"li"},"Form"),").")),Object(r.b)("p",null,Object(r.b)("img",Object(a.a)({parentName:"p"},{src:"../../img/overview.svg",alt:null}))))}m.isMDXComponent=!0}}]);