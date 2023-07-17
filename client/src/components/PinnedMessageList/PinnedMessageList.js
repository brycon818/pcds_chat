import React from 'react';
import { Message, MessageSimple, useChannelActionContext, useChannelStateContext } from 'stream-chat-react';

import './PinnedMessageList.css';

import { CloseThreadIcon } from '../../assets';

export const PinnedMessageList = (props) => {
  const { setPinsOpen } = props;

  const { closeThread } = useChannelActionContext();

  const { channel } = useChannelStateContext();
  console.log(channel);

  return (
    <div className='pinned-messages__container'>
      <div className='pinned-messages__header'>
        <p className='pinned-messages__header-text'>Pins</p>
        <CloseThreadIcon {...{ closeThread, setPinsOpen }} />
      </div>
      <div className='pinned-messages__list'>
        {channel.state.pinnedMessages.map((message, i) => (
           <MessageSimple
           message={{ ...message, user: {}}}
           // handleOpenThread={}
       />
        ))}
      </div>
    </div>
  );
};
