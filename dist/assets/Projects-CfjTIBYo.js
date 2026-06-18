import{c as i,j as s,L as t,S as o}from"./index-Cl6I82ra.js";import{p as d}from"./content-BqBl4pJ1.js";import{A as m}from"./arrow-left-BorNtlx_.js";import{L as r,A as h}from"./layout-grid-DJtqyA-e.js";/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const p=i("Globe",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20",key:"13o1zl"}],["path",{d:"M2 12h20",key:"9i4pu4"}]]);/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const j=i("Terminal",[["polyline",{points:"4 17 10 11 4 5",key:"akl6gq"}],["line",{x1:"12",x2:"20",y1:"19",y2:"19",key:"q2wloq"}]]),x={"layout-grid":r,globe:p,terminal:j,sparkles:o};function y(){return s.jsxs("section",{className:"section",style:{paddingTop:"8rem"},children:[s.jsxs("div",{className:"section-header",children:[s.jsxs(t,{to:"/",className:"back-link",children:[s.jsx(m,{size:18}),s.jsx("span",{children:"返回主页"})]}),s.jsx("h2",{className:"section-title",children:"项目展示"}),s.jsx("p",{className:"section-desc",children:"精选开源项目与 Web 应用，涵盖组件库、3D 交互、终端工具与动效库。"})]}),s.jsx("div",{className:"projects-grid",children:d.map((e,l)=>{const n=x[e.icon]||r;return s.jsxs("div",{className:"project-card",children:[s.jsx("div",{className:"project-card__icon",children:s.jsx(n,{size:24})}),s.jsx("h3",{className:"project-card__name",children:e.name}),s.jsx("p",{className:"project-card__desc",children:e.description}),s.jsx("div",{className:"project-card__highlights",children:e.highlights.map((a,c)=>s.jsx("span",{className:"project-card__highlight",children:a},c))}),s.jsx("div",{className:"project-card__tags",children:e.tags.map((a,c)=>s.jsx("span",{className:"project-card__tag",children:a},c))}),s.jsxs("a",{href:e.link,className:"project-card__link",children:["查看项目 ",s.jsx(h,{size:14})]})]},l)})})]})}export{y as default};
