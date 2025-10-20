import{j as t,a as Z}from"./emotion-react-jsx-runtime.browser.esm-DUalPLDp.js";import{c as ne}from"./emotion-styled-base.browser.esm-eB_B6Qx9.js";import"./jsx-runtime-CZm_iTvF.js";import"./iframe-DQvuGjGf.js";import"./preload-helper-C1FmrZbK.js";const oe=e=>{const r=`
    border: none;
    cursor: pointer;
    font-weight: 500;
    border-radius: 4px;
    transition: all 0.2s;
    font-family: inherit;
  `;return{filled:`
      ${r}
      background-color: #1976D2;
      color: white;
      &:hover:not(:disabled) {
        background-color: #1565C0;
      }
      &:active:not(:disabled) {
        background-color: #0D47A1;
      }
    `,outlined:`
      ${r}
      background-color: transparent;
      color: #1976D2;
      border: 1px solid #1976D2;
      &:hover:not(:disabled) {
        background-color: rgba(25, 118, 210, 0.04);
      }
      &:active:not(:disabled) {
        background-color: rgba(25, 118, 210, 0.08);
      }
    `,text:`
      ${r}
      background-color: transparent;
      color: #1976D2;
      &:hover:not(:disabled) {
        background-color: rgba(25, 118, 210, 0.08);
      }
      &:active:not(:disabled) {
        background-color: rgba(25, 118, 210, 0.12);
      }
    `,elevated:`
      ${r}
      background-color: #F5F5F5;
      color: #1976D2;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      &:hover:not(:disabled) {
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
      }
      &:active:not(:disabled) {
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
      }
    `,tonal:`
      ${r}
      background-color: #E3F2FD;
      color: #1565C0;
      &:hover:not(:disabled) {
        background-color: #BBDEFB;
      }
      &:active:not(:disabled) {
        background-color: #90CAF9;
      }
    `}[e]},le=e=>({small:"padding: 6px 12px; font-size: 12px;",medium:"padding: 8px 24px; font-size: 14px;",large:"padding: 12px 32px; font-size: 16px;"})[e],se=ne("button",{target:"e1y3ten20"})(e=>oe(e.variant)," ",e=>le(e.size)," width:",e=>e.fullWidth?"100%":"auto",";&:disabled{opacity:0.38;cursor:not-allowed;}"),a=({children:e,variant:r="filled",size:f="medium",disabled:ee=!1,onClick:ae,fullWidth:re=!1,type:te="button"})=>t(se,{variant:r,size:f,disabled:ee,onClick:ae,fullWidth:re,type:te,children:e});a.__docgenInfo={description:"",methods:[],displayName:"ButtonM3",props:{children:{required:!0,tsType:{name:"ReactNode"},description:""},variant:{required:!1,tsType:{name:"union",raw:"'filled' | 'outlined' | 'text' | 'elevated' | 'tonal'",elements:[{name:"literal",value:"'filled'"},{name:"literal",value:"'outlined'"},{name:"literal",value:"'text'"},{name:"literal",value:"'elevated'"},{name:"literal",value:"'tonal'"}]},description:"",defaultValue:{value:"'filled'",computed:!1}},size:{required:!1,tsType:{name:"union",raw:"'small' | 'medium' | 'large'",elements:[{name:"literal",value:"'small'"},{name:"literal",value:"'medium'"},{name:"literal",value:"'large'"}]},description:"",defaultValue:{value:"'medium'",computed:!1}},disabled:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},onClick:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""},fullWidth:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},type:{required:!1,tsType:{name:"union",raw:"'button' | 'submit' | 'reset'",elements:[{name:"literal",value:"'button'"},{name:"literal",value:"'submit'"},{name:"literal",value:"'reset'"}]},description:"",defaultValue:{value:"'button'",computed:!1}}}};const pe={title:"M3/Button",component:a,parameters:{layout:"centered"},args:{children:"Click me",onClick:()=>alert("Button clicked!")}},n={args:{variant:"filled",children:"Verify Proof"}},o={args:{variant:"outlined",children:"Cancel"}},l={args:{variant:"text",children:"Learn More"}},s={args:{variant:"elevated",children:"Submit"}},i={args:{variant:"tonal",children:"Secondary Action"}},d={args:{size:"small",children:"Small"}},c={args:{size:"medium",children:"Medium"}},u={args:{size:"large",children:"Large"}},m={args:{disabled:!0,children:"Disabled"}},p={args:{fullWidth:!0,children:"Full Width Button"}},g={render:()=>Z("div",{style:{display:"flex",gap:"8px"},children:[t(a,{variant:"outlined",children:"Cancel"}),t(a,{variant:"filled",children:"Verify"})]})},v={render:()=>Z("div",{style:{display:"flex",flexDirection:"column",gap:"12px"},children:[t(a,{variant:"filled",children:"Filled"}),t(a,{variant:"outlined",children:"Outlined"}),t(a,{variant:"text",children:"Text"}),t(a,{variant:"elevated",children:"Elevated"}),t(a,{variant:"tonal",children:"Tonal"})]})};var b,h,x;n.parameters={...n.parameters,docs:{...(b=n.parameters)==null?void 0:b.docs,source:{originalSource:`{
  args: {
    variant: 'filled',
    children: 'Verify Proof'
  }
}`,...(x=(h=n.parameters)==null?void 0:h.docs)==null?void 0:x.source}}};var y,S,B;o.parameters={...o.parameters,docs:{...(y=o.parameters)==null?void 0:y.docs,source:{originalSource:`{
  args: {
    variant: 'outlined',
    children: 'Cancel'
  }
}`,...(B=(S=o.parameters)==null?void 0:S.docs)==null?void 0:B.source}}};var M,k,F;l.parameters={...l.parameters,docs:{...(M=l.parameters)==null?void 0:M.docs,source:{originalSource:`{
  args: {
    variant: 'text',
    children: 'Learn More'
  }
}`,...(F=(k=l.parameters)==null?void 0:k.docs)==null?void 0:F.source}}};var T,z,D;s.parameters={...s.parameters,docs:{...(T=s.parameters)==null?void 0:T.docs,source:{originalSource:`{
  args: {
    variant: 'elevated',
    children: 'Submit'
  }
}`,...(D=(z=s.parameters)==null?void 0:z.docs)==null?void 0:D.source}}};var V,w,C;i.parameters={...i.parameters,docs:{...(V=i.parameters)==null?void 0:V.docs,source:{originalSource:`{
  args: {
    variant: 'tonal',
    children: 'Secondary Action'
  }
}`,...(C=(w=i.parameters)==null?void 0:w.docs)==null?void 0:C.source}}};var W,q,E;d.parameters={...d.parameters,docs:{...(W=d.parameters)==null?void 0:W.docs,source:{originalSource:`{
  args: {
    size: 'small',
    children: 'Small'
  }
}`,...(E=(q=d.parameters)==null?void 0:q.docs)==null?void 0:E.source}}};var A,L,O;c.parameters={...c.parameters,docs:{...(A=c.parameters)==null?void 0:A.docs,source:{originalSource:`{
  args: {
    size: 'medium',
    children: 'Medium'
  }
}`,...(O=(L=c.parameters)==null?void 0:L.docs)==null?void 0:O.source}}};var $,_,j;u.parameters={...u.parameters,docs:{...($=u.parameters)==null?void 0:$.docs,source:{originalSource:`{
  args: {
    size: 'large',
    children: 'Large'
  }
}`,...(j=(_=u.parameters)==null?void 0:_.docs)==null?void 0:j.source}}};var G,N,P;m.parameters={...m.parameters,docs:{...(G=m.parameters)==null?void 0:G.docs,source:{originalSource:`{
  args: {
    disabled: true,
    children: 'Disabled'
  }
}`,...(P=(N=m.parameters)==null?void 0:N.docs)==null?void 0:P.source}}};var I,R,H;p.parameters={...p.parameters,docs:{...(I=p.parameters)==null?void 0:I.docs,source:{originalSource:`{
  args: {
    fullWidth: true,
    children: 'Full Width Button'
  }
}`,...(H=(R=p.parameters)==null?void 0:R.docs)==null?void 0:H.source}}};var J,K,Q;g.parameters={...g.parameters,docs:{...(J=g.parameters)==null?void 0:J.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    gap: '8px'
  }}>
      <ButtonM3 variant="outlined">Cancel</ButtonM3>
      <ButtonM3 variant="filled">Verify</ButtonM3>
    </div>
}`,...(Q=(K=g.parameters)==null?void 0:K.docs)==null?void 0:Q.source}}};var U,X,Y;v.parameters={...v.parameters,docs:{...(U=v.parameters)==null?void 0:U.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  }}>
      <ButtonM3 variant="filled">Filled</ButtonM3>
      <ButtonM3 variant="outlined">Outlined</ButtonM3>
      <ButtonM3 variant="text">Text</ButtonM3>
      <ButtonM3 variant="elevated">Elevated</ButtonM3>
      <ButtonM3 variant="tonal">Tonal</ButtonM3>
    </div>
}`,...(Y=(X=v.parameters)==null?void 0:X.docs)==null?void 0:Y.source}}};const ge=["Filled","Outlined","Text","Elevated","Tonal","Small","Medium","Large","Disabled","FullWidth","Group","AllVariants"];export{v as AllVariants,m as Disabled,s as Elevated,n as Filled,p as FullWidth,g as Group,u as Large,c as Medium,o as Outlined,d as Small,l as Text,i as Tonal,ge as __namedExportsOrder,pe as default};
