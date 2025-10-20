import{a as b,j as a}from"./emotion-react-jsx-runtime.browser.esm-DUalPLDp.js";import{r as l}from"./iframe-DQvuGjGf.js";import{c as o}from"./emotion-styled-base.browser.esm-eB_B6Qx9.js";import"./jsx-runtime-CZm_iTvF.js";import"./preload-helper-C1FmrZbK.js";const J=o("div",{target:"eb1vadb5"})({name:"yjqaou",styles:"display:flex;flex-direction:column;gap:4px;width:100%"}),K=o("label",{target:"eb1vadb4"})("font-size:",e=>e.active?"12px":"14px",";color:",e=>e.error?"#D32F2F":e.active?"#1976D2":"rgba(0, 0, 0, 0.6)",";transition:all 0.2s;font-weight:500;"),Q=o("div",{target:"eb1vadb3"})("position:relative;border-bottom:2px solid ",e=>e.error?"#D32F2F":e.focused?"#1976D2":"rgba(0, 0, 0, 0.12)",";transition:border-color 0.2s;padding-bottom:8px;"),U=o("input",{target:"eb1vadb2"})({name:"12e4pus",styles:"width:100%;border:none;outline:none;background:transparent;font-size:14px;padding:8px 0;font-family:inherit;&::placeholder{color:transparent;}&:disabled{color:rgba(0, 0, 0, 0.38);cursor:not-allowed;}"}),X=o("textarea",{target:"eb1vadb1"})({name:"1iliw02",styles:"width:100%;border:none;outline:none;background:transparent;font-size:14px;padding:8px 0;font-family:inherit;resize:vertical;min-height:80px;&::placeholder{color:transparent;}&:disabled{color:rgba(0, 0, 0, 0.38);cursor:not-allowed;}"}),Y=o("div",{target:"eb1vadb0"})({name:"1ll81py",styles:"font-size:12px;color:#D32F2F;margin-top:4px"}),t=({value:e,onChange:r,label:A,error:s,required:L,placeholder:h,type:O="text",disabled:x=!1,multiline:G=!1,rows:H=4})=>{const[f,n]=l.useState(!1);return b(J,{children:[b(K,{active:f||!!e||!!h,error:s,children:[A,L&&" *"]}),a(Q,{error:s,focused:f,children:G?a(X,{value:e,onChange:g=>r(g.target.value),onFocus:()=>n(!0),onBlur:()=>n(!1),placeholder:h,disabled:x,rows:H,"aria-invalid":!!s}):a(U,{type:O,value:e,onChange:g=>r(g.target.value),onFocus:()=>n(!0),onBlur:()=>n(!1),placeholder:h,disabled:x,"aria-invalid":!!s})}),s&&a(Y,{children:s})]})};t.__docgenInfo={description:"",methods:[],displayName:"TextFieldM3",props:{value:{required:!0,tsType:{name:"string"},description:""},onChange:{required:!0,tsType:{name:"signature",type:"function",raw:"(value: string) => void",signature:{arguments:[{type:{name:"string"},name:"value"}],return:{name:"void"}}},description:""},label:{required:!0,tsType:{name:"string"},description:""},error:{required:!1,tsType:{name:"string"},description:""},required:{required:!1,tsType:{name:"boolean"},description:""},placeholder:{required:!1,tsType:{name:"string"},description:""},type:{required:!1,tsType:{name:"union",raw:"'text' | 'email' | 'password' | 'number' | 'textarea'",elements:[{name:"literal",value:"'text'"},{name:"literal",value:"'email'"},{name:"literal",value:"'password'"},{name:"literal",value:"'number'"},{name:"literal",value:"'textarea'"}]},description:"",defaultValue:{value:"'text'",computed:!1}},disabled:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},multiline:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},rows:{required:!1,tsType:{name:"number"},description:"",defaultValue:{value:"4",computed:!1}}}};const te={title:"M3/TextField",component:t,parameters:{layout:"centered"},args:{label:"Input Field",value:"",onChange:()=>{}}},i={render:()=>{const[e,r]=l.useState("");return a("div",{style:{width:"300px"},children:a(t,{label:"Proof Name",value:e,onChange:r,placeholder:"Enter proof name"})})}},d={render:()=>{const[e,r]=l.useState("");return a("div",{style:{width:"300px"},children:a(t,{label:"Proof Statement",value:e,onChange:r,error:"Please enter a valid mathematical statement",placeholder:"e.g., x + 2 = 5"})})}},u={render:()=>{const[e,r]=l.useState("");return a("div",{style:{width:"300px"},children:a(t,{label:"Email",type:"email",value:e,onChange:r,required:!0,placeholder:"your@email.com"})})}},c={render:()=>a("div",{style:{width:"300px"},children:a(t,{label:"Verification Result",value:"Score: 92/100",onChange:()=>{},disabled:!0})})},p={render:()=>{const[e,r]=l.useState("");return a("div",{style:{width:"300px"},children:a(t,{label:"Password",type:"password",value:e,onChange:r,required:!0,placeholder:"Enter your password"})})}},m={render:()=>{const[e,r]=l.useState("");return a("div",{style:{width:"400px"},children:a(t,{label:"Proof Statement",value:e,onChange:r,multiline:!0,rows:5,placeholder:"Enter your mathematical proof here..."})})}},v={render:()=>{const[e,r]=l.useState("x + 2 = 5");return a("div",{style:{width:"300px"},children:a(t,{label:"Mathematical Expression",value:e,onChange:r})})}};var y,w,S;i.parameters={...i.parameters,docs:{...(y=i.parameters)==null?void 0:y.docs,source:{originalSource:`{
  render: () => {
    const [value, setValue] = useState('');
    return <div style={{
      width: '300px'
    }}>
        <TextFieldM3 label="Proof Name" value={value} onChange={setValue} placeholder="Enter proof name" />
      </div>;
  }
}`,...(S=(w=i.parameters)==null?void 0:w.docs)==null?void 0:S.source}}};var V,T,F;d.parameters={...d.parameters,docs:{...(V=d.parameters)==null?void 0:V.docs,source:{originalSource:`{
  render: () => {
    const [value, setValue] = useState('');
    return <div style={{
      width: '300px'
    }}>
        <TextFieldM3 label="Proof Statement" value={value} onChange={setValue} error="Please enter a valid mathematical statement" placeholder="e.g., x + 2 = 5" />
      </div>;
  }
}`,...(F=(T=d.parameters)==null?void 0:T.docs)==null?void 0:F.source}}};var C,q,E;u.parameters={...u.parameters,docs:{...(C=u.parameters)==null?void 0:C.docs,source:{originalSource:`{
  render: () => {
    const [value, setValue] = useState('');
    return <div style={{
      width: '300px'
    }}>
        <TextFieldM3 label="Email" type="email" value={value} onChange={setValue} required placeholder="your@email.com" />
      </div>;
  }
}`,...(E=(q=u.parameters)==null?void 0:q.docs)==null?void 0:E.source}}};var M,P,D;c.parameters={...c.parameters,docs:{...(M=c.parameters)==null?void 0:M.docs,source:{originalSource:`{
  render: () => {
    return <div style={{
      width: '300px'
    }}>
        <TextFieldM3 label="Verification Result" value="Score: 92/100" onChange={() => {}} disabled />
      </div>;
  }
}`,...(D=(P=c.parameters)==null?void 0:P.docs)==null?void 0:D.source}}};var z,j,B;p.parameters={...p.parameters,docs:{...(z=p.parameters)==null?void 0:z.docs,source:{originalSource:`{
  render: () => {
    const [value, setValue] = useState('');
    return <div style={{
      width: '300px'
    }}>
        <TextFieldM3 label="Password" type="password" value={value} onChange={setValue} required placeholder="Enter your password" />
      </div>;
  }
}`,...(B=(j=p.parameters)==null?void 0:j.docs)==null?void 0:B.source}}};var I,R,W;m.parameters={...m.parameters,docs:{...(I=m.parameters)==null?void 0:I.docs,source:{originalSource:`{
  render: () => {
    const [value, setValue] = useState('');
    return <div style={{
      width: '400px'
    }}>
        <TextFieldM3 label="Proof Statement" value={value} onChange={setValue} multiline rows={5} placeholder="Enter your mathematical proof here..." />
      </div>;
  }
}`,...(W=(R=m.parameters)==null?void 0:R.docs)==null?void 0:W.source}}};var _,N,k;v.parameters={...v.parameters,docs:{...(_=v.parameters)==null?void 0:_.docs,source:{originalSource:`{
  render: () => {
    const [value, setValue] = useState('x + 2 = 5');
    return <div style={{
      width: '300px'
    }}>
        <TextFieldM3 label="Mathematical Expression" value={value} onChange={setValue} />
      </div>;
  }
}`,...(k=(N=v.parameters)==null?void 0:N.docs)==null?void 0:k.source}}};const le=["Basic","WithError","Required","Disabled","Password","Multiline","WithValue"];export{i as Basic,c as Disabled,m as Multiline,p as Password,u as Required,d as WithError,v as WithValue,le as __namedExportsOrder,te as default};
