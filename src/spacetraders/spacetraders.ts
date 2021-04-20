import { SpaceTraders } from "spacetraders-sdk";
import { System } from "spacetraders-sdk/dist/types";

//This file is a workaround while spacetraders-io's cutting-edge isn't released yet.

//SystemsResponse bug solved
export interface SystemsResponse {
  systems: System[]
}

//Class extensions
class SpaceTradersExtend extends SpaceTraders {

  //SystemResponse bug
  async listSystemsFixed(): Promise<SystemsResponse> {
    const _: any = await this.listSystems()
    return _
  }
}

export default SpaceTradersExtend