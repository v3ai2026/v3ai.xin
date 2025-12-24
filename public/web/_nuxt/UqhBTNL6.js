function f(o,n){return Object.keys(o).forEach(s=>{const c=s,e=n[c];e!==void 0&&(typeof e=="object"&&e!==null?Object.keys(e).length>0&&(o[c]=e):o[c]=e)}),o}export{f as u};
