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
  entity?: any;
};
const ReportPostDialogBox = ({
  entity,
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
    <div className="lmReport">
      <div className="lmReport-header">
        Report Post
        <IconButton onClick={closeBox} className="close">
          <CloseIcon />
        </IconButton>
      </div>

      <div className="lmReport-body">
        <p className="lm-title">Please specify the problem to continue</p>
        <p>You would be able to report this Post after selecting a problem.</p>
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
      </div>
      <div className="lmReport-footer">
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
              lmFeedClient.reportPost(
                reportedPostId,
                uuid,
                entity ? entity : 5,
                11,
                otherReasonsText
              );
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
    className="lmReportTag"
    style={{
      border: selectedId === id ? '1px solid #5046e4' : '1px solid rgba(72, 79, 103, 0.5)',
      color: selectedId === id ? '#5046e4' : 'rgba(72, 79, 103, 0.5)'
    }}>
    {/* // className="inline-block border rounded-[20px] py-2 px-3 mr-2 mb-2 text-sm text=[#9b9b9b]"> */}
    {name}
  </div>
);

export default ReportPostDialogBox;
