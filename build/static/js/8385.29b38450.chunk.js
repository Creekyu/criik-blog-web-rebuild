"use strict";(self.webpackChunkfront_end=self.webpackChunkfront_end||[]).push([[8385],{26460:function(t,e,n){n.r(e);var r=n(29439),s=n(72791),i=n(11087),o=n(48582),u=n(34535),a=n(41279),f=n(80047),l=n(44871),c=n(80184);e.default=function(){var t=(0,a.z)(),e=(0,i.lr)(),n=(0,r.Z)(e,1)[0],g=(0,l.CG)((function(t){return t.universal.starBlogPage})),p=(0,l.CG)((function(t){return t.blog.chosen})),d=n.get("filter")?n.get("filter"):p,b=parseInt(d),v=(0,s.useState)([]),h=(0,r.Z)(v,2),k=h[0],m=h[1],C=[{page:String(g),limit:"10",fields:"",sort:"",options:"isCollected=true"},{page:String(g),limit:"10",fields:"",sort:"-likes"},{page:String(g),limit:"10",fields:"",sort:"-views"}];return(0,s.useEffect)((function(){(0,u.VD)(C[b]).then((function(t){var e=t.data.blogs.map((function(t){var e=(0,f.BD)(t.contents);return Object.assign({},t,{contents:e})}));m(e)}),(function(e){t.error(e.message)}))}),[d,g]),(0,c.jsx)(o.Z,{blogs:k})}}}]);
//# sourceMappingURL=8385.29b38450.chunk.js.map