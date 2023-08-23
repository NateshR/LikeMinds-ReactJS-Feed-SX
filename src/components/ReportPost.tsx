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
              />
            ))}
          </div>
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
};
const ReportedReasonBlock = ({ reportedPostId, name, id, uuid, closeBox }: ReasonType) => (
  <div
    onClick={() => {
      lmFeedClient.reportPost(reportedPostId, uuid, 5, id, '');
      closeBox();
    }}
    className="lmReportTag">
    {/* // className="inline-block border rounded-[20px] py-2 px-3 mr-2 mb-2 text-sm text=[#9b9b9b]"> */}
    {name}
  </div>
);

export default ReportPostDialogBox;
