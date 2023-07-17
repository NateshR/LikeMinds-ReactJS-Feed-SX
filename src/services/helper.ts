interface HelperFunctionsInterface {
  detectLinks(text: string): any[];
  parseDataLayerResponse(response: any): any;
}

export class HelperFunctionsClass implements HelperFunctionsInterface {
  detectLinks(text: string) {
    const regex = /((http|https):\/\/[^\s]+)/g;
    const links = text.match(regex);
    return links ? links : [];
  }

  parseDataLayerResponse(response: any) {
    return {
      ...response,
    };
  }
}
