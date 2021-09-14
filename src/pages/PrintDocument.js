import React from 'react';
import '@progress/kendo-ui';
import {Barcode} from "@progress/kendo-barcodes-react-wrapper";

const PrintDocument = ({label, selectedDate}) => {
  return (
    <div
      style={{
        fontFamily: 'Open Sans, sans-serif',
        textAlign: 'center',
        position: 'relative',
        fontSize: 8,
        width: 216,
        height: 144,
        margin: '0 auto',
      }}>
      <div style={{width: 144, maxWidth: 144, transform: 'rotate(-90deg) translate(-144px, 3px)', transformOrigin: 'left top'}}>
        {Object.keys(label).length > 0 &&
        <Barcode type={"code128"} width={144} height={50} text={{font: '8px monospace'}} value={label.fnsku}/>
        }
      </div>
      <div style={{width: 144, maxWidth: 144, padding: '0 3px', transform: 'rotate(-90deg) translate(-94px, 53px)', transformOrigin: 'left top', height: 22, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{label.item_name}</div>
      <div style={{width: 144, maxWidth: 144, padding: '0 3px', transform: 'rotate(-90deg) translate(-72px, 76px)', transformOrigin: 'left top', }}>{label.condition}</div>
      <div style={{width: 144, maxWidth: 144, padding: '0 3px', transform: 'rotate(-90deg) translate(-61px, 87px)', transformOrigin: 'left top', }}>{`BEST BY: ${selectedDate.getMonth() + 1}/${selectedDate.getDate()}/${selectedDate.getFullYear()}`}</div>
      <div style={{width: 141, maxWidth: 141, padding: '3px 0', transform: 'rotate(-90deg) translate(-48px, 100px)', transformOrigin: 'left top', border: '1px solid'}} className="separate"><span style={{fontWeight: 'bold', marginLeft: -5}}>THIS IS A SET - DO NOT SEPARATE</span></div>
      <div style={{width: 144, maxWidth: 144, padding: '0 7px', transform: 'rotate(-90deg) translate(-28px, 119px)', transformOrigin: 'left top', fontSize: 10}} className="warning">
        Warning: To avoid the danger of suffocation, keep this plastic bag away from babies and children. Do not use this bag in cribs, beds, carriages, or playpens. This bag is not a toy.
      </div>
    </div>
  );
};

export default PrintDocument;
