import LMFeedClient from '@likeminds.community/feed-js-beta';
import { HelperFunctionsClass } from './helper';
interface LMFeedClientInterface {
  initiateUser(userUniqueId: string, isGuestMember: boolean, username?: string): Promise<any>;
  logout(refreshToken: string): Promise<any>;
  addPost(text: string, attachments: []): Promise<any>;
  addPost(text: string): Promise<any>;
}

export class LMClient extends HelperFunctionsClass implements LMFeedClientInterface {
  client: LMFeedClient;
  public constructor() {
    super();
    this.client = LMFeedClient.setApiKey(process.env.REACT_APP_API_KEY!)
      .setPlatformCode(process.env.REACT_APP_PLATFORM_CODE!)
      .setVersionCode(parseInt(process.env.REACT_APP_VERSION_CODE!))
      .build();
  }

  async initiateUser(userUniqueId: string, isGuestMember: boolean, username?: string) {
    try {
      const apiCallResponse = await this.client.initiateUser({
        userUniqueId,
        isGuest: isGuestMember
      });
      return this.parseDataLayerResponse(apiCallResponse);
    } catch (error) {}
  }

  async logout(refreshToken: string) {
    try {
      const apiCallResponse = await this.client.logout({
        refreshToken: refreshToken
      });
      return this.parseDataLayerResponse(apiCallResponse);
    } catch (error) {}
  }

  async addPost(text: string) {
    try {
      const validLinksArray: any[] = this.detectLinks(text);
      if (validLinksArray?.length) {
      } else {
        const apiCallResponse = await this.client.addPost({
          text: text,
          attachments: validLinksArray
        });
        return this.parseDataLayerResponse(apiCallResponse);
      }
    } catch (error) {}
  }

  async fetchFeed() {
    try {
      let apiCallResponse = await this.client.getFeed({
        page: 1,
        pageSize: 10
      });
    } catch (error) {}
  }
}
