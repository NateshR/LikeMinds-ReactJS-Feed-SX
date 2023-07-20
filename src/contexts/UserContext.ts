import React from 'react';
const UserContext = React.createContext<UserContextInterface>({
  user: null,
  setUser: null
});

interface UserContextInterface {
  user: null | User;
  setUser: null | any;
}

type User = {
  id: any;
  image_url: any;
  is_guest: boolean;
  name: any;
  organisation_name: any;
  sdk_client_info: any;
  updated_at: any;
  user_unique_id: any;
  uuid: any;
};

export default UserContext;
