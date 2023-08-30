// import React, { useRef } from 'react';
// import './dialogBox.css';
// type DialogBoxType = {
//   children: any;
//   openCreatePostDialog: boolean;
//   closeCreatePostDialog: any;
// };
// const DialogBox = ({ children, openCreatePostDialog, closeCreatePostDialog }: any) => {
//   const dialogBoxRef = useRef<any>(null);

//   function passPropToChildren() {
//     return React.Children.map(children, (child) => {
//       if (React.isValidElement(child)) {
//         return React.cloneElement<any>(child, {
//           dialogBoxRef,
//           closeCreatePostDialog
//         });
//       }
//     });
//   }

//   return (
//     <div
//       ref={dialogBoxRef}
//       className="lmWrapper-dialog"
//       style={{
//         display: openCreatePostDialog ? 'block' : 'none'
//       }}>
//       {passPropToChildren()}
//     </div>
//   );
// };

// export default DialogBox;
export default function DialogBox() {
  return null;
}
