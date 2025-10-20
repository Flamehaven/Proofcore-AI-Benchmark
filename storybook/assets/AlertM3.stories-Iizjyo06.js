import{a as u,j as s}from"./emotion-react-jsx-runtime.browser.esm-DUalPLDp.js";import{c as r}from"./emotion-styled-base.browser.esm-eB_B6Qx9.js";import"./jsx-runtime-CZm_iTvF.js";import"./iframe-DQvuGjGf.js";import"./preload-helper-C1FmrZbK.js";const q=r("div",{target:"erhs9x75"})("display:flex;gap:16px;padding:16px;border-radius:4px;background-color:",e=>({error:"#FFE5E5",warning:"#FFF3E0",info:"#E3F2FD",success:"#E8F5E9"})[e.severity],";border-left:4px solid ",e=>({error:"#D32F2F",warning:"#F57C00",info:"#1976D2",success:"#388E3C"})[e.severity],";"),T=r("div",{target:"erhs9x74"})({name:"12in2p3",styles:"display:flex;align-items:center;justify-content:center;width:24px;height:24px;flex-shrink:0;font-size:18px"}),L=r("div",{target:"erhs9x73"})({name:"ssn0ku",styles:"flex:1;display:flex;flex-direction:column;gap:4px"}),M=r("div",{target:"erhs9x72"})({name:"tteyob",styles:"font-weight:500;font-size:14px"}),R=r("div",{target:"erhs9x71"})({name:"1nmn0y",styles:"font-size:13px;opacity:0.87"}),W=r("button",{target:"erhs9x70"})({name:"dblxye",styles:"padding:8px 16px;background:none;border:none;color:#1976D2;cursor:pointer;font-weight:500;font-size:13px;transition:opacity 0.2s;&:hover{opacity:0.8;}&:active{opacity:0.6;}"}),I=({severity:e,title:l,message:V,action:d,onClose:j})=>u(q,{severity:e,role:"alert",children:[s(T,{children:{error:"✕",warning:"⚠",info:"ℹ",success:"✓"}[e]}),u(L,{children:[s(M,{children:l}),s(R,{children:V})]}),d&&s(W,{onClick:d.onClick,children:d.label})]});I.__docgenInfo={description:"",methods:[],displayName:"AlertM3",props:{severity:{required:!0,tsType:{name:"union",raw:"'error' | 'warning' | 'info' | 'success'",elements:[{name:"literal",value:"'error'"},{name:"literal",value:"'warning'"},{name:"literal",value:"'info'"},{name:"literal",value:"'success'"}]},description:""},title:{required:!0,tsType:{name:"string"},description:""},message:{required:!0,tsType:{name:"string"},description:""},action:{required:!1,tsType:{name:"signature",type:"object",raw:`{
  label: string;
  onClick: () => void;
}`,signature:{properties:[{key:"label",value:{name:"string",required:!0}},{key:"onClick",value:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}},required:!0}}]}},description:""},onClose:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""}}};const H={title:"M3/Alert",component:I,parameters:{layout:"centered"},args:{title:"Default Alert",message:"This is a default alert message",severity:"info"}},n={args:{severity:"error",title:"Verification Failed",message:"Proof contains logical inconsistencies or invalid expressions",action:{label:"View Details",onClick:()=>alert("Details clicked")}}},t={args:{severity:"warning",title:"Low Confidence",message:"Proof verified with only 45% confidence. Review recommended.",action:{label:"Learn More",onClick:()=>alert("Learn more clicked")}}},i={args:{severity:"info",title:"Information",message:"Proof is currently being processed by the verification engine"}},o={args:{severity:"success",title:"Verified Successfully",message:"Proof passed all verification checks with 92% confidence",action:{label:"View Result",onClick:()=>alert("Result viewed")}}},a={args:{severity:"error",title:"Network Error",message:"Failed to connect to verification service. Please try again."}},c={args:{severity:"success",title:"Completed",message:"Your proof has been successfully submitted and verified"}};var m,p,g;n.parameters={...n.parameters,docs:{...(m=n.parameters)==null?void 0:m.docs,source:{originalSource:`{
  args: {
    severity: 'error',
    title: 'Verification Failed',
    message: 'Proof contains logical inconsistencies or invalid expressions',
    action: {
      label: 'View Details',
      onClick: () => alert('Details clicked')
    }
  }
}`,...(g=(p=n.parameters)==null?void 0:p.docs)==null?void 0:g.source}}};var f,y,v;t.parameters={...t.parameters,docs:{...(f=t.parameters)==null?void 0:f.docs,source:{originalSource:`{
  args: {
    severity: 'warning',
    title: 'Low Confidence',
    message: 'Proof verified with only 45% confidence. Review recommended.',
    action: {
      label: 'Learn More',
      onClick: () => alert('Learn more clicked')
    }
  }
}`,...(v=(y=t.parameters)==null?void 0:y.docs)==null?void 0:v.source}}};var h,x,w;i.parameters={...i.parameters,docs:{...(h=i.parameters)==null?void 0:h.docs,source:{originalSource:`{
  args: {
    severity: 'info',
    title: 'Information',
    message: 'Proof is currently being processed by the verification engine'
  }
}`,...(w=(x=i.parameters)==null?void 0:x.docs)==null?void 0:w.source}}};var b,k,C;o.parameters={...o.parameters,docs:{...(b=o.parameters)==null?void 0:b.docs,source:{originalSource:`{
  args: {
    severity: 'success',
    title: 'Verified Successfully',
    message: 'Proof passed all verification checks with 92% confidence',
    action: {
      label: 'View Result',
      onClick: () => alert('Result viewed')
    }
  }
}`,...(C=(k=o.parameters)==null?void 0:k.docs)==null?void 0:C.source}}};var F,E,S;a.parameters={...a.parameters,docs:{...(F=a.parameters)==null?void 0:F.docs,source:{originalSource:`{
  args: {
    severity: 'error',
    title: 'Network Error',
    message: 'Failed to connect to verification service. Please try again.'
  }
}`,...(S=(E=a.parameters)==null?void 0:E.docs)==null?void 0:S.source}}};var A,P,D;c.parameters={...c.parameters,docs:{...(A=c.parameters)==null?void 0:A.docs,source:{originalSource:`{
  args: {
    severity: 'success',
    title: 'Completed',
    message: 'Your proof has been successfully submitted and verified'
  }
}`,...(D=(P=c.parameters)==null?void 0:P.docs)==null?void 0:D.source}}};const J=["Error","Warning","Info","Success","ErrorWithoutAction","SuccessWithoutAction"];export{n as Error,a as ErrorWithoutAction,i as Info,o as Success,c as SuccessWithoutAction,t as Warning,J as __namedExportsOrder,H as default};
