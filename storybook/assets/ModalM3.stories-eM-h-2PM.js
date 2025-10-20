import{j as e,a as t,F as d}from"./emotion-react-jsx-runtime.browser.esm-DUalPLDp.js";import{c as n}from"./emotion-styled-base.browser.esm-eB_B6Qx9.js";import{r as u}from"./iframe-DQvuGjGf.js";import"./jsx-runtime-CZm_iTvF.js";import"./preload-helper-C1FmrZbK.js";const B=n("div",{target:"e1fv9zby6"})("position:fixed;top:0;left:0;width:100%;height:100%;background-color:rgba(0, 0, 0, 0.32);display:",r=>r.open?"flex":"none",";align-items:center;justify-content:center;z-index:1000;opacity:",r=>r.open?1:0,";transition:opacity 0.2s;"),E=n("div",{target:"e1fv9zby5"})({name:"1kyv0nn",styles:"background:white;border-radius:4px;box-shadow:0 3px 1px -2px rgba(0, 0, 0, 0.2),0 2px 2px 0 rgba(0, 0, 0, 0.14),0 1px 5px 0 rgba(0, 0, 0, 0.12);max-width:560px;width:90%;max-height:90vh;display:flex;flex-direction:column;animation:slideUp 0.3s ease-out;@keyframes slideUp{from{transform:translateY(20px);opacity:0;}to{transform:translateY(0);opacity:1;}}"}),A=n("div",{target:"e1fv9zby4"})({name:"xuk8mr",styles:"padding:24px;border-bottom:1px solid rgba(0, 0, 0, 0.12)"}),T=n("h2",{target:"e1fv9zby3"})({name:"11tsd6h",styles:"margin:0;font-size:20px;font-weight:500"}),V=n("div",{target:"e1fv9zby2"})({name:"1nhqexb",styles:"padding:24px;flex:1;overflow-y:auto"}),F=n("div",{target:"e1fv9zby1"})({name:"g5byu5",styles:"display:flex;justify-content:flex-end;gap:8px;padding:16px 24px;border-top:1px solid rgba(0, 0, 0, 0.12)"}),N=n("button",{target:"e1fv9zby0"})("padding:8px 24px;border-radius:4px;border:none;cursor:pointer;font-weight:500;font-size:14px;transition:all 0.2s;",r=>r.variant==="primary"?`
    background-color: #1976D2;
    color: white;
    &:hover {
      background-color: #1565C0;
    }
    &:active {
      background-color: #0D47A1;
    }
  `:`
    background-color: transparent;
    color: #1976D2;
    &:hover {
      background-color: rgba(25, 118, 210, 0.04);
    }
    &:active {
      background-color: rgba(25, 118, 210, 0.08);
    }
  `,";"),a=({open:r,onClose:o,title:D,children:w,actions:P})=>e(B,{open:r,onClick:o,children:t(E,{onClick:i=>i.stopPropagation(),children:[e(A,{children:e(T,{children:D})}),e(V,{children:w}),e(F,{children:P.map((i,z)=>e(N,{variant:i.variant||"secondary",onClick:i.onClick,children:i.label},z))})]})});a.__docgenInfo={description:"",methods:[],displayName:"ModalM3",props:{open:{required:!0,tsType:{name:"boolean"},description:""},onClose:{required:!0,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""},title:{required:!0,tsType:{name:"string"},description:""},children:{required:!0,tsType:{name:"ReactNode"},description:""},actions:{required:!0,tsType:{name:"Array",elements:[{name:"ModalAction"}],raw:"ModalAction[]"},description:""}}};const f=n("button",{target:"ehuqhzr0"})({name:"2ubr5j",styles:"padding:8px 16px;background-color:#1976D2;color:white;border:none;border-radius:4px;cursor:pointer;font-weight:500;&:hover{background-color:#1565C0;}"}),_={title:"M3/Modal",component:a,parameters:{layout:"centered"}},s={render:()=>{const[r,o]=u.useState(!1);return t(d,{children:[e(f,{onClick:()=>o(!0),children:"Open Modal"}),t(a,{open:r,onClose:()=>o(!1),title:"Proof Verification Details",actions:[{label:"Cancel",onClick:()=>o(!1),variant:"secondary"},{label:"Verify",onClick:()=>alert("Verified!"),variant:"primary"}],children:[e("p",{children:"This proof has been analyzed and shows strong logical structure."}),e("p",{children:"Would you like to proceed with verification?"})]})]})}},l={render:()=>{const[r,o]=u.useState(!1);return t(d,{children:[e(f,{onClick:()=>o(!0),children:"Delete Proof"}),t(a,{open:r,onClose:()=>o(!1),title:"Delete Proof?",actions:[{label:"Keep It",onClick:()=>o(!1),variant:"secondary"},{label:"Delete",onClick:()=>{alert("Deleted!"),o(!1)},variant:"primary"}],children:[e("p",{children:"Are you sure you want to delete this proof?"}),e("p",{children:"This action cannot be undone."})]})]})}},c={render:()=>{const[r,o]=u.useState(!1);return t(d,{children:[e(f,{onClick:()=>o(!0),children:"Show Info"}),t(a,{open:r,onClose:()=>o(!1),title:"Verification Results",actions:[{label:"Close",onClick:()=>o(!1),variant:"primary"}],children:[t("p",{children:[e("strong",{children:"Score:"})," 92/100"]}),t("p",{children:[e("strong",{children:"Confidence:"})," High (92%)"]}),t("p",{children:[e("strong",{children:"Status:"})," Verified"]})]})]})}},p={render:()=>{const[r,o]=u.useState(!1);return t(d,{children:[e(f,{onClick:()=>o(!0),children:"Open Modal"}),t(a,{open:r,onClose:()=>o(!1),title:"Export Proof",actions:[{label:"Cancel",onClick:()=>o(!1),variant:"secondary"},{label:"Export as JSON",onClick:()=>alert("Exported as JSON"),variant:"secondary"},{label:"Export as PDF",onClick:()=>alert("Exported as PDF"),variant:"primary"}],children:[e("p",{children:"Choose the format to export your proof:"}),t("ul",{children:[e("li",{children:"JSON: Machine-readable format"}),e("li",{children:"PDF: Human-readable document"})]})]})]})}};var m,h,g;s.parameters={...s.parameters,docs:{...(m=s.parameters)==null?void 0:m.docs,source:{originalSource:`{
  render: () => {
    const [open, setOpen] = useState(false);
    return <>
        <Button onClick={() => setOpen(true)}>Open Modal</Button>
        <ModalM3 open={open} onClose={() => setOpen(false)} title="Proof Verification Details" actions={[{
        label: 'Cancel',
        onClick: () => setOpen(false),
        variant: 'secondary'
      }, {
        label: 'Verify',
        onClick: () => alert('Verified!'),
        variant: 'primary'
      }]}>
          <p>This proof has been analyzed and shows strong logical structure.</p>
          <p>Would you like to proceed with verification?</p>
        </ModalM3>
      </>;
  }
}`,...(g=(h=s.parameters)==null?void 0:h.docs)==null?void 0:g.source}}};var y,b,x;l.parameters={...l.parameters,docs:{...(y=l.parameters)==null?void 0:y.docs,source:{originalSource:`{
  render: () => {
    const [open, setOpen] = useState(false);
    return <>
        <Button onClick={() => setOpen(true)}>Delete Proof</Button>
        <ModalM3 open={open} onClose={() => setOpen(false)} title="Delete Proof?" actions={[{
        label: 'Keep It',
        onClick: () => setOpen(false),
        variant: 'secondary'
      }, {
        label: 'Delete',
        onClick: () => {
          alert('Deleted!');
          setOpen(false);
        },
        variant: 'primary'
      }]}>
          <p>Are you sure you want to delete this proof?</p>
          <p>This action cannot be undone.</p>
        </ModalM3>
      </>;
  }
}`,...(x=(b=l.parameters)==null?void 0:b.docs)==null?void 0:x.source}}};var C,k,v;c.parameters={...c.parameters,docs:{...(C=c.parameters)==null?void 0:C.docs,source:{originalSource:`{
  render: () => {
    const [open, setOpen] = useState(false);
    return <>
        <Button onClick={() => setOpen(true)}>Show Info</Button>
        <ModalM3 open={open} onClose={() => setOpen(false)} title="Verification Results" actions={[{
        label: 'Close',
        onClick: () => setOpen(false),
        variant: 'primary'
      }]}>
          <p>
            <strong>Score:</strong> 92/100
          </p>
          <p>
            <strong>Confidence:</strong> High (92%)
          </p>
          <p>
            <strong>Status:</strong> Verified
          </p>
        </ModalM3>
      </>;
  }
}`,...(v=(k=c.parameters)==null?void 0:k.docs)==null?void 0:v.source}}};var M,O,S;p.parameters={...p.parameters,docs:{...(M=p.parameters)==null?void 0:M.docs,source:{originalSource:`{
  render: () => {
    const [open, setOpen] = useState(false);
    return <>
        <Button onClick={() => setOpen(true)}>Open Modal</Button>
        <ModalM3 open={open} onClose={() => setOpen(false)} title="Export Proof" actions={[{
        label: 'Cancel',
        onClick: () => setOpen(false),
        variant: 'secondary'
      }, {
        label: 'Export as JSON',
        onClick: () => alert('Exported as JSON'),
        variant: 'secondary'
      }, {
        label: 'Export as PDF',
        onClick: () => alert('Exported as PDF'),
        variant: 'primary'
      }]}>
          <p>Choose the format to export your proof:</p>
          <ul>
            <li>JSON: Machine-readable format</li>
            <li>PDF: Human-readable document</li>
          </ul>
        </ModalM3>
      </>;
  }
}`,...(S=(O=p.parameters)==null?void 0:O.docs)==null?void 0:S.source}}};const R=["Basic","ConfirmDelete","Information","MultipleActions"];export{s as Basic,l as ConfirmDelete,c as Information,p as MultipleActions,R as __namedExportsOrder,_ as default};
