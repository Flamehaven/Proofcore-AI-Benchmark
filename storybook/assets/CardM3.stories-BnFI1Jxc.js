import{a as t,j as e}from"./emotion-react-jsx-runtime.browser.esm-DUalPLDp.js";import{c as n}from"./emotion-styled-base.browser.esm-eB_B6Qx9.js";import"./jsx-runtime-CZm_iTvF.js";import"./iframe-DQvuGjGf.js";import"./preload-helper-C1FmrZbK.js";const L=n("div",{target:"etudy5g4"})("border-radius:12px;padding:16px;background-color:white;border:1px solid rgba(0, 0, 0, 0.12);",r=>r.elevated&&`
    box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2),
      0 2px 2px 0 rgba(0, 0, 0, 0.14),
      0 1px 5px 0 rgba(0, 0, 0, 0.12);
    border: none;
  `," transition:all 0.2s;",r=>r.clickable&&"cursor: pointer;"," &:hover{",r=>r.elevated&&`
      box-shadow: 0 5px 5px -3px rgba(0, 0, 0, 0.2),
        0 8px 10px 1px rgba(0, 0, 0, 0.14),
        0 3px 14px 2px rgba(0, 0, 0, 0.12);
    `," ",r=>r.clickable&&"background-color: rgba(0, 0, 0, 0.02);",";}"),N=n("div",{target:"etudy5g3"})({name:"1fhoxft",styles:"display:flex;justify-content:space-between;align-items:center;margin-bottom:12px"}),Y=n("h3",{target:"etudy5g2"})({name:"10evito",styles:"margin:0;font-size:16px;font-weight:500"}),H=n("div",{target:"etudy5g1"})({name:"18eciam",styles:"font-size:14px;line-height:1.5;color:rgba(0, 0, 0, 0.87)"}),O=n("button",{target:"etudy5g0"})({name:"dblxye",styles:"padding:8px 16px;background:none;border:none;color:#1976D2;cursor:pointer;font-weight:500;font-size:13px;transition:opacity 0.2s;&:hover{opacity:0.8;}&:active{opacity:0.6;}"}),a=({title:r,children:B,action:h,elevated:I=!1,onClick:u})=>t(L,{elevated:I,clickable:!!u,onClick:u,children:[r&&e(N,{children:e(Y,{children:r})}),e(H,{children:B}),h&&e(O,{onClick:h.onClick,style:{marginTop:"12px"},children:h.label})]});a.__docgenInfo={description:"",methods:[],displayName:"CardM3",props:{title:{required:!1,tsType:{name:"string"},description:""},children:{required:!0,tsType:{name:"ReactNode"},description:""},action:{required:!1,tsType:{name:"signature",type:"object",raw:`{
  label: string;
  onClick: () => void;
}`,signature:{properties:[{key:"label",value:{name:"string",required:!0}},{key:"onClick",value:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}},required:!0}}]}},description:""},elevated:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},onClick:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""}}};const X={title:"M3/Card",component:a,parameters:{layout:"centered"},args:{children:"Card content goes here"}},i={args:{title:"Proof Result",children:"Your proof has been successfully verified with a score of 92/100."}},o={args:{title:"Verification Details",children:"This proof demonstrates strong logical structure and mathematical soundness.",action:{label:"View Full Report",onClick:()=>alert("Showing full report...")}}},s={args:{elevated:!0,title:"Featured Proof",children:"This is a recently verified proof that scored exceptionally high in all categories.",action:{label:"Explore",onClick:()=>alert("Exploring...")}}},l={args:{title:"Proof #42",children:"Click this card to view details",onClick:()=>alert("Card clicked!")}},c={args:{children:"This card has no title. It can be used for simple information display or as a container for other components."}},d={args:{title:"Verification Statistics",children:t("div",{children:[t("p",{children:[e("strong",{children:"Total Proofs:"})," 1,245"]}),t("p",{children:[e("strong",{children:"Verified:"})," 1,102 (88%)"]}),t("p",{children:[e("strong",{children:"Pending:"})," 143 (12%)"]})]})}},p={render:()=>t("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"16px",maxWidth:"600px"},children:[e(a,{title:"Card 1",children:"First card content"}),e(a,{title:"Card 2",elevated:!0,children:"Second card (elevated)"}),e(a,{title:"Card 3",children:"Third card with action",action:{label:"Action",onClick:()=>alert("Clicked!")}}),e(a,{title:"Card 4",children:"Fourth card"})]})},g={args:{title:"Proof Analysis",children:t("div",{children:[e("p",{children:"This proof demonstrates the Pythagorean theorem through geometric construction. The analysis reveals:"}),t("ul",{children:[e("li",{children:"Strong logical progression"}),e("li",{children:"Correct mathematical notation"}),e("li",{children:"Valid proof techniques"}),e("li",{children:"Clear reasoning steps"})]})]}),action:{label:"Download",onClick:()=>alert("Downloading...")}}};var m,f,C;i.parameters={...i.parameters,docs:{...(m=i.parameters)==null?void 0:m.docs,source:{originalSource:`{
  args: {
    title: 'Proof Result',
    children: 'Your proof has been successfully verified with a score of 92/100.'
  }
}`,...(C=(f=i.parameters)==null?void 0:f.docs)==null?void 0:C.source}}};var x,y,b;o.parameters={...o.parameters,docs:{...(x=o.parameters)==null?void 0:x.docs,source:{originalSource:`{
  args: {
    title: 'Verification Details',
    children: 'This proof demonstrates strong logical structure and mathematical soundness.',
    action: {
      label: 'View Full Report',
      onClick: () => alert('Showing full report...')
    }
  }
}`,...(b=(y=o.parameters)==null?void 0:y.docs)==null?void 0:b.source}}};var v,k,T;s.parameters={...s.parameters,docs:{...(v=s.parameters)==null?void 0:v.docs,source:{originalSource:`{
  args: {
    elevated: true,
    title: 'Featured Proof',
    children: 'This is a recently verified proof that scored exceptionally high in all categories.',
    action: {
      label: 'Explore',
      onClick: () => alert('Exploring...')
    }
  }
}`,...(T=(k=s.parameters)==null?void 0:k.docs)==null?void 0:T.source}}};var w,S,P;l.parameters={...l.parameters,docs:{...(w=l.parameters)==null?void 0:w.docs,source:{originalSource:`{
  args: {
    title: 'Proof #42',
    children: 'Click this card to view details',
    onClick: () => alert('Card clicked!')
  }
}`,...(P=(S=l.parameters)==null?void 0:S.docs)==null?void 0:P.source}}};var V,q,M;c.parameters={...c.parameters,docs:{...(V=c.parameters)==null?void 0:V.docs,source:{originalSource:`{
  args: {
    children: 'This card has no title. It can be used for simple information display or as a container for other components.'
  }
}`,...(M=(q=c.parameters)==null?void 0:q.docs)==null?void 0:M.source}}};var F,A,D;d.parameters={...d.parameters,docs:{...(F=d.parameters)==null?void 0:F.docs,source:{originalSource:`{
  args: {
    title: 'Verification Statistics',
    children: <div>
        <p>
          <strong>Total Proofs:</strong> 1,245
        </p>
        <p>
          <strong>Verified:</strong> 1,102 (88%)
        </p>
        <p>
          <strong>Pending:</strong> 143 (12%)
        </p>
      </div>
  }
}`,...(D=(A=d.parameters)==null?void 0:A.docs)==null?void 0:D.source}}};var E,W,j;p.parameters={...p.parameters,docs:{...(E=p.parameters)==null?void 0:E.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
    maxWidth: '600px'
  }}>
      <CardM3 title="Card 1" children="First card content" />
      <CardM3 title="Card 2" elevated children="Second card (elevated)" />
      <CardM3 title="Card 3" children="Third card with action" action={{
      label: 'Action',
      onClick: () => alert('Clicked!')
    }} />
      <CardM3 title="Card 4" children="Fourth card" />
    </div>
}`,...(j=(W=p.parameters)==null?void 0:W.docs)==null?void 0:j.source}}};var R,_,z;g.parameters={...g.parameters,docs:{...(R=g.parameters)==null?void 0:R.docs,source:{originalSource:`{
  args: {
    title: 'Proof Analysis',
    children: <div>
        <p>
          This proof demonstrates the Pythagorean theorem through geometric
          construction. The analysis reveals:
        </p>
        <ul>
          <li>Strong logical progression</li>
          <li>Correct mathematical notation</li>
          <li>Valid proof techniques</li>
          <li>Clear reasoning steps</li>
        </ul>
      </div>,
    action: {
      label: 'Download',
      onClick: () => alert('Downloading...')
    }
  }
}`,...(z=(_=g.parameters)==null?void 0:_.docs)==null?void 0:z.source}}};const Z=["Basic","WithAction","Elevated","Clickable","WithoutTitle","Statistics","MultipleCards","LongContent"];export{i as Basic,l as Clickable,s as Elevated,g as LongContent,p as MultipleCards,d as Statistics,o as WithAction,c as WithoutTitle,Z as __namedExportsOrder,X as default};
