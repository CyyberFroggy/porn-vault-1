import "mocha";

import { assert } from "chai";
import { existsSync, unlinkSync } from "fs";
import sinon from "sinon";

import { checkConfig } from "../../src/config";

describe("config", () => {
  it("writes default config.test.json", async () => {
    const configFilename = "config.test.json";

    if (existsSync(configFilename)) {
      unlinkSync(configFilename);
    }
    assert.isFalse(existsSync(configFilename));

    // Stub the exit so we can test if the file was actually written
    sinon.stub(process, "exit");
    assert.isFalse((<any>process.exit).called);

    await checkConfig();

    assert.isTrue((<any>process.exit).called);
    assert.isTrue(existsSync(configFilename));

    // Restore the stubbed function
    (<any>process.exit).restore();
  });
});
