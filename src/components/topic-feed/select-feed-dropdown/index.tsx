import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './index.css';
import { LMFeedTopics } from '@likeminds.community/feed-js';
import { lmFeedClient } from '../../../client';
import { Checkbox, FormControl, InputLabel, Menu, MenuItem, Select } from '@mui/material';
import TopicList from '../topic-list';
import TopicListItem from '../topic-list';
import TopicBlock from '../topic';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';

interface TopicFeedDropdownSelectorProps {
  setTopicsForTopicFeed: any;
  isCreateMode?: any;
  existingSelectedTopics?: LMFeedTopics[];
}

const TopicFeedDropdownSelector = ({
  setTopicsForTopicFeed,
  isCreateMode,
  existingSelectedTopics
}: TopicFeedDropdownSelectorProps) => {
  const extras = useSelector((state: RootState) => state.extras);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [topicList, setTopicList] = useState<LMFeedTopics[]>([]);
  const [shouldHide, setShouldHide] = useState<boolean>(true);
  const [checkedTopicList, setCheckedTopicList] = useState<LMFeedTopics[]>(
    isCreateMode ? [] : extras.selectedTopics
  );
  const [page, setPage] = useState<number>(1);
  const [showFilter, setShowFilter] = useState<boolean>(
    extras.selectedTopics.length ? false : true
  );
  const [searchKey, setSearchKey] = useState<string>('');
  const [hasMoreTopics, setHasMoreTopics] = useState<boolean>(true);
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchKey(e.target.value);
  }
  function handleButtonClick(e: React.MouseEvent<HTMLElement>) {
    setMenuAnchor(e.currentTarget);
  }
  function handleCloseMenu() {
    console.log(checkedTopicList);
    if (checkedTopicList.length) {
      setShowFilter(false);
    }
    // setTopicsForTopicFeed(checkedTopicList);
    setMenuAnchor(null);
  }
  const menuButtonClickHandler = useCallback(
    function (topic: LMFeedTopics) {
      switch (checkedTopicList.some((el) => el.Id === topic.Id)) {
        case true: {
          const idIndex = checkedTopicList.findIndex((element) => element.Id === topic.Id);
          const newCheckedList = [...checkedTopicList];
          newCheckedList.splice(idIndex, 1);
          console.log('checking for newCheckedList');
          console.log(newCheckedList);
          setCheckedTopicList(newCheckedList);
          // emptying the existing selected prop to [] when create mode is on
          // if (isCreateMode && newCheckedList.length === 0) {
          //   setShowFilter(true);
          //   setMenuAnchor(null);
          //   // existingSelectedTopics = [];
          // }
          return;
        }
        case false: {
          const newCheckedList = [...checkedTopicList];
          newCheckedList.push(topic);
          setCheckedTopicList(newCheckedList);
          return;
        }
      }
    },
    [checkedTopicList]
  );
  function onDeleteClick(id: string) {
    const idIndex = checkedTopicList.findIndex((element) => element.Id === id);
    const newCheckedList = [...checkedTopicList];
    newCheckedList.splice(idIndex, 1);

    if (!newCheckedList.length) {
      setTopicsForTopicFeed(newCheckedList);
      existingSelectedTopics = [];
      console.log('The existing selected topic list after emptying');

      setShowFilter(true);
    }
    // setTopicsForTopicFeed(newCheckedList);
    setCheckedTopicList(newCheckedList);
  }
  function clearAllCheckedTopics() {
    setCheckedTopicList([]);
    setTopicsForTopicFeed([]);
    setShowFilter(true);
    // setTopicsForTopicFeed([]);
  }
  function handleSelectAll() {
    setCheckedTopicList([]);
  }
  const searchBox = (
    <div className="topicSearchBoxContainer">
      <svg
        className="searchIcon"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path
          d="M6.3833 12.8767C7.76953 12.8767 9.04785 12.4285 10.0938 11.6814L14.0283 15.616C14.2109 15.7986 14.4517 15.8899 14.709 15.8899C15.2485 15.8899 15.6304 15.4749 15.6304 14.9436C15.6304 14.6946 15.5474 14.4539 15.3647 14.2795L11.4551 10.3616C12.2769 9.28247 12.7666 7.94604 12.7666 6.49341C12.7666 2.98218 9.89453 0.110107 6.3833 0.110107C2.88037 0.110107 0 2.97388 0 6.49341C0 10.0046 2.87207 12.8767 6.3833 12.8767ZM6.3833 11.4988C3.64404 11.4988 1.37793 9.23267 1.37793 6.49341C1.37793 3.75415 3.64404 1.48804 6.3833 1.48804C9.12256 1.48804 11.3887 3.75415 11.3887 6.49341C11.3887 9.23267 9.12256 11.4988 6.3833 11.4988Z"
          fill="#3C3C43"
          fillOpacity="0.6"
        />
      </svg>
      <input
        className="topicSearchBox"
        placeholder="Search"
        value={searchKey}
        onChange={handleInputChange}
      />
    </div>
  );

  const handleFilterView = function () {
    switch (showFilter) {
      case true: {
        return (
          <div>
            <button onClick={handleButtonClick} className="allTopicButton">
              All Topics{' '}
              <svg
                style={{
                  marginLeft: '2px'
                }}
                width="12"
                height="16"
                viewBox="0 0 12 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M6.52567 15.7821L11.287 11.0208C11.5775 10.7303 11.5775 10.2591 11.287 9.96863C10.9964 9.67807 10.5254 9.67807 10.2349 9.96863L6.74356 13.4599L6.74356 0.743959C6.74356 0.333115 6.41044 0 5.9996 0C5.58882 0 5.25564 0.333115 5.25564 0.743959L5.25564 13.4599L1.76433 9.96875C1.47377 9.67819 1.00275 9.67819 0.712193 9.96875C0.567032 10.114 0.494303 10.3044 0.494303 10.4948C0.494303 10.6852 0.567032 10.8756 0.712193 11.0209L5.47353 15.7821C5.76409 16.0727 6.23511 16.0727 6.52567 15.7821Z"
                  fill="#666666"
                />
              </svg>
            </button>
            <Menu
              anchorEl={menuAnchor}
              open={Boolean(menuAnchor)}
              onClose={handleCloseMenu}
              anchorOrigin={{
                horizontal: 'left',
                vertical: 'bottom'
              }}
              slotProps={{
                paper: {
                  sx: {
                    height: '341px',
                    paddingX: '24px',
                    marginTop: '6px',
                    borderRadius: '8px',
                    paddingTop: '0px'
                  },
                  id: 'scrollerTopics'
                }
              }}>
              <InfiniteScroll
                next={getFeedTopics}
                hasMore={hasMoreTopics}
                loader={null}
                dataLength={topicList.length}
                scrollableTarget={'scrollerTopics'}>
                {searchBox}
                <MenuItem
                  disableRipple={true}
                  role="option"
                  key={Math.random()}
                  sx={{
                    padding: '0px',
                    borderBottom: '1px solid rgba(208, 216, 226, 0.40)'
                  }}>
                  <TopicListItem
                    clickHandler={handleSelectAll}
                    topic={{
                      Id: Math.random().toString(),
                      name: 'All Topics',
                      isEnabled: true
                    }}
                    checkedList={checkedTopicList}
                  />
                </MenuItem>

                {menuList}
              </InfiniteScroll>
            </Menu>
          </div>
        );
      }
      case false: {
        return (
          <div className="displaySelectedTopicsContainer">
            <div className="topicTagsContainer">
              {checkedTopicList.map((topic) => {
                return <TopicBlock onDeleteClick={onDeleteClick} key={topic.Id} topic={topic} />;
              })}
            </div>
            <div className="clearButton" onClick={clearAllCheckedTopics}>
              <span>Clear</span>
            </div>
          </div>
        );
      }
    }
  };
  const setTopicsForPostView = function () {
    switch (showFilter) {
      case true: {
        return (
          <div>
            <button onClick={handleButtonClick} className="postCreationAllTopicButton">
              <svg
                style={{
                  marginRight: '4px'
                }}
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M2 8C2 8.16537 2.05939 8.30749 2.17818 8.42636C2.29697 8.54005 2.43641 8.5969 2.59651 8.5969H7.40736V13.4109C7.40736 13.5711 7.46417 13.708 7.57779 13.8217C7.69658 13.9406 7.83861 14 8.00387 14C8.16398 14 8.30084 13.9406 8.41446 13.8217C8.52808 13.708 8.58489 13.5711 8.58489 13.4109V8.5969H13.4112C13.5713 8.5969 13.7082 8.54005 13.8218 8.42636C13.9406 8.30749 14 8.16537 14 8C14 7.83979 13.9406 7.70284 13.8218 7.58915C13.7082 7.47028 13.5713 7.41085 13.4112 7.41085H8.58489V2.58915C8.58489 2.43411 8.52808 2.29716 8.41446 2.17829C8.30084 2.05943 8.16398 2 8.00387 2C7.83861 2 7.69658 2.05943 7.57779 2.17829C7.46417 2.29716 7.40736 2.43411 7.40736 2.58915V7.41085H2.59651C2.43641 7.41085 2.29697 7.47028 2.17818 7.58915C2.05939 7.70284 2 7.83979 2 8Z"
                  fill="#5046E5"
                />
              </svg>
              Select Topics{' '}
            </button>
            <Menu
              anchorEl={menuAnchor}
              open={Boolean(menuAnchor)}
              onClose={handleCloseMenu}
              anchorOrigin={{
                horizontal: 'left',
                vertical: 'bottom'
              }}
              slotProps={{
                paper: {
                  sx: {
                    height: '284px',
                    paddingX: '24px',
                    marginTop: '6px',
                    borderRadius: '8px',
                    paddingTop: '0px'
                  },
                  id: 'scrollerTopics'
                }
              }}>
              <InfiniteScroll
                next={getFeedTopics}
                hasMore={hasMoreTopics}
                loader={null}
                dataLength={topicList.length}
                scrollableTarget={'scrollerTopics'}>
                {searchBox}
                {/* {menuListOfSelectedTopics} */}
                {menuList}
              </InfiniteScroll>
            </Menu>
          </div>
        );
      }
      case false: {
        return (
          <div className="displaySelectedTopicsContainer">
            <Menu
              anchorEl={menuAnchor}
              open={Boolean(menuAnchor)}
              onClose={handleCloseMenu}
              anchorOrigin={{
                horizontal: 'left',
                vertical: 'bottom'
              }}
              slotProps={{
                paper: {
                  sx: {
                    height: '284px',
                    paddingX: '24px',
                    marginTop: '6px',
                    borderRadius: '8px',
                    paddingTop: '0px'
                  },
                  id: 'scrollerTopics'
                }
              }}>
              <InfiniteScroll
                next={getFeedTopics}
                hasMore={hasMoreTopics}
                loader={null}
                dataLength={topicList.length}
                scrollableTarget={'scrollerTopics'}>
                {searchBox}
                {menuListOfSelectedTopics}
                {menuList}
              </InfiniteScroll>
            </Menu>
            <div className="topicTagsContainer">
              {checkedTopicList.map((topic) => {
                return (
                  <TopicBlock
                    isCreateMode={true}
                    onDeleteClick={onDeleteClick}
                    key={topic.Id}
                    topic={topic}
                  />
                );
              })}
              <div className="editTopicsIcon" onClick={handleButtonClick}>
                {' '}
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M15.754 5.41104L14.6656 4.31708C14.245 3.89431 13.5619 3.89431 13.1399 4.31708L12.0973 5.36498L14.5379 7.81801L15.754 6.59569C16.0803 6.26776 16.0803 5.73894 15.754 5.41104ZM11.4615 6.00267L13.9021 8.45567L7.72422 14.665L5.285 12.212L11.4615 6.00267ZM4.34375 15.9919C4.14383 16.0408 3.96335 15.8608 4.00777 15.6599L4.62417 12.8762L7.06339 15.3292L4.34375 15.9919Z"
                    fill="#5046E5"
                  />
                </svg>
              </div>
            </div>
          </div>
        );
      }
    }
  };
  const setView = function () {
    switch (isCreateMode) {
      case true: {
        return setTopicsForPostView();
      }
      default:
        return handleFilterView();
    }
  };
  const getFeedTopics = useCallback(
    async (pageNo?: number) => {
      try {
        const call = await lmFeedClient.getTopics(
          searchKey,
          'name',
          pageNo ? pageNo : page,
          10,
          isCreateMode ? true : null
        );
        const existingAddedTopicList = existingSelectedTopics?.map((topic) => topic.Id);

        let newTopicList: LMFeedTopics[] = call.data.topics;
        newTopicList = newTopicList.filter((topic) => {
          if (!existingAddedTopicList?.includes(topic.Id)) {
            return true;
          }
        });
        if (pageNo) {
          setPage(2);

          setTopicList(newTopicList);
          if (newTopicList.length && searchKey === '') {
            setShouldHide(false);
          }
        } else {
          setPage(page + 1);
          if (page === 1) {
            setTopicList(newTopicList);
          } else {
            setTopicList(topicList.concat(newTopicList));
          }
        }
      } catch (error) {
        console.log(error);
      }
    },
    [page, searchKey, topicList, existingSelectedTopics, isCreateMode]
  );
  const menuList = useMemo(() => {
    return topicList.map((topic: LMFeedTopics) => {
      return (
        <MenuItem
          disableRipple={true}
          value={topic.Id}
          role="option"
          key={topic.Id}
          sx={{
            padding: '0px'
          }}>
          <TopicListItem
            clickHandler={menuButtonClickHandler}
            topic={topic}
            checkedList={checkedTopicList}
          />
        </MenuItem>
      );
    });
  }, [topicList, checkedTopicList, isCreateMode]);
  const menuListOfSelectedTopics = useMemo(() => {
    return existingSelectedTopics?.map((topic: LMFeedTopics) => {
      return (
        <MenuItem
          disableRipple={true}
          value={topic?.Id}
          role="option"
          key={topic?.Id}
          sx={{
            padding: '0px'
          }}>
          <TopicListItem
            clickHandler={menuButtonClickHandler}
            topic={topic}
            checkedList={checkedTopicList}
          />
        </MenuItem>
      );
    });
  }, [topicList, checkedTopicList, isCreateMode, existingSelectedTopics]);
  // useEffect(() => {
  //   if (isCreateMode) {
  //     if (searchKey?.trim()?.length === 0) {
  //       console.log('The existing selected positcs are');
  //       console.log(existingSelectedTopics);
  //       setTopicList([...existingSelectedTopics!]);
  //     }
  //   }
  // }, [searchKey, existingSelectedTopics, isCreateMode]);
  useEffect(() => {
    if (existingSelectedTopics && existingSelectedTopics.length) {
      setCheckedTopicList(existingSelectedTopics);
      setShowFilter(false);
    }
  }, [existingSelectedTopics]);
  useEffect(() => {
    const debouncedSearch = setTimeout(() => getFeedTopics(1), 500);
    return () => clearTimeout(debouncedSearch);
  }, [searchKey, existingSelectedTopics]);
  useEffect(() => {
    if (showFilter) {
      return;
    }
    if (isCreateMode && checkedTopicList.length === 0) {
      setShowFilter(true);
      setMenuAnchor(null);
      // existingSelectedTopics = [];
    }
    console.log('Checkeching for checkedTOpicList');
    console.log(checkedTopicList);
    setTopicsForTopicFeed(checkedTopicList);
  }, [checkedTopicList, showFilter]);
  useEffect(() => {
    return () => {
      setSearchKey('');
    };
  }, [menuAnchor]);
  if (shouldHide) {
    return null;
  }
  return setView();
};

export default TopicFeedDropdownSelector;
