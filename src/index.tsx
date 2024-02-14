import React from 'react';
import ReactDOM from 'react-dom/client';

import LMFeed from './App';

import { LMClient } from './services';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
export const lmFeedClient: LMClient = new LMClient();
root.render(<LMFeed />);
