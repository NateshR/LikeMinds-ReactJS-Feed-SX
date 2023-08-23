/* eslint-disable no-use-before-define */
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import React, { useEffect, useState } from 'react';
import { lmFeedClient } from '..';
// import { getReportingOptions } from "../../../sdkFunctions";

type ReportConversationDialogBoxType = {
  closeBox: any;
  reportedPostId: any;
  uuid: any;
};
const ReportPostDialogBox = ({
  closeBox,
  reportedPostId,
  uuid
}: ReportConversationDialogBoxType) => {
  const [reasonArr, setReasonArr] = useState([]);
  const [openOtherReasonsInputBox, setOpenOtherReasonsInputBox] = useState(false);
  const [otherReasonsText, setOtherReasonsText] = useState('');
  const [selectedId, setSelectedId] = useState(-1);
  async function reportPostTags() {
    try {
      const tags: any = await lmFeedClient.getReportTags();
      setReasonArr(tags.data.reportTags);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    reportPostTags();
  }, []);
  return (
    <div style={{ backgroundColor: 'white', padding: '16px', width: '400px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px' }}>
        <div style={{ fontSize: '16px', fontWeight: 'bold', marginTop: '8px' }}>Report Post</div>
        <IconButton onClick={closeBox} style={{ cursor: 'pointer' }}>
          <CloseIcon />
        </IconButton>
      </div>

      <div style={{ padding: '16px', paddingBottom: '16px' }}>
        <p style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>
          Please specify the problem to continue
        </p>
        <p style={{ fontSize: '14px', fontWeight: 'normal', color: '#666666' }}>
          You would be able to report this Post after selecting a problem.
        </p>
        <div style={{ marginTop: '12px', width: '100%', textAlign: 'center' }}>
          <div style={{ marginTop: '12px', width: '100%', textAlign: 'left' }}>
            {reasonArr.map((item: any) => (
              <ReportedReasonBlock
                reportedPostId={reportedPostId}
                name={item.name}
                id={item.id}
                key={item?.id}
                uuid={uuid}
                closeBox={closeBox}
                setOpenOtherReasonsInputBox={setOpenOtherReasonsInputBox}
                selectedId={selectedId}
                setSelectedId={setSelectedId}
              />
            ))}
          </div>
        </div>
        <div
          style={{
            display: openOtherReasonsInputBox ? 'block' : 'none'
          }}>
          <input
            type="text"
            value={otherReasonsText}
            onChange={(e) => setOtherReasonsText(e.target.value)}
          />
        </div>
        <div>
          <button
            disabled={!(selectedId > 0)}
            onClick={() => {
              lmFeedClient.reportPost(reportedPostId, uuid, 5, 11, otherReasonsText);
              closeBox();
            }}>
            Report
          </button>
        </div>
      </div>
    </div>
  );
};
type ReasonType = {
  reportedPostId: any;
  name: any;
  id: any;
  uuid: any;
  closeBox: any;
  setOpenOtherReasonsInputBox: any;
  selectedId: any;
  setSelectedId: any;
};
const ReportedReasonBlock = ({
  reportedPostId,
  name,
  id,
  uuid,
  closeBox,
  setOpenOtherReasonsInputBox,
  setSelectedId,
  selectedId
}: ReasonType) => (
  <div
    onClick={() => {
      setSelectedId(id);
      if (id === 11) {
        setOpenOtherReasonsInputBox(true);
        return;
      } else {
        setOpenOtherReasonsInputBox(false);
      }
    }}
    style={{
      display: 'inline-block',
      cursor: 'pointer',
      border: '1px solid rgb(155, 155, 155)',
      borderRadius: '20px',
      padding: '0.5rem 0.75rem',
      margin: '0px 0.5rem 0.5rem 0px',
      fontSize: '14px',
      color: '#9b9b9b',
      backgroundColor: selectedId === id ? 'blue' : 'white'
    }}>
    {/* // className="inline-block border rounded-[20px] py-2 px-3 mr-2 mb-2 text-sm text=[#9b9b9b]"> */}
    {name}
  </div>
);

export default ReportPostDialogBox;
