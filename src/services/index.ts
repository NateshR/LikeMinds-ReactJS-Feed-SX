import LMFeedClient from "@likeminds.community/feed-js-beta";
interface LMFeedClientInterface {
  initiateUser(
    userUniqueId: string,
    isGuestMember: boolean,
    username?: string
  ): Promise<any>;
}

export class LMClient implements LMFeedClientInterface {
  client: LMFeedClient;
  public constructor() {
    this.client = LMFeedClient.setApiKey(process.env.REACT_APP_API_KEY!)
      .setPlatformCode(process.env.REACT_APP_PLATFORM_CODE!)
      .setVersionCode(parseInt(process.env.REACT_APP_VERSION_CODE!))
      .build();
  }

  async initiateUser(
    userUniqueId: string,
    isGuestMember: boolean,
    username?: string
  ) {
    try {
      const apiCallResponse = await this.client.initiateUser({
        userUniqueId,
        isGuest: isGuestMember,
      });
    } catch (error) {}
  }
}
