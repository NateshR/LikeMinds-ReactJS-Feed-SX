import { IMemberState } from '@likeminds.community/feed-js';
import React from 'react';
const UserContext = React.createContext<UserContextInterface>({
  user: null,
  setUser: null,
  memberStateRights: null
});

interface UserContextInterface {
  user: null | User;
  setUser: null | any;
  memberStateRights: null | IMemberState;
}

type User = {
  id: any;
  imageUrl: any;
  isGuest: boolean;
  name: any;
  organisationName: any;
  sdkClientInfo: any;
  updatedAt: any;
  userUniqueId: any;
  uuid: any;
};

export default UserContext;
